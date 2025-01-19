export const generateKey = (prefix = 'key') => {
    const timestamp = Date.now().toString(36); // Representa el tiempo actual en base 36
    const randomPart = Math.random().toString(36).substring(2, 11); // Cadena aleatoria de 9 caracteres
    return `${prefix}_${timestamp}_${randomPart}`;
};

export default generateKey;
