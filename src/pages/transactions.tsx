import { appRouter } from '~/trpc/root';
import { authenticatedRoute } from '~/utils/redirects';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { db } from '~/utils/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import { resolveSession } from '~/utils/sessions';
import SuperJSON from 'superjson';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const auth = await authenticatedRoute(ctx);
    if ('redirect' in auth) {
        return auth;
    }

    const session = await resolveSession(ctx.req, ctx.res);

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db: db,
            ironSession: session.ironSession,
            session: session.session,
        },
        transformer: SuperJSON,
    });

    const today = new Date();

    await helpers.transactions.inRange.prefetch({
        from: startOfMonth(today),
        to: endOfMonth(today),
    });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            ...(auth as { props: any }).props,
        },
    };
};

export { Transactions as default } from '~/components/Transactions';
