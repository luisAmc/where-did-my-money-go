import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { stringShape } from '~/utils/shapes';
import { createSession, removeSession } from '~/utils/sessions';
import { authenticateUser, hashPassword } from '~/utils/auth';

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(
            z.object({
                username: stringShape.min(1),
                password: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx: { ironSession }, input }) => {
            const user = await authenticateUser(input.username, input.password);

            await createSession(ironSession, user);

            return {
                id: user.id,
                username: user.username,
            };
        }),

    logout: privateProcedure.mutation(
        async ({ ctx: { ironSession, session } }) => {
            await removeSession(ironSession, session);
            return { success: true };
        },
    ),

    signUp: publicProcedure
        .input(
            z.object({
                username: stringShape.min(1),
                password: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx: { db, ironSession }, input }) => {
            const isUsernameAlreadyTaken = await db.user.findUnique({
                where: {
                    username: input.username,
                },
                select: {
                    id: true,
                },
            });

            if (isUsernameAlreadyTaken) {
                throw new Error('El nombre de usuario ya está en uso.');
            }

            const user = await db.user.create({
                data: {
                    username: input.username,
                    hashedPassword: await hashPassword(input.password),
                },
            });

            await createSession(ironSession, user);

            return {
                id: user.id,
                username: user.username,
            };
        }),
});
