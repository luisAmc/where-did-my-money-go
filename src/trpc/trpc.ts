import { initTRPC, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { ZodError } from 'zod';
import { db } from '~/utils/prisma';
import { resolveSession } from '~/utils/sessions';
import superjson from 'superjson';

export const createTRPCContext = async ({
    req,
    res,
}: CreateNextContextOptions) => {
    const { session, ironSession } = await resolveSession(req, res);
    return { db, session, ironSession };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(
    t.middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        return next({ ctx: { session: ctx.session } });
    }),
);
