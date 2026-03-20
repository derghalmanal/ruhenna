-- Make Product.category optional (nullable)
-- Rationale: when a ProductCategory is deleted, products should become uncategorized (NULL)
-- and remain visible under "Tout voir" without appearing in any specific category filter.

ALTER TABLE "Product"
ALTER COLUMN "category" DROP NOT NULL;

