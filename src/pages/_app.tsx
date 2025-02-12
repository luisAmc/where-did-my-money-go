import { AppProps } from 'next/app';
import { Layout } from '~/components/Layout';
import { NProgress } from '~/components/NProgress';
import '~/styles/globals.css';
import { api } from '~/utils/api';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <NProgress />

            {pageProps.viewer ? (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <Component {...pageProps} />
            )}
        </>
    );
}

export default api.withTRPC(App);
