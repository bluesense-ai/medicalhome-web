/**
 * Configuration file for the application
 * Environment variables are loaded from the .env file
 */

interface Config {
  apiUrl: string;
  hfToken: string;
  // Add more configuration properties as needed
}

// Load environment variables with fallbacks for development
const config: Config = {
  apiUrl: import.meta.env.VITE_HF_API_URL || 'https://bluesense-medical-home.hf.space',
  hfToken: import.meta.env.VITE_HF_TOKEN || '',
};

export default config; 