
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

// ========================================
// AUTH TOKEN
// ========================================

export function getToken() {
  return localStorage.getItem("wardrobe-token");
}

export function saveToken(token) {
  localStorage.setItem("wardrobe-token", token);
}

export function clearToken() {
  localStorage.removeItem("wardrobe-token");
}

// ========================================
// API REQUEST
// ========================================

async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to Wardrobe server. Check whether the backend is running."
    );
  }

  const contentType = response.headers.get("content-type") || "";

  const result = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null
        ? result.message || "Something went wrong."
        : result || "Something went wrong.";

    if (response.status === 401) {
      clearToken();
    }

    throw new Error(message);
  }

  return result;
}

// ========================================
// AUTHENTICATION
// ========================================

export const authAPI = {
  async register({ name, email, password }) {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (result.token) {
      saveToken(result.token);
    }

    return result;
  },

  async login({ email, password }) {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.token) {
      saveToken(result.token);
    }

    return result;
  },

  me() {
    return apiRequest("/auth/me");
  },

  logout() {
    clearToken();
  },
};

// ========================================
// PERSONAL CLOTHING
// ========================================

export const clothingAPI = {
  // Get logged-in user's personal wardrobe.
  listMine() {
    return apiRequest("/clothes");
  },

  // Add clothing to logged-in user's personal wardrobe.
  createMine(clothing) {
    return apiRequest("/clothes", {
      method: "POST",
      body: JSON.stringify(clothing),
    });
  },

  // Update clothing.
  update(clothingId, updates) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  },

  // Delete clothing.
  delete(clothingId) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}`,
      {
        method: "DELETE",
      }
    );
  },

  // Toggle favorite.
  toggleFavorite(clothingId) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}/favorite`,
      {
        method: "PATCH",
      }
    );
  },
};
