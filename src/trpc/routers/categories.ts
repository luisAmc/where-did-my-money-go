import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { stringShape } from '~/utils/shapes';

export const categoriesRouter = createTRPCRouter({
    all: privateProcedure.query(async ({ ctx: { db, session } }) => {
        return db.category.findMany({
            where: { userId: session.userId },
            select: {
                id: true,
                name: true,
            },
        });
    }),

    create: privateProcedure
        .input(z.object({ name: stringShape.min(1) }))
        .mutation(async ({ ctx: { db, session }, input }) => {
            return db.category.create({
                data: {
                    name: input.name,
                    userId: session.userId,
                },
            });
        }),
});
