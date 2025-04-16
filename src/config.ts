// src/config.ts
interface Config {
  apiUrl: string;
  hfToken: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_HF_API_URL || 'https://bluesense-medical-home.hf.space',
  hfToken: import.meta.env.VITE_HF_TOKEN || ''
};

export default config; 