import { accountRouter } from './routers/accounts';
import { authRouter } from './routers/auth';
import { categoriesRouter } from './routers/categories';
import { transactionsRouter } from './routers/transactions';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter,
    accounts: accountRouter,
    transactions: transactionsRouter,
});

export type AppRouter = typeof appRouter;
