import SecurePassword from 'secure-password';
import { db } from './prisma';
import { ValidationError } from '~/trpc/errors';

const securePassword = new SecurePassword();

export async function hashPassword(password: string) {
    return await securePassword.hash(Buffer.from(password));
}

export async function verifyPassword(
    hashedPassword: Uint8Array,
    password: string,
) {
    try {
        return await securePassword.verify(
            Buffer.from(password),
            Buffer.from(hashedPassword),
        );
    } catch (error) {
        return SecurePassword.INVALID;
    }
}

export async function authenticateUser(username: string, password: string) {
    const user = await db.user.findFirst({ where: { username } });

    if (!user || !user.hashedPassword) {
        throw new ValidationError('Usuario no encontrado.', {
            username: 'Usuario no encontrado.',
        });
    }

    const passwordStatus = await verifyPassword(user.hashedPassword, password);

    switch (passwordStatus) {
        case SecurePassword.VALID:
            break;

        case SecurePassword.VALID_NEEDS_REHASH:
            const improvedHash = await hashPassword(password);

            await db.user.update({
                where: { id: user.id },
                data: { hashedPassword: improvedHash },
            });

            break;

        default:
            throw new ValidationError('Contraseña incorrecta.', {
                password: 'La contraseña es incorrecta.',
            });
    }

    return user;
}
