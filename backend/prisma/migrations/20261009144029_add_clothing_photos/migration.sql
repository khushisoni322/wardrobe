-- CreateTable
CREATE TABLE "ClothingPhoto" (
    "id" TEXT NOT NULL,
    "clothingItemId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClothingPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClothingPhoto_clothingItemId_idx" ON "ClothingPhoto"("clothingItemId");

-- AddForeignKey
ALTER TABLE "ClothingPhoto" ADD CONSTRAINT "ClothingPhoto_clothingItemId_fkey" FOREIGN KEY ("clothingItemId") REFERENCES "ClothingItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
