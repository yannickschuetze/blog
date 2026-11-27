import mysql, { type Pool } from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from 'astro:env/server';

let pool: Pool | undefined;

export function db(): Pool {
  pool ??= mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: 'utf8mb4',
    connectionLimit: 5,
    dateStrings: true,
  });
  return pool;
}
