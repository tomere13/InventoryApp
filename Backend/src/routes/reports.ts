// src/routes/reports.ts

import express, { Request, Response } from 'express';
import Report from '../models/Report';
import { IReport } from '../models/Report';

const router = express.Router();

// GET /api/reports - Retrieve all reports
router.get('/', async (req: Request, res: Response) => {
  try {
    const reports: IReport[] = await Report.find()
      .populate('branchId', 'name') // Populate branch name
      .populate('stockReport.itemId', 'name description price') // Populate item details
      .sort({ dateSent: -1 }); // Sort by latest first

    // Add console log to inspect the fetched reports
    console.log('Fetched Reports:', JSON.stringify(reports, null, 2));

    res.status(200).json({ reports });
    console.log(`Fetched ${reports.length} reports.`);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשליפת הדוחות.' });
  }
});

// GET /api/reports/:reportId - Retrieve a specific report
router.get('/:reportId', async (req: Request, res: Response) => {
    const { reportId } = req.params;
    console.log(`Received request for reportId: ${reportId}`);
    
    // Validate reportId format
    if (!reportId || !reportId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid reportId format.');
      return res.status(400).json({ message: 'דוח לא תקין.' });
    }
  
    try {
      const report: IReport | null = await Report.findById(reportId)
        .populate('branchId', 'name') // Populate branch name
        .populate('stockReport.itemId', 'name description price') // Populate item details
        .lean(); // Use lean for plain JavaScript object
  
      if (!report) {
        console.log(`Report not found with ID: ${reportId}`);
        return res.status(404).json({ message: 'דוח לא נמצא.' });
      }
  
      console.log(`Fetched Report: ${JSON.stringify(report, null, 2)}`);
      res.status(200).json({ report });
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: 'אירעה שגיאה בשליפת הדוח.' });
    }
  });

export default router;