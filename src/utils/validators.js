// Mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial de: # $ % & * @
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

export const PASSWORD_MESSAGE =
    'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 caracter especial (# $ % & * @)';

export function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

export function validatePassword(password) {
    if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
        throw badRequest(PASSWORD_MESSAGE);
    }
}

export function validateBirthdate(value) {
    const d = new Date(value);
    if (!value || isNaN(d.getTime())) throw badRequest('La fecha de nacimiento no es válida');
    if (d > new Date()) throw badRequest('La fecha de nacimiento no puede ser futura');
    return d;
}
