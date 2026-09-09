import express from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import dotenv from 'dotenv';
import { createInsforgeAuthClient } from '../services/insforgeClient.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

const strongPassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

const createToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields', data: {} });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email', data: {} });
    }
    if (!validator.isMobilePhone(phone, 'en-IN')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Indian phone number', data: {} });
    }
    if (!strongPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include one uppercase letter and one number', data: {} });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match', data: {} });
    }

    const client = await createInsforgeAuthClient();
    const { data, error } = await client.auth.signUp({
        email,
        password,
        name: fullName,
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    });

    if (error) {
      const status = error.statusCode === 409 ? 409 : 400;
      return res.status(status).json({ success: false, message: error.message || 'Registration failed', data: {} });
    }

    const signedInUser = data?.user || { id: undefined, email, name: fullName, role: 'user' };
    const token = data?.accessToken
      ? createToken({ id: signedInUser.id || `${Date.now()}`, email: signedInUser.email || email, role: signedInUser.role || 'user' })
      : null;
    if (token) {
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    }
    res.status(201).json({
      success: true,
      message: data?.requireEmailVerification ? 'Please verify your email before signing in' : 'User registered successfully',
      data: {
        user: { id: signedInUser.id, fullName: signedInUser.name || fullName, email: signedInUser.email || email, phone, role: signedInUser.role || 'user' },
        token,
        accessToken: data?.accessToken,
        requireEmailVerification: Boolean(data?.requireEmailVerification),
      },
    });
  } catch (error) {
    console.error('REGISTER_ERROR', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required', data: {} });
    }

    const client = await createInsforgeAuthClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(error.statusCode === 403 ? 403 : 401).json({ success: false, message: error.message || 'Invalid credentials', data: {} });
    }

    const signedInUser = data?.user || { id: undefined, email, role: 'user' };
    const token = createToken({ id: signedInUser.id || `${Date.now()}`, email: signedInUser.email || email, role: signedInUser.role || 'user' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: signedInUser.id, fullName: signedInUser.name || signedInUser.fullName || '', email: signedInUser.email || email, phone: signedInUser.phone || '', role: signedInUser.role || 'user' },
        token,
        accessToken: data?.accessToken,
      },
    });
  } catch (error) {
    console.error('LOGIN_ERROR', error);
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully', data: {} });
});

router.get('/me', authenticateUser, async (req, res, next) => {
  try {
    const user = req.user;
    res.json({ success: true, message: 'User profile fetched', data: { user: { id: user.id, fullName: user.fullName || user.full_name || '', email: user.email, phone: user.phone || '', role: user.role, address: user.address || '', profilePhoto: user.profilePhoto || '', isVerified: user.isVerified ?? true } } });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticateUser, async (req, res, next) => {
  try {
    const user = { ...req.user, fullName: req.body.fullName || req.user.fullName || '', phone: req.body.phone || req.user.phone || '', address: req.body.address || req.user.address || '', profilePhoto: req.body.profilePhoto || req.user.profilePhoto || '' };
    res.json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
});

export default router;
