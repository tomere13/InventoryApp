"use strict";
// src/routes/reports.ts
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
const Report_1 = __importDefault(require("../models/Report"));
const router = express_1.default.Router();
// GET /api/reports - Retrieve all reports
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield Report_1.default.find()
            .populate('branchId', 'name') // Populate branch name
            .populate('stockReport.itemId', 'name description price') // Populate item details
            .sort({ dateSent: -1 }); // Sort by latest first
        // Add console log to inspect the fetched reports
        console.log('Fetched Reports:', JSON.stringify(reports, null, 2));
        res.status(200).json({ reports });
        console.log(`Fetched ${reports.length} reports.`);
    }
    catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'אירעה שגיאה בשליפת הדוחות.' });
    }
}));
// GET /api/reports/:reportId - Retrieve a specific report
router.get('/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    console.log(`Received request for reportId: ${reportId}`);
    // Validate reportId format
    if (!reportId || !reportId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log('Invalid reportId format.');
        return res.status(400).json({ message: 'דוח לא תקין.' });
    }
    try {
        const report = yield Report_1.default.findById(reportId)
            .populate('branchId', 'name') // Populate branch name
            .populate('stockReport.itemId', 'name description price') // Populate item details
            .lean(); // Use lean for plain JavaScript object
        if (!report) {
            console.log(`Report not found with ID: ${reportId}`);
            return res.status(404).json({ message: 'דוח לא נמצא.' });
        }
        console.log(`Fetched Report: ${JSON.stringify(report, null, 2)}`);
        res.status(200).json({ report });
    }
    catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'אירעה שגיאה בשליפת הדוח.' });
    }
}));
exports.default = router;
