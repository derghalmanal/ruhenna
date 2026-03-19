/**
 * Proxy / middleware applicatif.
 *
 * Rôle :
 * - protéger l’administration (`/admin` et `/api/admin`) via HTTP Basic Auth
 * - appliquer des en-têtes HTTP de sécurité sur toutes les réponses.
 *
 * Remarque : la logique est regroupée ici pour rester simple et facilement lisible.
 */
// Middleware : sécurité HTTP + protection Basic Auth pour l'administration
import { NextRequest, NextResponse } from "next/server";

// Identifiants d'administration récupérés depuis les variables d'environnement
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Configuration des en-têtes de sécurité HTTP applicables à toutes les requêtes
const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Interception et protection des routes d'administration et de l'API admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    let isAuthenticated = false;

    // Vérification de la présence et de la validité de l'en-tête Basic Auth
    if (authHeader?.startsWith("Basic ")) {
      const decoded = atob(authHeader.slice(6));
      const [user, pass] = decoded.split(":");
      
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isAuthenticated = true;
      }
    }

    // Rejet immédiat si l'utilisateur n'est pas authentifié
    // Déclenche la popup de connexion native du navigateur
    if (!isAuthenticated) {
      return new NextResponse("Accès non autorisé", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Administration"',
          ...securityHeaders,
        },
      });
    }
  }

  // La requête est valide (soit publique, soit admin authentifiée).
  const response = NextResponse.next();

  // Application globale des en-têtes de sécurité HTTP sur la réponse
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

// Configuration du matcher pour ignorer les fichiers statiques et optimiser les performances
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|assets/).*)",
  ],
};