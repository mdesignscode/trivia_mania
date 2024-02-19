import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ["/game", "/", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
