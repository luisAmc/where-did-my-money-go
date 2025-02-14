import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { stringShape } from '~/utils/shapes';

export const accountRouter = createTRPCRouter({
    all: privateProcedure.query(async ({ ctx: { db, session } }) => {
        return db.account.findMany({
            where: { userId: session.userId },
            select: {
                id: true,
                name: true,
                order: true,
            },
            orderBy: {
                order: 'asc',
            },
        });
    }),

    create: privateProcedure
        .input(z.object({ name: stringShape.min(1) }))
        .mutation(async ({ ctx: { db, session }, input }) => {
            return db.account.create({
                data: {
                    name: input.name,
                    userId: session.userId,
                },
            });
        }),

    reorder: privateProcedure
        .input(
            z.object({
                reorderedAccounts: z.array(
                    z.object({
                        id: stringShape.min(1),
                        oldOrder: z.number(),
                        newOrder: z.number(),
                    }),
                ),
            }),
        )
        .mutation(async ({ ctx: { db, session }, input }) => {
            const accounts = await db.account.findMany({
                where: {
                    id: {
                        in: input.reorderedAccounts.map(
                            (account) => account.id,
                        ),
                    },
                    userId: session.userId,
                },
                select: {
                    id: true,
                },
            });

            if (accounts.length !== input.reorderedAccounts.length) {
                throw new Error(
                    'Una o más de las cuentas no le pertenecen al usuario.',
                );
            }

            const result = db.$transaction(async (tx) => {
                for (const account of input.reorderedAccounts) {
                    await tx.account.update({
                        where: {
                            id: account.id,
                        },
                        data: {
                            order: account.newOrder,
                        },
                    });
                }

                return true;
            });

            return result;
        }),
});
