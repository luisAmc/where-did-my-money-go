import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSideProps } from 'next';
import SuperJSON from 'superjson';
import { appRouter } from '~/trpc/root';
import { db } from '~/utils/prisma';
import { authenticatedRoute } from '~/utils/redirects';
import { resolveSession } from '~/utils/sessions';

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

    await helpers.categories.all.prefetch();

    return {
        props: {
            trpcState: helpers.dehydrate(),
            ...(auth as { props: any }).props,
        },
    };
};

export { Categories as default } from '~/components/Categories';
