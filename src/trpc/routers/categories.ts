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
            return db.category.create({
                data: {
                    name: input.name,
                    userId: session.userId,
                },
            });
        }),

    reorder: privateProcedure
        .input(
            z.object({
                reorderedCategories: z.array(
                    z.object({
                        id: stringShape.min(1),
                        oldOrder: z.number(),
                        newOrder: z.number(),
                    }),
                ),
            }),
        )
        .mutation(async ({ ctx: { db, session }, input }) => {
            const categories = await db.category.findMany({
                where: {
                    id: {
                        in: input.reorderedCategories.map(
                            (category) => category.id,
                        ),
                    },
                    userId: session.userId,
                },
                select: {
                    id: true,
                },
            });

            if (categories.length !== input.reorderedCategories.length) {
                throw new Error(
                    'Una o más de las categorías no le pertenecen al usuario.',
                );
            }

            const result = db.$transaction(async (tx) => {
                for (const category of input.reorderedCategories) {
                    await tx.category.update({
                        where: {
                            id: category.id,
                        },
                        data: {
                            order: category.newOrder,
                        },
                    });
                }

                return true;
            });

            return result;
        }),
});
