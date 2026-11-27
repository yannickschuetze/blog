// Prints an ADMIN_PASSWORD_HASH line for the admin login.
// The password is typed into the terminal (hidden) and never stored anywhere.
import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';

const N = 32768;
const r = 8;
const p = 1;

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted) rl.output.write(s);
};

rl.question('Neues Admin-Passwort (mindestens 12 Zeichen): ', (pw) => {
  rl.output.write('\n');
  rl.close();
  if (!pw || pw.length < 12) {
    console.error('Das Passwort muss mindestens 12 Zeichen lang sein.');
    process.exit(1);
  }
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  console.log(`\nADMIN_PASSWORD_HASH=scrypt$${N}$${r}$${p}$${salt.toString('base64')}$${key.toString('base64')}`);
});
muted = true;
