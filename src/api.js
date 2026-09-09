import axios from 'axios';

const tokenStorageKey = 'insforge_access_token';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : `${window.location.origin}/api`);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(tokenStorageKey, token);
  } else {
    localStorage.removeItem(tokenStorageKey);
  }
};

const extractAuthData = (payload) => {
  const direct = payload?.data || payload || {};
  const nested = direct?.data || {};
  const token = direct?.token || direct?.accessToken || nested?.token || nested?.accessToken || null;
  const userPayload = direct?.user || nested?.user || direct || nested || {};
  return { token, user: userPayload };
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenStorageKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeUser = (payload) => {
  const source = payload?.data?.user ?? payload?.user ?? payload ?? {};
  const user = source?.user ?? source ?? {};
  const fallbackEmail = payload?.email || payload?.data?.email || '';
  return {
    id: user.id || payload?.id || source?.id,
    fullName: user.fullName || user.name || user.full_name || payload?.fullName || source?.fullName || '',
    email: user.email || fallbackEmail || payload?.email || source?.email || '',
    phone: user.phone || payload?.phone || source?.phone || '',
    role: user.role || payload?.role || source?.role || 'user',
    address: user.address || payload?.address || source?.address || '',
    profilePhoto: user.profilePhoto || user.profile_photo || user.avatar_url || payload?.profilePhoto || source?.profilePhoto || '',
    isVerified: user.isVerified ?? user.emailVerified ?? payload?.isVerified ?? source?.isVerified ?? true,
  };
};

const toAppShape = (payload, key) => ({
  success: true,
  message: 'ok',
  data: { [key]: payload },
});

export const registerUser = async (payload) => {
  const response = await api.post('/auth/register', {
    fullName: payload.fullName || payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    confirmPassword: payload.confirmPassword || payload.password,
  });
  const { token, user } = extractAuthData(response?.data);
  if (token) {
    setAuthToken(token);
  }
  const normalizedUser = normalizeUser({ ...(response?.data || {}), user });
  return { ...response, data: toAppShape(normalizedUser, 'user') };
};

export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', {
    email: payload.email,
    password: payload.password,
  });
  const { token, user } = extractAuthData(response?.data);
  if (token) {
    setAuthToken(token);
  }
  const normalizedUser = normalizeUser({ ...(response?.data || {}), user });
  return { ...response, data: toAppShape(normalizedUser, 'user') };
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    setAuthToken(null);
  }
};

export const fetchMe = async () => {
  const response = await api.get('/auth/me');
  return { ...response, data: toAppShape(normalizeUser(response.data), 'user') };
};

export const updateProfile = async (payload) => {
  const response = await api.put('/auth/profile', {
    fullName: payload.fullName || '',
    phone: payload.phone || '',
    address: payload.address || '',
    profilePhoto: payload.profilePhoto || '',
  });
  return { ...response, data: toAppShape(normalizeUser(response.data), 'user') };
};

export const fetchProducts = async (params = {}) => {
  const response = await api.get('/database/records/products', {
    params: {
      limit: 8,
      order: 'created_at.desc',
      select: 'id,name,description,price,image,category,stock,created_at',
      ...params,
    },
  });
  return { ...response, data: toAppShape(Array.isArray(response.data) ? response.data : [], 'products') };
};

export const fetchProduct = async (id) => {
  const response = await api.get(`/database/records/products?id=eq.${id}`);
  return { ...response, data: toAppShape(Array.isArray(response.data) ? response.data[0] : null, 'product') };
};

export const addToCart = async (payload) => api.post('/database/records/cart', [{ ...payload, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const fetchCart = async () => api.get('/database/records/cart');
export const updateCartItem = async (id, payload) => api.patch(`/database/records/cart?id=eq.${id}`, payload);
export const removeCartItem = async (id) => api.delete(`/database/records/cart?id=eq.${id}`);
export const clearCart = async () => api.delete('/database/records/cart');
export const fetchWishlist = async () => api.get('/database/records/wishlist');
export const toggleWishlist = async (productId) => api.post('/database/records/wishlist', [{ product_id: productId, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const removeWishlist = async (productId) => api.delete(`/database/records/wishlist?product_id=eq.${productId}`);
export const createOrder = async (payload) => api.post('/database/records/orders', [{ ...payload, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const fetchOrders = async () => {
  const response = await api.get('/database/records/orders', { params: { order: 'created_at.desc', select: 'id,status,total,created_at' } });
  return { ...response, data: toAppShape(Array.isArray(response.data) ? response.data : [], 'orders') };
};
export const submitContact = async (payload) => api.post('/database/records/contact_messages', [{ ...payload, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const subscribeNewsletter = async (payload) => api.post('/database/records/newsletter_subscribers', [{ ...payload, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const fetchAdminDashboard = async () => {
  const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
    api.get('/database/records/users'),
    api.get('/database/records/products'),
    api.get('/database/records/orders'),
  ]);
  return {
    data: {
      data: {
        users: Array.isArray(usersResponse.data) ? usersResponse.data : [],
        products: Array.isArray(productsResponse.data) ? productsResponse.data : [],
        orders: Array.isArray(ordersResponse.data) ? ordersResponse.data : [],
      },
    },
  };
};
export const createAdminProduct = async (payload) => api.post('/database/records/products', [{ ...payload, created_at: new Date().toISOString() }], { headers: { Prefer: 'return=representation' } });
export const updateAdminProduct = async (id, payload) => api.patch(`/database/records/products?id=eq.${id}`, payload);
export const deleteAdminProduct = async (id) => api.delete(`/database/records/products?id=eq.${id}`);
export default api;
