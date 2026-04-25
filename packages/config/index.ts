export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'frequency_healing',
  synchronize: true,
  logging: false,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'frequency-healing-secret-key-change-in-production',
  expiresIn: '7d',
};

export const appConfig = {
  port: parseInt(process.env.PORT || '3001'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export const categories = ['body', 'mind', 'soul'] as const;
export type Category = typeof categories[number];

export const theme = {
  background: '#0A0A0F',
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#A855F7',
  card: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.6)',
};