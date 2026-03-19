/**
 * Page CGV (route `/cgv`).
 *
 * Rôle : afficher des conditions générales de vente (produits + prestations).
 */
import { siteConfig } from "@/lib/env";

export default function CGVPage() {
  return (
    <main>
      <section className="section-padding bg-gradient-to-b from-warm/50 to-bg">
        <div className="container-narrow">
          <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-text md:text-5xl">
            Conditions Générales de Vente
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
                Article 1 — Objet
              </h2>
              <p className="mt-4 text-text-light">
                Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits et
                prestations de services réalisées par {siteConfig.brandName}, entreprise artisanale
                spécialisée dans l&apos;art du henné. En passant commande ou en réservant une prestation,
                le client accepte sans réserve les présentes CGV.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 2 — Prix
              </h2>
              <p className="mt-4 text-text-light">
                Les prix sont indiqués en euros, toutes taxes comprises (TVA non applicable, article 293 B
                du CGI). Les prix des prestations sur mesure et des produits personnalisés sont communiqués
                sur devis. {siteConfig.brandName} se réserve le droit de modifier ses tarifs à tout moment,
                les prix applicables étant ceux en vigueur au jour de la commande.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 3 — Commandes
              </h2>
              <p className="mt-4 text-text-light">
                La commande est validée après confirmation écrite (email ou message) et réception du
                paiement ou d&apos;un acompte selon les modalités convenues. Pour les prestations sur mesure
                (henné personnalisé, créations artisanales), un échange préalable est nécessaire pour
                valider le projet. La commande engage le client de manière ferme et définitive.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 4 — Paiement
              </h2>
              <p className="mt-4 text-text-light">
                Le paiement s&apos;effectue par virement ou espèces (dans la limite légale).
                Pour les prestations, un acompte peut être demandé. Le solde est dû à la livraison ou à
                la réalisation de la prestation. En cas de retard de paiement, des pénalités de retard
                pourront être appliquées conformément à la loi.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 5 — Livraison
              </h2>
              <p className="mt-4 text-text-light">
                Les délais de livraison sont donnés à titre indicatif. Pour les produits physiques, la
                livraison est effectuée à l&apos;adresse indiquée par le client. Pour les prestations de henné,
                elles ont lieu au lieu convenu (domicile, événement, atelier). Les frais de déplacement
                peuvent être facturés en supplément selon la distance.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 6 — Droit de rétractation
              </h2>
              <p className="mt-4 text-text-light">
                Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation
                ne peut être exercé pour les prestations de services pleinement exécutées avant la fin du
                délai de rétractation, ni pour les biens confectionnés selon les spécifications du client
                ou nettement personnalisés (henné sur mesure, créations artisanales uniques). Pour les
                produits standards non personnalisés, le client dispose de 14 jours à compter de la
                réception pour exercer son droit de rétractation.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 7 — Réclamations
              </h2>
              <p className="mt-4 text-text-light">
                Toute réclamation doit être adressée par écrit à {siteConfig.contactEmail}. {siteConfig.brandName} s&apos;engage à traiter les réclamations dans les meilleurs délais et à
                proposer une solution adaptée (échange, remboursement ou correction) dans le respect de
                la réglementation en vigueur.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 8 — Données personnelles
              </h2>
              <p className="mt-4 text-text-light">
                Les données personnelles collectées sont traitées conformément au Règlement Général sur la
                Protection des Données (RGPD) et à notre Politique de Confidentialité. Le client dispose
                d&apos;un droit d&apos;accès, de rectification et de suppression de ses données.
              </p>
            </article>

            <article>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Article 9 — Droit applicable
              </h2>
              <p className="mt-4 text-text-light">
                Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux
                français seront seuls compétents. La nullité d&apos;une clause ne saurait entraîner la nullité
                des autres dispositions des présentes conditions.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
