import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/game"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/scoreboard"]
};
