import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, forwardRef } from "react";

export interface ButtonOrLinkProps
  extends Omit<ComponentProps<"button"> & ComponentProps<"a">, "ref"> {
  preserveRedirect?: boolean;
}

export const ButtonOrLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonOrLinkProps
>(function ButtonOrLink({ href, preserveRedirect, ...props }, ref) {
  const router = useRouter();

  if (href) {
    const finalHref =
      preserveRedirect && router.query.redirect
        ? `${href}?redirect=${encodeURIComponent(
            router.query.redirect as string
          )}`
        : href;

    return <Link href={finalHref} {...props} />;
  }

  return <button {...props} type={props.type || "button"} />;
});
