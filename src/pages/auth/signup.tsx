import { GetServerSideProps } from "next";
import { unauthenticatedRoute } from "~/utils/redirects";

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { SignUp as default } from "~/components/Auth/SignUp";
