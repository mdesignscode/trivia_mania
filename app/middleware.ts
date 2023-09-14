import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/game"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: "/signin" });
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};