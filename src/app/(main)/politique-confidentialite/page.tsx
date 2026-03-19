/**
 * Page Politique de confidentialité (route `/politique-confidentialite`).
 *
 * Rôle : expliquer les données collectées et les droits (RGPD) de manière simple.
 */
import { siteConfig } from "@/lib/env";

export default function PolitiqueConfidentialitePage() {
  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-center text-text-light">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </section>

      <section className="section-padding bg-bg">
        <div className="container-narrow prose prose-lg max-w-none text-text">
          <div className="space-y-12">
            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Données collectées
              </h2>
              <p className="mt-4 text-text-light">
                {siteConfig.brandName} collecte les données personnelles suivantes dans le cadre de ses
                activités (réservations, formulaire de contact) :
              </p>
              <ul className="mt-4 list-disc pl-6 text-text-light">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
              </ul>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Finalités du traitement
              </h2>
              <p className="mt-4 text-text-light">
                Les données collectées sont utilisées exclusivement pour :
              </p>
              <ul className="mt-4 list-disc pl-6 text-text-light">
                <li>La gestion des commandes et des réservations</li>
                <li>La prise de contact et le suivi de vos demandes</li>
              </ul>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Durée de conservation
              </h2>
              <p className="mt-4 text-text-light">
                Vos données sont conservées pendant la durée nécessaire à l&apos;exécution de mes obligations
                contractuelles et légales.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Droits de l&apos;utilisateur (RGPD)
              </h2>
              <p className="mt-4 text-text-light">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des
                droits suivants :
              </p>
              <ul className="mt-4 list-disc pl-6 text-text-light">
                <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification</strong> : faire corriger des données inexactes</li>
                <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4 text-text-light">
                Pour exercer ces droits, contactez-nous à {siteConfig.contactEmail}. Vous pouvez également
                introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et
                des Libertés).
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Cookies
              </h2>
              <p className="mt-4 text-text-light">
                Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Contact DPO
              </h2>
              <p className="mt-4 text-text-light">
                Pour toute question relative à la protection de vos données personnelles, vous pouvez
                contacter le responsable du traitement à l&apos;adresse : {siteConfig.contactEmail}.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
