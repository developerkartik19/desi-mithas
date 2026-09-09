import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const order = {
      user_id: req.user.id,
      items: req.body.items || [],
      total: req.body.total || 0,
      status: 'pending',
      shipping_address: req.body.shippingAddress || '',
      payment_method: req.body.paymentMethod || 'cod',
      created_at: new Date().toISOString(),
    };
    const result = await client.from('orders').insert([order]).select('*');
    res.status(201).json({ success: true, message: 'Order created', data: { order: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('orders').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    res.json({ success: true, message: 'Order history fetched', data: { orders: result?.data || [] } });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/cancel', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('orders').update({ status: 'cancelled' }).eq('id', req.params.id).eq('user_id', req.user.id).select('*');
    res.json({ success: true, message: 'Order cancelled', data: { order: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

export default router;
