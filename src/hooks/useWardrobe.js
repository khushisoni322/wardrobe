import { useCallback, useEffect, useMemo, useState } from "react";
import { clothingAPI, familyAPI } from "../lib/api";

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
  const [families, setFamilies] = useState([]);
  const [activeFamilyId, setActiveFamilyId] = useState("");
  const [clothes, setClothes] = useState([]);

  const [familiesLoading, setFamiliesLoading] = useState(true);
  const [clothesLoading, setClothesLoading] = useState(false);

  const [error, setError] = useState("");

  const loadFamilies = useCallback(async () => {
    setFamiliesLoading(true);
    setError("");

    try {
      const result = await familyAPI.list();
      const nextFamilies = Array.isArray(result?.families)
        ? result.families
        : [];

      setFamilies(nextFamilies);

      if (nextFamilies.length > 0) {
        setActiveFamilyId((current) => {
          const stillExists = nextFamilies.some(
            (family) => family.id === current
          );

          return stillExists ? current : nextFamilies[0].id;
        });
      } else {
        setActiveFamilyId("");
      }
    } catch (err) {
      setError(err.message || "Could not load your families.");
    } finally {
      setFamiliesLoading(false);
    }
  }, []);

  const loadClothes = useCallback(async () => {
    if (!activeFamilyId) {
      setClothes([]);
      return;
    }

    setClothesLoading(true);
    setError("");

    try {
      const result = await clothingAPI.list(activeFamilyId);
      setClothes(Array.isArray(result?.clothes) ? result.clothes : []);
    } catch (err) {
      setError(err.message || "Could not load your clothes.");
      setClothes([]);
    } finally {
      setClothesLoading(false);
    }
  }, [activeFamilyId]);

  useEffect(() => {
    loadFamilies();
  }, [loadFamilies]);

  useEffect(() => {
    loadClothes();
  }, [loadClothes]);

  const activeFamily = useMemo(
    () => families.find((family) => family.id === activeFamilyId) || null,
    [families, activeFamilyId]
  );

  const categories = useMemo(() => {
    const dynamicCategories = clothes
      .map((item) => item.category?.trim())
      .filter(Boolean);

    return Array.from(
      new Set([...DEFAULT_CATEGORIES, ...dynamicCategories])
    );
  }, [clothes]);

  const createClothing = async (data) => {
    if (!activeFamilyId) {
      throw new Error("Please create or select a family first.");
    }

    const result = await clothingAPI.create(activeFamilyId, data);

    if (result?.clothing) {
      setClothes((current) => [result.clothing, ...current]);
    }

    return result?.clothing;
  };

  const updateClothing = async (id, updates) => {
    const result = await clothingAPI.update(id, updates);

    if (result?.clothing) {
      setClothes((current) =>
        current.map((item) =>
          item.id === id ? result.clothing : item
        )
      );
    }

    return result?.clothing;
  };

  const deleteClothing = async (id) => {
    await clothingAPI.delete(id);

    setClothes((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const toggleFavorite = async (id) => {
    const result = await clothingAPI.toggleFavorite(id);

    if (result?.clothing) {
      setClothes((current) =>
        current.map((item) =>
          item.id === id ? result.clothing : item
        )
      );
    }

    return result?.clothing;
  };

  return {
    families,
    activeFamily,
    activeFamilyId,
    setActiveFamilyId,

    clothes,
    categories,

    familiesLoading,
    clothesLoading,
    loading: familiesLoading || clothesLoading,

    error,

    reloadFamilies: loadFamilies,
    reloadClothes: loadClothes,

    createClothing,
    updateClothing,
    deleteClothing,
    toggleFavorite,
  };
}