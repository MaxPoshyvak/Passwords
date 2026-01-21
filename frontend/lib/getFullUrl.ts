const getFullUrl = (url: string | undefined) => {
    if (!url) return '#';
    // Перевіряємо, чи є http або https на початку
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Якщо немає - додаємо https://
    return `https://${url}`;
};
export default getFullUrl;
