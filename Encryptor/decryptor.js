// Helper function to convert Base64 to byte array
function base64ToBytes(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Helper function to convert byte array to UTF-8 string
function bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}

// Decrypt AES-CBC ciphertext
async function decryptAES(cipherTextBase64, keyBase64, ivBase64) {
    try {
        // Decode the key, iv, and ciphertext from Base64
        const keyBytes = base64ToBytes(keyBase64);
        const ivBytes = base64ToBytes(ivBase64);
        const cipherBytes = base64ToBytes(cipherTextBase64);

        // Import the key for AES-CBC decryption
        const cryptoKey = await crypto.subtle.importKey(
            "raw",                               // Raw key data
            keyBytes,                            // Key bytes (must be 16, 24, or 32 bytes for AES)
            { name: "AES-CBC" },                 // Algorithm to use
            false,                               // Key is not extractable
            ["decrypt"]                          // Key usage is decryption
        );

        // Perform the decryption using AES-CBC and the IV
        const decryptedBytes = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: ivBytes },    // AES-CBC with initialization vector (IV)
            cryptoKey,                           // Decryption key
            cipherBytes                          // Encrypted ciphertext bytes
        );

        // Convert the decrypted bytes into a readable UTF-8 string
        const decryptedText = bytesToString(new Uint8Array(decryptedBytes));
        console.log("Decrypted Text:", decryptedText);
        return decryptedText;
    } catch (error) {
        console.error("Decryption failed:", error);
        throw error;
    }
}

// Example encrypted data in Base64 format
const cipherTextBase64 = "SJSF83J8nVY/nhVn2Pt6MA==";   // Encrypted text (Base64 encoded)
const keyBase64 = btoa("thisisaverystrongencryptionkey!!"); // Key as Base64 string (AES-256, 32-byte key)
const ivBase64 = btoa("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"); // 16-byte IV (Base64 encoded)

// Call the decryption function
decryptAES(cipherTextBase64, keyBase64, ivBase64).then((decryptedText) => {
    console.log("Final Decrypted Text:", decryptedText);
});
