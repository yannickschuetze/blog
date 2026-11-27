// Creates or upgrades the database tables. Safe to run on every deploy.
import { connect } from './db-connect.mjs';

const migrations = [
  [1, `CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nr INT UNSIGNED NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    section ENUM('geschichte','projekt') NOT NULL,
    published_on DATE NOT NULL,
    summary VARCHAR(500) NULL,
    body MEDIUMTEXT NOT NULL,
    drawing VARCHAR(255) NULL,
    drawing_idea VARCHAR(300) NULL,
    status ENUM('draft','published') NOT NULL DEFAULT 'draft',
    placeholder TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX posts_status_nr (status, nr)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`],
  [2, `CREATE TABLE IF NOT EXISTS pages (
    slug VARCHAR(50) PRIMARY KEY,
    body MEDIUMTEXT NOT NULL,
    placeholder TINYINT(1) NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`],
  [3, `CREATE TABLE IF NOT EXISTS drawings (
    slot VARCHAR(50) PRIMARY KEY,
    file VARCHAR(255) NOT NULL,
    alt VARCHAR(300) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`],
  [4, `CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) PRIMARY KEY,
    csrf CHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    INDEX sessions_expires (expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=ascii`],
  [5, `CREATE TABLE IF NOT EXISTS login_attempts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(64) NOT NULL,
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX login_attempts_ip (ip, attempted_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=ascii`],
];

const db = await connect();
await db.query(
  `CREATE TABLE IF NOT EXISTS schema_migrations (version INT UNSIGNED PRIMARY KEY, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
);
const [rows] = await db.query('SELECT version FROM schema_migrations');
const done = new Set(rows.map((r) => r.version));
for (const [version, sql] of migrations) {
  if (done.has(version)) continue;
  await db.query(sql);
  await db.query('INSERT INTO schema_migrations (version) VALUES (?)', [version]);
  console.log(`Applied migration ${version}`);
}
console.log('Database is up to date.');
await db.end();
