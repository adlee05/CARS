import type { Article } from "@/types/article";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Get the bearer token from localStorage (or wherever you store it)
const getBearerToken = (): string | null => {
  return localStorage.getItem("auth_token") || null;
};

export const fetchNewsByRegion = async (region: string): Promise<Article[]> => {
  const token = getBearerToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    // ✅ Send region as query parameter
    const url = new URL(`${API_BASE_URL}/news4u`);
    url.searchParams.append("region", region);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    await assertOkOrHandleForbidden(response, "Failed to fetch news");
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchNews = async (): Promise<Article[]> => {
  const token = getBearerToken();

  if (!token) {
    throw new Error(
      'No authentication token found in localStorage. Please set it with: localStorage.setItem("auth_token", "your-token")',
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    await assertOkOrHandleForbidden(response, "Failed to fetch news");
    return response.json();
  } catch (error) {
    console.error("Fetch error details:", {
      url: `${API_BASE_URL}/news`,
      baseUrl: API_BASE_URL,
      token: token ? "present" : "missing",
      error,
    });
    throw error;
  }
};

export const redirectToArticle = async (articleId: number): Promise<string> => {
  const token = getBearerToken();

  if (!token) {
    throw new Error(
      'No authentication token found in localStorage. Please set it with: localStorage.setItem("auth_token", "your-token")',
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/article-redirect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article_id: articleId }),
    });

    await assertOkOrHandleForbidden(response, "Failed to get article URL");
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error fetching article URL:", {
      url: `${API_BASE_URL}/article-redirect`,
      articleId,
      error,
    });
    throw error;
  }
};

export const fetchArticle = async (id: string | number): Promise<Article> => {
  const token = getBearerToken();

  if (!token) {
    throw new Error(
      'No authentication token found in localStorage. Please set it with: localStorage.setItem("auth_token", "your-token")',
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/article/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    await assertOkOrHandleForbidden(response, "Failed to fetch article");
    return response.json();
  } catch (error) {
    console.error("Error fetching article:", {
      url: `${API_BASE_URL}/article/${id}`,
      id,
      error,
    });
    throw error;
  }
};

// 403 handling helpers
const logoutAndRedirect = () => {
  try {
    localStorage.removeItem("auth_token");
  } catch {}
  // Use hard redirect to ensure app state resets
  window.location.assign("/login");
};

async function assertOkOrHandleForbidden(response: Response, baseMessage: string) {
  if (response.status === 403) {
    logoutAndRedirect();
    throw new Error("Forbidden");
  }
  if (!response.ok) {
    const errorText = await safeReadText(response);
    throw new Error(`${baseMessage} (${response.status}): ${errorText || response.statusText}`);
  }
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
