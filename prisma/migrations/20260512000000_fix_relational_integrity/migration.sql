-- Replace Product.category slug text with a nullable foreign key to ProductCategory.
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

UPDATE "Product" AS p
SET "categoryId" = pc."id"
FROM "ProductCategory" AS pc
WHERE p."category" = pc."slug";

DROP INDEX IF EXISTS "Appointment_date_startTime_key";

ALTER TABLE "Product" DROP COLUMN IF EXISTS "category";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "featured";

ALTER TABLE "ContactMessage" ALTER COLUMN "email" DROP NOT NULL;
UPDATE "ContactMessage" SET "phone" = '' WHERE "phone" IS NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "phone" SET NOT NULL;

DROP TABLE IF EXISTS "SiteContent";

CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Appointment_serviceId_date_idx" ON "Appointment"("serviceId", "date");

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
