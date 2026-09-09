import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:productId', async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('reviews').select('*').eq('product_id', req.params.productId).order('created_at', { ascending: false });
    res.json({ success: true, message: 'Reviews fetched', data: { reviews: result?.data || [] } });
  } catch (error) {
    next(error);
  }
});

router.post('/:productId', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const review = {
      product_id: req.params.productId,
      user_id: req.user.id,
      rating: req.body.rating || 5,
      comment: req.body.comment || '',
      created_at: new Date().toISOString(),
    };
    const result = await client.from('reviews').insert([review]).select('*');
    res.status(201).json({ success: true, message: 'Review added', data: { review: result?.data?.[0] } });
  } catch (error) {
    next(error);
  }
});

export default router;
