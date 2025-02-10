import { GetServerSideProps } from 'next';
import { authenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { NewExpense as default } from '~/components/Transactions/NewExpense';
