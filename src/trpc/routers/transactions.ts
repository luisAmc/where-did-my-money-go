import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { stringShape } from '~/utils/shapes';
import { Prisma } from '@prisma/client';

export const transactionsRouter = createTRPCRouter({
    infinite: privateProcedure
        .input(
            z.object({
                limit: z.number().default(10),
                cursor: z.string().nullish(),
            }),
        )
        .query(async ({ ctx: { db, session }, input }) => {
            const transactions = await db.transaction.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                where: {
                    userId: session.userId,
                },
                orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
                select: {
                    id: true,
                    amount: true,
                    date: true,
                    store: true,
                    notes: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    account: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            let nextCursor: typeof input.cursor | undefined = undefined;

            if (transactions.length > input.limit) {
                const nextItem = transactions.pop();
                nextCursor = nextItem!.id;
            }

            return { items: transactions, nextCursor };
        }),

    inRange: privateProcedure
        .input(
            z.object({
                from: z.date(),
                to: z.date(),
            }),
        )
        .query(async ({ ctx: { db, session }, input }) => {
            return db.transaction.findMany({
                where: {
                    date: {
                        gte: input.from,
                        lte: input.to,
                    },
                    userId: session.userId,
                },
            });
        }),

    all: privateProcedure.query(async ({ ctx: { db, session } }) => {
        return db.transaction.findMany({
            where: { userId: session.userId },
            select: {
                id: true,
                amount: true,
                date: true,
                notes: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                account: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }),

    create: privateProcedure
        .input(
            z.object({
                amount: z.number().min(0),
                store: stringShape,
                notes: stringShape.nullish(),
                date: z.date(),
                category: stringShape,
                account: stringShape,
            }),
        )
        .mutation(async ({ ctx: { db, session }, input }) => {
            const category = await db.category.findFirstOrThrow({
                where: { id: input.category, userId: session.userId },
                select: { id: true },
            });

            const account = await db.account.findFirstOrThrow({
                where: { id: input.account, userId: session.userId },
                select: { id: true },
            });

            return db.transaction.create({
                data: {
                    amount: new Prisma.Decimal(input.amount),
                    store: input.store,
                    notes: input.notes,
                    date: input.date,
                    categoryId: category.id,
                    accountId: account.id,
                    userId: session.userId,
                },
            });
        }),

    summary: privateProcedure
        .input(
            z.object({
                from: z.date(),
                to: z.date(),
            }),
        )
        .query(async ({ ctx: { db, session }, input }) => {
            const summary = await db.transaction.aggregate({
                where: {
                    userId: session.userId,
                },
                _sum: {
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });

            return {
                total: summary._sum.amount?.toNumber() ?? 0,
                count: summary._count.id,
            };
        }),
});
