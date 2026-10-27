const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";

// Read the login token saved in this browser.
export function getToken() {
  return localStorage.getItem("wardrobe-token");
}

// Save the token after successful login or registration.
export function saveToken(token) {
  localStorage.setItem("wardrobe-token", token);
}

// Remove the token during logout.
export function clearToken() {
  localStorage.removeItem("wardrobe-token");
}

// Reusable API request function.
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
// FAMILIES
// ========================================

export const familyAPI = {
  list() {
    return apiRequest("/families");
  },

  create(name) {
    return apiRequest("/families", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  invite(familyId, email) {
    return apiRequest(
      `/families/${encodeURIComponent(familyId)}/invitations`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },
};

// ========================================
// CLOTHING
// ========================================

export const clothingAPI = {
  list(familyId) {
    return apiRequest(
      `/families/${encodeURIComponent(familyId)}/clothes`
    );
  },

  create(familyId, clothing) {
    return apiRequest(
      `/families/${encodeURIComponent(familyId)}/clothes`,
      {
        method: "POST",
        body: JSON.stringify(clothing),
      }
    );
  },

  update(clothingId, updates) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  },

  delete(clothingId) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}`,
      {
        method: "DELETE",
      }
    );
  },

  toggleFavorite(clothingId) {
    return apiRequest(
      `/clothes/${encodeURIComponent(clothingId)}/favorite`,
      {
        method: "PATCH",
      }
    );
  },
};