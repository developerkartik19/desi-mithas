import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const email = req.body.email || '';
    const result = await client.from('newsletter_subscribers').insert([{ email, created_at: new Date().toISOString() }]).select('*');
    res.status(201).json({ success: true, message: 'Subscribed successfully', data: { subscriber: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

export default router;
