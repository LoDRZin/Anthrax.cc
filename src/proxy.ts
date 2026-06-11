import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// As rotas do dashboard são protegidas (o usuário precisa estar logado)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/settings(.*)', '/appearance(.*)', '/links(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
}
