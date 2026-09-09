import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL || 'https://bd4uefbj.us-east.insforge.app';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

const insforge = createClient({
  baseUrl,
  ...(anonKey ? { anonKey } : {}),
});

export default insforge;
