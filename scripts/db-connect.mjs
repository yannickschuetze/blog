import mysql from 'mysql2/promise';

export function connect() {
  const need = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = need.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env or set them in Plesk.`);
    process.exit(1);
  }
  return mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8mb4',
  });
}
