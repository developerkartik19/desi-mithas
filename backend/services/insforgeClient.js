import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

let clientInstance = null;

const getProjectConfig = () => {
  const projectJsonPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.insforge', 'project.json');
  try {
    return JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
  } catch {
    return null;
  }
};

export const createInsforgeClient = async () => {
  if (clientInstance) return clientInstance;

  const projectConfig = getProjectConfig();
  clientInstance = {
    baseURL: process.env.INSFORGE_API_URL || projectConfig?.oss_host || 'https://bd4uefbj.us-east.insforge.app',
    apiKey: process.env.INSFORGE_API_KEY || projectConfig?.api_key || '',
    projectId: process.env.INSFORGE_PROJECT_ID || projectConfig?.project_id || '5dd4dfc1-a6b8-43ad-b892-64767bcfa6cb',
    anonKey: process.env.INSFORGE_ANON_KEY || '',
  };

  return clientInstance;
};

export const getInsforgeClient = () => clientInstance;
