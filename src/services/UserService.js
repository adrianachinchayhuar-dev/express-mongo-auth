import userRepository from '../repositories/UserRepository.js';
import { badRequest, validateBirthdate } from '../utils/validators.js';

// Convierte el documento de Mongoose en un objeto seguro para enviar al cliente
function toDTO(user) {
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        age: user.age,
        url_profile: user.url_profile,
        adress: user.adress,
        roles: (user.roles || []).map(r => r.name),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

// Campos que el usuario puede editar en su perfil (no email, roles ni password)
const EDITABLE = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'adress'];
const REQUIRED = ['name', 'lastName', 'phoneNumber', 'birthdate'];

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(toDTO);
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return toDTO(user);
    }

    async updateMe(id, body) {
        const data = {};
        for (const field of EDITABLE) {
            if (body[field] !== undefined) data[field] = body[field];
        }
        for (const field of REQUIRED) {
            if (field in data && (data[field] === null || String(data[field]).trim() === '')) {
                throw badRequest(`El campo ${field} es requerido`);
            }
        }
        if (data.birthdate) data.birthdate = validateBirthdate(data.birthdate);

        const user = await userRepository.update(id, data);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return toDTO(user);
    }
}

export default new UserService();
