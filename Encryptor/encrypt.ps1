# Function to convert string to a byte array
function ConvertTo-ByteArray($inputString) {
    return [System.Text.Encoding]::UTF8.GetBytes($inputString)
}

# AES Encryption function
function Encrypt-AES {
    param (
        [string]$PlainText,
        [string]$Key64Char,  # 64-character key
        [string]$IV          # Initialization Vector
    )

    # Convert the key to a 256-bit key (truncate to 32 bytes/256 bits)
    $KeyBytes = ConvertTo-ByteArray($Key64Char.Substring(0, 32))

    # Convert IV to byte array (AES uses a 16-byte IV for 128-bit block size)
    $IVBytes = ConvertTo-ByteArray($IV.Substring(0, 16))

    # Convert the plaintext to a byte array
    $PlainTextBytes = ConvertTo-ByteArray($PlainText)

    # Create AES object
    $aes = [System.Security.Cryptography.AesManaged]::new()
    $aes.Key = $KeyBytes
    $aes.IV = $IVBytes
    $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7

    # Create encryptor
    $encryptor = $aes.CreateEncryptor()

    # Encrypt the plaintext
    $encryptedBytes = $encryptor.TransformFinalBlock($PlainTextBytes, 0, $PlainTextBytes.Length)

    # Convert encrypted bytes to base64 string and return
    return [Convert]::ToBase64String($encryptedBytes)
}

# Example usage:
$plainText = "This is a secret message."
$key64 = "C021F0300F31E6B7B14A663F5E9274987B3C3B5D606DE65777DBC83EA409BE13"
$iv = "1234567890123456"  # 16-character IV (required for AES CBC mode)

$encryptedText = Encrypt-AES -PlainText $plainText -Key64Char $key64 -IV $iv

Write-Host "Encrypted Text: $encryptedText"
