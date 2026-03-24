import Stripe from "stripe";

// Client Stripe : clé secrète lue depuis l'environnement (ne jamais commiter .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // apiVersion : doit correspondre au SDK installé (voir node_modules/stripe/types/apiVersion.d.ts)
    apiVersion: "2026-02-25.clover",
});

export default stripe;
