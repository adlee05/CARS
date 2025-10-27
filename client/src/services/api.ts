import type { Article } from "@/types/article";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

// Get the bearer token from localStorage (or wherever you store it)
const getBearerToken = (): string | null => {
  return localStorage.getItem('auth_token') || null;
};

export const fetchNews = async (): Promise<Article[]> => {
  const token = getBearerToken();
  
  if (!token) {
    throw new Error('No authentication token found in localStorage. Please set it with: localStorage.setItem("auth_token", "your-token")');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch news (${response.status}): ${errorText || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error details:', {
      url: `${API_BASE_URL}/news`,
      baseUrl: API_BASE_URL,
      token: token ? 'present' : 'missing',
      error
    });
    throw error;
  }
};

