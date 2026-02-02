import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Get encryption key from environment variable
 * Uses PBKDF2 to derive a consistent key
 */
function getEncryptionKey(): Buffer {
  const key = process.env.TELLER_TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('TELLER_TOKEN_ENCRYPTION_KEY environment variable is required');
  }
  // Derive key from environment variable using PBKDF2
  // This ensures we get a consistent 32-byte key
  return crypto.pbkdf2Sync(key, 'teller-token-salt', 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encrypt a Teller access token using AES-256-GCM
 * Returns base64-encoded string containing: IV + Auth Tag + Encrypted Data
 */
export function encryptToken(token: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  // Combine: iv (16 bytes) + tag (16 bytes) + encrypted data
  const result = Buffer.concat([iv, tag, encrypted]);
  return result.toString('base64');
}

/**
 * Decrypt a Teller access token
 * Takes base64-encoded string containing: IV + Auth Tag + Encrypted Data
 */
export function decryptToken(encryptedToken: string): string {
  const key = getEncryptionKey();
  const tokenBuffer = Buffer.from(encryptedToken, 'base64');
  
  // Extract components
  const iv = tokenBuffer.slice(0, IV_LENGTH);
  const tag = tokenBuffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = tokenBuffer.slice(IV_LENGTH + TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}
