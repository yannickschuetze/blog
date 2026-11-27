// Startup file for Plesk's Node.js (Phusion Passenger) on netcup.
// Passenger expects a CommonJS file; it loads the ES-module server Astro builds.
const { join } = require('node:path');

// Settings can live in a .env file next to this one (or in Plesk's environment variables, which win).
try {
  process.loadEnvFile(join(__dirname, '.env'));
} catch {
  // No .env file: rely on the environment variables set in Plesk.
}

import(join(__dirname, 'dist', 'server', 'entry.mjs'));
