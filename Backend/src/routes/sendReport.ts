// src/routes/sendReport.ts

import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/item';
import Report, { IReport } from '../models/Report'; // Import the Report model
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Branch from '../models/Branch';
import { IBranch } from '../types'; // Ensure this is correctly defined

dotenv.config();

const router = express.Router();

// Define the structure of the stock report
interface IStockReport {
  itemId: string;
  currentStock: number;
}

// Define the structure of the stock report request (including notes if previously added)
interface IStockReportRequest {
  stockReport: IStockReport[];
  notes?: string;
}

// POST /api/:branchId/sendreport
router.post('/:branchId/sendreport', async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const { stockReport, notes } = req.body as IStockReportRequest;

  console.log(`Received sendReport request for branchId: ${branchId}`);
  console.log('Stock Report Data:', stockReport);
  console.log('Notes:', notes); // If notes are included

  if (!stockReport || !Array.isArray(stockReport)) {
    console.error('Invalid stock report data received.');
    return res.status(400).json({ message: 'Invalid stock report data.' });
  }

  try {
    // Fetch branch details to get the branch name
    const branch: IBranch | null = await Branch.findById(branchId);
    if (!branch) {
      console.error(`Branch with ID ${branchId} not found.`);
      return res.status(404).json({ message: 'Branch not found.' });
    }

    const branchName = branch.name;
    console.log(`Branch Name: ${branchName}`);

    // Fetch current items from the database
    const items: IItem[] = await Item.find({ branch: branchId });

    console.log(`Fetched ${items.length} items from branch ${branchId}.`);

    // Retrieve and format current date and time
    const now = new Date();
    const formattedDate = `תאריך: ${now.toLocaleDateString('he-IL')} בשעה: ${now.toLocaleTimeString(
      'he-IL',
      { hour: '2-digit', minute: '2-digit' }
    )}`;

    // Prepare email content with date and time
    let emailContent = `${formattedDate}\n\nהזנה למלאי נדרשת עבור הסניף: ${branchName}\n\n`;
    let itemsToOrder: { name: string; quantity: number }[] = [];

    // Array to store the differences for the report
    const stockReportDifferences: { itemId: string; difference: number }[] = [];

    stockReport.forEach((reportItem) => {
      const item = items.find((i) => i._id.toString() === reportItem.itemId);
      if (item) {
        const difference = item.quantity - reportItem.currentStock;
        stockReportDifferences.push({ itemId: reportItem.itemId, difference });

        if (difference > 0) {
          itemsToOrder.push({ name: item.name, quantity: difference });
          emailContent += `- ${item.name}: להזמנה ${difference} יחידות\n`;
        }
      } else {
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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Use App Password here
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'etomer9@gmail.com',
        subject: `דוח הזנה למלאי - סניף ${branchName}`,
        text: emailContent,
        // For HTML content, uncomment the line below and comment out the 'text' field
        // html: `<p>${formattedDate}</p>
        //        <p>הזנה למלאי נדרשת עבור הסניף:</p>
        //        <ul>
        //          ${itemsToOrder.map(item => `<li>${item.name}: להזמנה ${item.quantity} יחידות</li>`).join('')}
        //        </ul>
        //        ${notes ? `<p>הערות נוספות:</p><p>${notes}</p>` : ''}`,
      };

      console.log('Prepared mail options:', mailOptions);

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${mailOptions.to}`);
    } else {
      console.log('No email sent as there are no items to order and no notes provided.');
    }

    // Save the report to the database with differences
    const report: IReport = new Report({
      branchId: branchId,
      stockReport: stockReportDifferences.map((item) => ({
        itemId: item.itemId,
        currentStock: item.difference, // Save the difference instead of reported currentStock
      })),
      notes: notes || '',
      dateSent: now,
    });

    await report.save();
    console.log(`Report for branch ${branchId} saved to the database.`);

    // Respond to the client
    res.status(200).json({ message: 'דוח נשלח והנשמר בהצלחה.' });
    console.log(`Report for branch ${branchId} processed successfully.`);
  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשליחת הדוח.' });
  }
});

export default router;