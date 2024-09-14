// src/routes/sendReport.ts

import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/item';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Define the structure of the stock report
interface IStockReport {
  itemId: string;
  currentStock: number;
}

// POST /api/:branchId/sendreport
router.post('/:branchId/sendreport', async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const { stockReport } = req.body as { stockReport: IStockReport[] };

  console.log(`Received sendReport request for branchId: ${branchId}`);
  console.log('Stock Report Data:', stockReport);

  if (!stockReport || !Array.isArray(stockReport)) {
    console.error('Invalid stock report data received.');
    return res.status(400).json({ message: 'Invalid stock report data.' });
  }

  try {
    // Fetch current items from the database
    const items: IItem[] = await Item.find({ branch: branchId });
    console.log(`Fetched ${items.length} items from branch ${branchId}.`);

    // Prepare email content
    let emailContent = 'הזנה למלאי נדרשת עבור הסניף:\n\n';
    let itemsToOrder: { name: string; quantity: number }[] = [];

    stockReport.forEach((reportItem) => {
      const item = items.find((i) => i._id.toString() === reportItem.itemId);
      if (item) {
        const difference = item.quantity - reportItem.currentStock;
        if (difference > 0) {
          itemsToOrder.push({ name: item.name, quantity: difference });
          emailContent += `- ${item.name}: להזמנה ${difference} יחידות\n`;
        }
      } else {
        console.warn(`Item with ID ${reportItem.itemId} not found in branch ${branchId}.`);
      }
    });

    console.log(`Items to order: ${JSON.stringify(itemsToOrder, null, 2)}`);

    if (itemsToOrder.length === 0) {
      emailContent = 'אין צורך בהזמנה של פריטים נוספים כרגע.';
      console.log('No items require ordering. No email will be sent.');
    }

    // Send email if there are items to order
    if (itemsToOrder.length > 0) {
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
        subject: `דוח הזנה למלאי - סניף ${branchId}`,
        text: emailContent,
        // For HTML content, uncomment the line below and comment out the 'text' field
        // html: `<p>הזנה למלאי נדרשת עבור הסניף:</p><ul>${itemsToOrder.map(item => `<li>${item.name}: להזמנה ${item.quantity} יחידות</li>`).join('')}</ul>`,
      };

      console.log('Prepared mail options:', mailOptions);

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${mailOptions.to}`);
    }

    // Update the stock quantities in the database
    const bulkOperations = stockReport.map((reportItem) => ({
      updateOne: {
        filter: { _id: reportItem.itemId },
        update: { quantity: reportItem.currentStock },
      },
    }));

    console.log('Bulk update operations:', bulkOperations);

    const bulkWriteResult = await Item.bulkWrite(bulkOperations);
    console.log('Bulk write result:', bulkWriteResult);

    res.status(200).json({ message: 'דוח נשלח בהצלחה.' });
    console.log(`Report for branch ${branchId} processed successfully.`);
  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשליחת הדוח.' });
  }
});

export default router;