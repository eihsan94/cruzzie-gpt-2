/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useRouter } from "next/router";
import { useEffect } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { api } from "~/utils/api";
import LoadingAnimation from "../Loading/LoadingAnimation";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const RedirectRouteAtom = atomWithStorage("redirectRoute", "/");

const WHITE_LIST_ROUTES = ["/auth"];
// const WHITE_LIST_ROUTES = ["/", "/auth"];
const WHITE_LIST_TERMS_INCLUDED = ["/beginTests/"];

function isWhitelistedTermsIncluded(url: string) {
  for (const route of WHITE_LIST_TERMS_INCLUDED) {
    const pattern = new RegExp(route);
    if (pattern.test(url)) {
      return true;
    }
  }
  return false;
}

export default function AuthGuards({ children }: { children: JSX.Element }) {
  const { data: session, isLoading } = api.user.getSession.useQuery();
  const router = useRouter();
  const [, setRedirectRouteAtom] = useAtom(RedirectRouteAtom);

  useEffect(() => {
    if (
      !isWhitelistedTermsIncluded(router.route) &&
      !WHITE_LIST_ROUTES.includes(router.route) &&
      !isLoading &&
      !session
    ) {
      setRedirectRouteAtom(window.location.href); // remember the page that user tried to access
      router.push("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, setRedirectRouteAtom, session, isLoading]);
  if (
    isWhitelistedTermsIncluded(router.route) ||
    WHITE_LIST_ROUTES.includes(router.route)
  ) {
    return children;
  }

  if (!session) {
    return <LoadingAnimation />;
  }

  return <>{session && !isLoading ? children : <LoadingAnimation />}</>;
}
