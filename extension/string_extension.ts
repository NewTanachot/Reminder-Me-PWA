import crypto from 'crypto';

export const EncryptString = (text: string, secretKey: string, iv_key?: string) => {

    const ivKeyBuffer = iv_key ? Buffer.from(iv_key, 'hex') : crypto.randomBytes(16);
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return [ encrypted, ivKeyBuffer.toString('hex') ]
}
  
export const DecryptString = (encryptedText: string, secretKey: string, iv_key: string) => {

    const ivKeyBuffer = Buffer.from(iv_key, 'hex');
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

export const IsStringValid = (value: string): boolean => {
    if (value === null || value === undefined) {
      return false; // Check for null or undefined
    }
  
    if (value.trim().length === 0) {
      return false; // Check for empty string or whitespace
    }
  
    return true; // String is valid
  }