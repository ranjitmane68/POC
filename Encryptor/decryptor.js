const crypto = require('crypto');

// Function to decrypt AES-256-CBC encrypted text
function decryptAES(encryptedText, key64) {
    // Split the encrypted text into IV and ciphertext
    const [ivBase64, encryptedBase64] = encryptedText.split(':');

    // Decode Base64 strings to byte arrays
    const iv = Buffer.from(ivBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');

    // Truncate the key to 32 bytes (AES-256 key size)
    const key = Buffer.from(key64.slice(0, 32), 'utf-8');

    // Create a decipher object
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);

    // Decrypt the ciphertext
    let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

// Example usage
const key64 = '23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63';
const encryptedText1 = 'OAK1Wq4FORKsbpmPIjkxkg==:2fQVtqoMpteVB0cwNwqhKvJCR/snoNtPkcFnlmRsBUFo4CV9zVBhSjYlMrWoGKD+'; 
const encryptedText2 = 'HG+n75rakLyzVECuQfaiKA==:xPBX8t2NWgTm0IyTxVpR/Qb4jtmt9qEwWvf2vtUeiOKjqwWeEr2Di2mtjEJg9BnF'; 
const encryptedText3 = 'dClFnHesQoyb25upxDG+QA==:BA+FzLlv0KhcjkPJmzcNRCMpVYZU6s7KbQy68UOGrEg='; 

try {
    const decryptedMessage = decryptAES(encryptedText1, key64);
    console.log('Decrypted message1:', decryptedMessage);

    const decryptedMessage2 = decryptAES(encryptedText2, key64);
    console.log('Decrypted message2:', decryptedMessage2);

    const decryptedMessage3 = decryptAES(encryptedText3, key64);
    console.log('Decrypted message3:', decryptedMessage3);
} catch (error) {
    console.error('Decryption failed:', error.message);
}
