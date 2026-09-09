import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticateUser, requireAdmin, async (_req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const [usersResult, productsResult, ordersResult] = await Promise.all([
      client.from('users').select('*'),
      client.from('products').select('*'),
      client.from('orders').select('*'),
    ]);
    res.json({ success: true, message: 'Admin dashboard data fetched', data: { users: usersResult?.data || [], products: productsResult?.data || [], orders: ordersResult?.data || [] } });
  } catch (error) {
    next(error);
  }
});

router.post('/products', authenticateUser, requireAdmin, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const product = {
      name: req.body.name || '',
      price: req.body.price || 0,
      category: req.body.category || 'general',
      description: req.body.description || '',
      image: req.body.image || '',
      stock: req.body.stock || 0,
      created_at: new Date().toISOString(),
    };
    const result = await client.from('products').insert([product]).select('*');
    res.status(201).json({ success: true, message: 'Product created', data: { product: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', authenticateUser, requireAdmin, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('products').update(req.body).eq('id', req.params.id).select('*');
    res.json({ success: true, message: 'Product updated', data: { product: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', authenticateUser, requireAdmin, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    await client.from('products').delete().eq('id', req.params.id);
    res.json({ success: true, message: 'Product deleted', data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
