import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              }
            : undefined,
});

const fromEmail = (process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@localhost').replace(/^["']|["']$/g, '');
const appName = process.env.APP_NAME || 'Passwords';

export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('example.com')) {
        throw new Error('SMTP_HOST не налаштовано або використовується приклад. Перевірте змінні середовища.');
    }

    await transporter.sendMail({
        from: `"${appName}" <${fromEmail}>`,
        to,
        subject: `Вхід у ${appName} — посилання для входу`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.5rem; margin-bottom: 16px;">Вхід у ${appName}</h1>
  <p>Натисніть кнопку нижче, щоб увійти без пароля. Посилання дійсне <strong>15 хвилин</strong>.</p>
  <p style="margin: 24px 0;">
    <a href="${magicLink}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Увійти</a>
  </p>
  <p style="font-size: 0.875rem; color: #666;">Якщо ви не запитували це посилання, просто проігноруйте лист.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 0.75rem; color: #999;">${appName}</p>
</body>
</html>
        `.trim(),
        text: `Вхід у ${appName}\n\nПерейдіть за посиланням, щоб увійти (дійсне 15 хв):\n${magicLink}\n\nЯкщо ви не запитували це посилання, проігноруйте лист.`,
    });
}
