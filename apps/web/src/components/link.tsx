import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ReactNode } from "react";

type LinkProps =
  | ({
      isExternal?: false;
      children: ReactNode;
      className?: string;
      href: string;
    } & NextLinkProps)
  | {
      isExternal: true;
      children: ReactNode;
      className?: string;
      href: string;
    };

export const Link = ({ children, className, href, isExternal, ...nextLinkProps }: LinkProps) => {
  if (isExternal === true) {
    return (
      <a className={className} href={href} rel="noopener noreferrer nofollow" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} {...nextLinkProps} passHref>
      <a className={className}>{children}</a>
    </NextLink>
  );
};

export const StyledLink = ({ children, className, href, ...linkProps }: LinkProps) => {
  return (
    <Link className={`text-[#0079ff] no-underline ${className}`} href={href} {...linkProps}>
      {children}
    </Link>
  );
};
