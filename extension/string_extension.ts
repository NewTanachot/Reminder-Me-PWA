import crypto from 'crypto';

export function encryptString(text: string, secretKey: string, iv_key?: string) {

    const ivKeyBuffer = iv_key ? Buffer.from(iv_key, 'hex') : crypto.randomBytes(16);
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return [ encrypted, ivKeyBuffer.toString('hex') ]
}
  
export function decryptString(encryptedText: string, secretKey: string, iv_key: string) {

    const ivKeyBuffer = Buffer.from(iv_key, 'hex');
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}