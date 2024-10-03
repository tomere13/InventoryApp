"use strict";
// src/routes/sendReport.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_1 = __importDefault(require("../models/item"));
const Report_1 = __importDefault(require("../models/Report")); // Import the Report model
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const Branch_1 = __importDefault(require("../models/Branch"));
dotenv_1.default.config();
const router = express_1.default.Router();
// POST /api/:branchId/sendreport
router.post('/:branchId/sendreport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId } = req.params;
    const { stockReport, notes } = req.body;
    console.log(`Received sendReport request for branchId: ${branchId}`);
    console.log('Stock Report Data:', stockReport);
    console.log('Notes:', notes); // If notes are included
    if (!stockReport || !Array.isArray(stockReport)) {
        console.error('Invalid stock report data received.');
        return res.status(400).json({ message: 'Invalid stock report data.' });
    }
    try {
        // Fetch branch details to get the branch name
        const branch = yield Branch_1.default.findById(branchId);
        if (!branch) {
            console.error(`Branch with ID ${branchId} not found.`);
            return res.status(404).json({ message: 'Branch not found.' });
        }
        const branchName = branch.name;
        console.log(`Branch Name: ${branchName}`);
        // Fetch current items from the database
        const items = yield item_1.default.find({ branch: branchId });
        console.log(`Fetched ${items.length} items from branch ${branchId}.`);
        // Retrieve and format current date and time
        const now = new Date();
        const formattedDate = `תאריך: ${now.toLocaleDateString('he-IL')} בשעה: ${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
        // Prepare email content with date and time
        let emailContent = `${formattedDate}\n\nהזנה למלאי נדרשת עבור הסניף: ${branchName}\n\n`;
        let itemsToOrder = [];
        // Array to store the differences for the report
        const stockReportDifferences = [];
        stockReport.forEach((reportItem) => {
            const item = items.find((i) => i._id.toString() === reportItem.itemId);
            if (item) {
                const difference = item.quantity - reportItem.currentStock;
                stockReportDifferences.push({ itemId: reportItem.itemId, difference });
                if (difference > 0) {
                    itemsToOrder.push({ name: item.name, quantity: difference });
                    emailContent += `- ${item.name}: להזמנה ${difference} יחידות\n`;
                }
            }
            else {
                console.warn(`Item with ID ${reportItem.itemId} not found in branch ${branchId}.`);
                // Optionally, handle items not found in the database
                stockReportDifferences.push({ itemId: reportItem.itemId, difference: 0 });
            }
        });
        console.log(`Items to order: ${JSON.stringify(itemsToOrder, null, 2)}`);
        if (itemsToOrder.length === 0) {
            emailContent = `${formattedDate}\n\nאין צורך בהזמנה של פריטים נוספים כרגע.`;
            console.log('No items require ordering. Email will be sent with no items.');
        }
        // Append notes to the email content if provided
        if (notes && notes.trim().length > 0) {
            emailContent += `\nהערות נוספות:\n${notes}`;
            console.log('Added notes to email content.');
        }
        // Send email if there are items to order or if notes are provided
        if (itemsToOrder.length > 0 || (notes && notes.trim().length > 0)) {
            // Configure Nodemailer transporter with App Password
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'etomer9@gmail.com',
                subject: `דוח הזנה למלאי - סניף ${branchName}`,
                text: emailContent,
            };
            console.log('Prepared mail options:', mailOptions);
            // Send the email
            yield transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${mailOptions.to}`);
        }
        else {
            console.log('No email sent as there are no items to order and no notes provided.');
        }
        // Save the report to the database with differences
        const report = new Report_1.default({
            branchId: branchId,
            stockReport: stockReportDifferences.map((item) => ({
                itemId: item.itemId,
                currentStock: item.difference, // Save the difference instead of reported currentStock
            })),
            notes: notes || '',
            dateSent: now,
        });
        yield report.save();
        console.log(`Report for branch ${branchId} saved to the database.`);
        // Respond to the client
        res.status(200).json({ message: 'דוח נשלח והנשמר בהצלחה.' });
        console.log(`Report for branch ${branchId} processed successfully.`);
    }
    catch (error) {
        console.error('Error sending report:', error);
        res.status(500).json({ message: 'אירעה שגיאה בשליחת הדוח.' });
    }
}));
exports.default = router;
