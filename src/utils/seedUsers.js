import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

// Crea un usuario administrador por defecto si no existe.
// Credenciales: admin@gmail.com / Admin123#
export default async function seedUsers() {
    const email = 'admin@gmail.com';
    const existing = await userRepository.findByEmail(email);
    if (existing) return;

    const adminRole = await roleRepository.findByName('admin');
    if (!adminRole) throw new Error('Primero deben existir los roles (seedRoles)');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    await userRepository.create({
        email,
        password: await bcrypt.hash('Admin123#', saltRounds),
        name: 'Admin',
        lastName: 'Sistema',
        phoneNumber: '999999999',
        birthdate: new Date('1990-01-01'),
        adress: 'Lima, Perú',
        roles: [adminRole._id]
    });
    console.log('Seeded admin user: admin@gmail.com');
}
