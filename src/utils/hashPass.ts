import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export function generateRandomPassword(length = 12) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

