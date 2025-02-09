import { GetServerSideProps } from "next";
import { authenticatedRoute } from "~/utils/redirects";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { Home as default } from "~/components/Home";
