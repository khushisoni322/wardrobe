
import { useCallback, useEffect, useMemo, useState } from "react";
import { clothingAPI } from "../lib/api";

export const DEFAULT_CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Ethnic",
  "Outerwear",
  "Activewear",
  "Footwear",
  "Accessories",
  "Sleepwear",
  "Other",
];

export default function useWardrobe() {
  const [clothes, setClothes] = useState([]);

  const [clothesLoading, setClothesLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD PERSONAL WARDROBE
  // ========================================

  const loadClothes = useCallback(async () => {
    setClothesLoading(true);
    setError("");

    try {
      const result = await clothingAPI.listMine();

      setClothes(
        Array.isArray(result?.clothes)
          ? result.clothes
          : []
      );
    } catch (err) {
      setError(
        err.message || "Could not load your clothes."
      );

      setClothes([]);
    } finally {
      setClothesLoading(false);
    }
  }, []);

  // Load personal wardrobe when hook mounts.
  useEffect(() => {
    loadClothes();
  }, [loadClothes]);

  // ========================================
  // CATEGORIES
  // ========================================

  const categories = useMemo(() => {
    const dynamicCategories = clothes
      .map((item) => item.category?.trim())
      .filter(Boolean);

    return Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...dynamicCategories,
      ])
    );
  }, [clothes]);

  // ========================================
  // ADD CLOTHING
  // ========================================

  const createClothing = async (data) => {
    setError("");

    try {
      const result = await clothingAPI.createMine(data);

      if (!result?.clothing) {
        throw new Error(
          result?.message || "Clothing could not be added."
        );
      }

      setClothes((current) => [
        result.clothing,
        ...current,
      ]);

      return result.clothing;
    } catch (err) {
      setError(
        err.message || "Could not add clothing."
      );

      throw err;
    }
  };

  // ========================================
  // UPDATE CLOTHING
  // ========================================

  const updateClothing = async (id, updates) => {
    setError("");

    try {
      const result = await clothingAPI.update(id, updates);

      if (!result?.clothing) {
        throw new Error(
          result?.message || "Clothing could not be updated."
        );
      }

      setClothes((current) =>
        current.map((item) =>
          item.id === id
            ? result.clothing
            : item
        )
      );

      return result.clothing;
    } catch (err) {
      setError(
        err.message || "Could not update clothing."
      );

      throw err;
    }
  };

  // ========================================
  // DELETE CLOTHING
  // ========================================

  const deleteClothing = async (id) => {
    setError("");

    try {
      await clothingAPI.delete(id);

      setClothes((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(
        err.message || "Could not delete clothing."
      );

      throw err;
    }
  };

  // ========================================
  // TOGGLE FAVORITE
  // ========================================

  const toggleFavorite = async (id) => {
    setError("");

    try {
      const result = await clothingAPI.toggleFavorite(id);

      if (!result?.clothing) {
        throw new Error(
          result?.message || "Favorite could not be updated."
        );
      }

      setClothes((current) =>
        current.map((item) =>
          item.id === id
            ? result.clothing
            : item
        )
      );

      return result.clothing;
    } catch (err) {
      setError(
        err.message || "Could not update favorite."
      );

      throw err;
    }
  };

  // ========================================
  // RETURN PERSONAL WARDROBE
  // ========================================

  return {
    clothes,
    categories,

    loading: clothesLoading,
    clothesLoading,

    error,

    reloadClothes: loadClothes,

    createClothing,
    updateClothing,
    deleteClothing,
    toggleFavorite,
  };
}
