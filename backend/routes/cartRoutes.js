import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('users').select('cart').eq('id', req.user.id).limit(1);
    res.json({ success: true, message: 'Cart fetched', data: { cart: result?.data?.[0]?.cart || [] } });
  } catch (error) {
    next(error);
  }
});

router.post('/add', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const { productId, quantity = 1 } = req.body;
    const userResult = await client.from('users').select('cart').eq('id', req.user.id).limit(1);
    const currentCart = userResult?.data?.[0]?.cart || [];
    const existing = currentCart.find((item) => item.productId === productId);
    if (existing) existing.quantity += quantity;
    else currentCart.push({ productId, quantity });
    await client.from('users').update({ cart: currentCart }).eq('id', req.user.id);
    res.json({ success: true, message: 'Item added to cart', data: { cart: currentCart } });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const userResult = await client.from('users').select('cart').eq('id', req.user.id).limit(1);
    const currentCart = userResult?.data?.[0]?.cart || [];
    const updated = currentCart.map((item) => item.productId === req.params.id ? { ...item, quantity: req.body.quantity } : item);
    await client.from('users').update({ cart: updated }).eq('id', req.user.id);
    res.json({ success: true, message: 'Cart updated', data: { cart: updated } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const userResult = await client.from('users').select('cart').eq('id', req.user.id).limit(1);
    const currentCart = userResult?.data?.[0]?.cart || [];
    const updated = currentCart.filter((item) => item.productId !== req.params.id);
    await client.from('users').update({ cart: updated }).eq('id', req.user.id);
    res.json({ success: true, message: 'Item removed from cart', data: { cart: updated } });
  } catch (error) {
    next(error);
  }
});

router.delete('/clear', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    await client.from('users').update({ cart: [] }).eq('id', req.user.id);
    res.json({ success: true, message: 'Cart cleared', data: { cart: [] } });
  } catch (error) {
    next(error);
  }
});

export default router;
