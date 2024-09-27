# Define a plaintext string and encryption key
$plaintext = "This is a secret message"
$key = "thisisaverystrongencryptionkey!!"  # Must be 16, 24, or 32 characters for AES

# Ensure the key is 32 bytes long for AES-256 (you can adjust for AES-128 or AES-192 as needed)
if ($key.Length -ne 16 -and $key.Length -ne 24 -and $key.Length -ne 32) {
    throw "Key must be exactly 16, 24, or 32 characters long."
}

# Convert the key to a byte array
$keyBytes = [Text.Encoding]::UTF8.GetBytes($key)

# Define a static 16-byte IV (for AES, IV must be 16 bytes)
$iv = New-Object byte[] 16
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($iv)  # Randomize IV in real-world use cases

# Create AES object
$aes = [System.Security.Cryptography.Aes]::Create()
$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
$aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
$aes.Key = $keyBytes
$aes.IV = $iv

# Encryption process
$encryptor = $aes.CreateEncryptor()
$plaintextBytes = [Text.Encoding]::UTF8.GetBytes($plaintext)
$encryptedBytes = $encryptor.TransformFinalBlock($plaintextBytes, 0, $plaintextBytes.Length)

# Convert encrypted data to Base64 string for storage
$encryptedText = [Convert]::ToBase64String($encryptedBytes)
Write-Output "Encrypted Text: $encryptedText"

# Decryption process
$decryptor = $aes.CreateDecryptor()
$encryptedBytesBack = [Convert]::FromBase64String($encryptedText)
$decryptedBytes = $decryptor.TransformFinalBlock($encryptedBytesBack, 0, $encryptedBytesBack.Length)

# Convert decrypted bytes back to string
$decryptedText = [Text.Encoding]::UTF8.GetString($decryptedBytes)
Write-Output "Decrypted Text: $decryptedText"

# Clean up
$aes.Dispose()
