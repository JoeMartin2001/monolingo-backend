import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),

  // Security
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  // OpenAI / AI provider (for question generation)
  openAiApiKey: process.env.OPENAI_API_KEY,

  // Google
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL,

  // Other configs you might need later
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Swagger
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT ?? 3000}`,
  prodApiUrl: process.env.PROD_API_URL || 'https://api.monolingo.ai',
}));
