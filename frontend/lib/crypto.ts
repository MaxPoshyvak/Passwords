// lib/crypto.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc'; // Стандартний надійний алгоритм
const SECRET_KEY = process.env.ENCRYPTION_KEY; // Ключ з .env
const IV_LENGTH = 16; // Довжина вектора ініціалізації (завжди 16 для AES)

// Функція шифрування
export function encrypt(text: string): string {
    if (!SECRET_KEY || SECRET_KEY.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
    }

    // Створюємо випадковий вектор ініціалізації (IV) для кожного запису
    // Це робить так, що навіть однакові паролі будуть мати різний шифр
    const iv = crypto.randomBytes(IV_LENGTH);

    // Створюємо шифратор
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);

    // Шифруємо
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Повертаємо у форматі: IV:ЗашифрованийТекст (IV потрібен для розшифрування)
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Функція дешифрування
export function decrypt(text: string): string {
    if (!SECRET_KEY) throw new Error('ENCRYPTION_KEY is missing');

    try {
        const textParts = text.split(':');

        // Якщо формат невірний (наприклад, старі незашифровані дані), повертаємо як є або null
        if (textParts.length < 2) return text;

        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return text; // У разі помилки повертаємо оригінал (або можна вертати 'Error')
    }
}
