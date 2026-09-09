import express from 'express';
import { createInsforgeClient } from '../services/insforgeClient.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('users').select('wishlist').eq('id', req.user.id).limit(1);
    res.json({ success: true, message: 'Wishlist fetched', data: { wishlist: result?.data?.[0]?.wishlist || [] } });
  } catch (error) {
    next(error);
  }
});

router.post('/:productId', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('users').select('wishlist').eq('id', req.user.id).limit(1);
    const wishlist = result?.data?.[0]?.wishlist || [];
    if (!wishlist.includes(req.params.productId)) wishlist.push(req.params.productId);
    await client.from('users').update({ wishlist }).eq('id', req.user.id);
    res.json({ success: true, message: 'Added to wishlist', data: { wishlist } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', authenticateUser, async (req, res, next) => {
  try {
    const client = await createInsforgeClient();
    const result = await client.from('users').select('wishlist').eq('id', req.user.id).limit(1);
    const wishlist = (result?.data?.[0]?.wishlist || []).filter((item) => item !== req.params.productId);
    await client.from('users').update({ wishlist }).eq('id', req.user.id);
    res.json({ success: true, message: 'Removed from wishlist', data: { wishlist } });
  } catch (error) {
    next(error);
  }
});

export default router;
