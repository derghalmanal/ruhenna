import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().cuid("ID de produit invalide"),
  quantity: z.coerce.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Au moins un article est requis"),
  shippingAddress: z.string().optional(),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
