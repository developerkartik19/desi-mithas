import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const { search, category, sort = 'created_at', order = 'desc', page = 1, limit = 12 } = req.query;
    let query = client.from('products').select('*');

    if (search) query = query.ilike('name', `%${search}%`);
    if (category) query = query.eq('category', category);
    query = query.order(sort, { ascending: order === 'asc' ? true : false });
    query = query.range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);

    const result = await query;
    res.json({ success: true, message: 'Products fetched', data: { products: result?.data || [], pagination: { page: Number(page), limit: Number(limit) } } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('products').select('*').eq('id', req.params.id).limit(1);
    const product = result?.data?.[0];
    if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });
    res.json({ success: true, message: 'Product fetched', data: { product } });
  } catch (error) {
    next(error);
  }
});

export default router;
