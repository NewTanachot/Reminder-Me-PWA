import crypto from 'crypto';

export function encryptString(text: string, secretKey: string) {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  export function decryptString(encryptedText: string, secretKey: string) {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

// export function encryptString(text: string, secretKey: string) {

//     // this is ECB mode without an IV, not recommend in real production project
//     const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(secretKey), process.env.NEXT_PUBLIC_IV_KEY ?? "");
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
  
//     return encrypted;
//   }
  
// export function decryptString(encryptedText: string, secretKey: string) {

//     // this is ECB mode without an IV, not recommend in real production project
//     const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(secretKey), process.env.NEXT_PUBLIC_IV_KEY ?? "");
//     let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
  
//     return decrypted;
// }