// Usage:
//   node scripts/generate-jwt.js --id <userId> --role <admin|stylist|client>
// Reads SECRET from .env

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const jwt = require('jsonwebtoken');

const argv = process.argv.slice(2);
const getArg = (key) => {
  const idx = argv.indexOf(`--${key}`);
  if (idx !== -1 && argv[idx + 1]) return argv[idx + 1];
  return null;
};

const id = getArg('id');
const role = getArg('role') || 'client';
const secret = process.env.SECRET;

if (!id) {
  console.error('Missing --id');
  process.exit(1);
}
if (!secret) {
  console.error('Missing SECRET in .env');
  process.exit(1);
}

const token = jwt.sign(
  { user: { id, role } },
  secret,
  { algorithm: 'HS256', expiresIn: '1h' }
);

console.log(token);

