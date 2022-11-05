import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName?: string;

}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {

  //get path from router
  const { asPath } = useRouter()

  const className = asPath === rest.href ? activeClassName : ""

  return (
    <Link {...rest}>
      {/* passar um atributo para um elemento que vem como prop */}
      {cloneElement(children, {
        className,
      })}
    </Link>
  )
}