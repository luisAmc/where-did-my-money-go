import { GetServerSideProps } from "next";
import { unauthenticatedRoute } from "~/utils/redirects";

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { Login as default } from "~/components/Auth/Login";
