# Function to convert a string to a byte array
function ConvertTo-ByteArray($inputString) {
    return [System.Text.Encoding]::UTF8.GetBytes($inputString)
}

# AES Encryption function
function Encrypt-AES {
    param (
        [string]$PlainText,   # The string to encrypt
        [string]$Key64Char    # The 64-character key
    )

    # Convert the key to a 256-bit key (truncate to 32 bytes)
    $KeyBytes = ConvertTo-ByteArray($Key64Char.Substring(0, 32))

    # Generate a random 16-byte IV (AES uses 128-bit blocks)
    $aes = [System.Security.Cryptography.AesManaged]::new()
    $aes.GenerateIV()
    $IVBytes = $aes.IV

    # Convert the plaintext to byte array
    $PlainTextBytes = ConvertTo-ByteArray($PlainText)

    # Set AES parameters
    $aes.Key = $KeyBytes
    $aes.IV = $IVBytes
    $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7

    # Create encryptor and encrypt the plaintext
    $encryptor = $aes.CreateEncryptor()
    $encryptedBytes = $encryptor.TransformFinalBlock($PlainTextBytes, 0, $PlainTextBytes.Length)

    # Convert IV and encrypted data to Base64
    $IVBase64 = [Convert]::ToBase64String($IVBytes)
    $EncryptedBase64 = [Convert]::ToBase64String($encryptedBytes)

    # Use string concatenation to create the final output (IV:EncryptedText)
    return "$IVBase64" + ":" + "$EncryptedBase64"
}

# Example usage
$plainText1 = "https://devtelemetry.cchaxcess.com/v1/traces"
$key64 = "23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63"

$encryptedOutput1 = Encrypt-AES -PlainText $plainText1 -Key64Char $key64
Write-Host "Encrypted Output (IV:EncryptedText): $encryptedOutput1"


$plainText2 = "https://devtelemetry.cchaxcess.com/v1/logs"
$key64 = "23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63"

$encryptedOutput2 = Encrypt-AES -PlainText $plainText2 -Key64Char $key64
Write-Host "Encrypted Output (IV:EncryptedText): $encryptedOutput2"



$plainText3 = "YWRtaW46YWRtaW4="
$key64 = "23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63"

$encryptedOutput3 = Encrypt-AES -PlainText $plainText3 -Key64Char $key64
Write-Host "Encrypted Output (IV:EncryptedText): $encryptedOutput3"
