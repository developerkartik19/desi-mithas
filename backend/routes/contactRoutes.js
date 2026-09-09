import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const message = {
      name: req.body.name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      message: req.body.message || '',
      created_at: new Date().toISOString(),
    };
    const result = await client.from('contact_messages').insert([message]).select('*');
    res.status(201).json({ success: true, message: 'Message saved', data: { message: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

export default router;
