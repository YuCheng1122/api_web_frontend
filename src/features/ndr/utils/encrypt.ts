// Encryption utility using Web Crypto API
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

async function getKeyMaterial(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: KEY_LENGTH },
        false,
        ["encrypt"]
    );
}

export async function encrypt(data: string): Promise<{ encryptedData: string; key: string }> {
    try {
        // Generate random salt and IV
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

        // Generate encryption key
        const timestamp = new Date().getTime().toString();
        const randomBytes = window.crypto.getRandomValues(new Uint8Array(16));
        const randomValue = Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        const password = `${timestamp}-${randomValue}`;

        // Generate key
        const keyMaterial = await getKeyMaterial(password);
        const key = await deriveKey(keyMaterial, salt);

        // Encrypt
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);

        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encoded
        );

        // Combine salt, IV, and ciphertext
        const result = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
        result.set(salt, 0);
        result.set(iv, salt.length);
        result.set(new Uint8Array(ciphertext), salt.length + iv.length);

        // Convert to base64 for storage
        const base64String = btoa(
            Array.from(result)
                .map(byte => String.fromCharCode(byte))
                .join('')
        );

        return {
            encryptedData: base64String,
            key: password
        };
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Encryption failed');
    }
}
