/**
 * Page Mentions légales (route `/mentions-legales`).
 *
 * Rôle : afficher les informations légales (éditeur, hébergeur, propriété intellectuelle).
 */
import { siteConfig } from "@/lib/env";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function MentionsLegalesPage() {
  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
            Mentions légales
          </h1>
          <p className="mt-4 text-center text-text-light">
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
          </p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow prose prose-lg max-w-none text-text">
          <div className="space-y-12">
            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Éditeur du site
              </h2>
              <p className="mt-4 text-text-light">
                Le site {baseUrl} est édité par :
              </p>
              <ul className="mt-4 list-disc pl-6 text-text-light">
                <li><strong>{siteConfig.brandName}</strong></li>
                <li>SIRET : {siteConfig.siret}</li>
                <li>TVA: {siteConfig.tvaIntra}</li>
                <li>Email : <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">{siteConfig.contactEmail}</a></li>
                <li>Téléphone : <a href={`tel:${siteConfig.contactPhone?.replace(/\s/g, "")}`} className="text-primary hover:underline">{siteConfig.contactPhone}</a></li>
              </ul>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Hébergement
              </h2>
              <p className="mt-4 text-text-light">
                Ce site est hébergé par :
              </p>
              <p className="mt-2 text-text-light">
                Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Directeur de la publication
              </h2>
              <p className="mt-4 text-text-light">
                Le directeur de la publication du site est le responsable de {siteConfig.brandName},
                joignable à l&apos;adresse {siteConfig.contactEmail}.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Propriété intellectuelle
              </h2>
              <p className="mt-4 text-text-light">
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est
                protégé par le droit d&apos;auteur et le droit des marques. Toute reproduction, représentation,
                modification ou exploitation, totale ou partielle, sans autorisation préalable écrite de {siteConfig.brandName} est strictement interdite et constitue une contrefaçon.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Crédits
              </h2>
              <p className="mt-4 text-text-light">
                Conception et développement du site : {siteConfig.brandName}. Les photographies et
                créations visuelles présentées sont la propriété de {siteConfig.brandName} ou utilisées
                avec autorisation.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
