import { useNavigate } from 'react-router-dom';

export function useApi() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Use cookies for session
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        navigate('/');
        throw new Error('Unauthorized - Please sign in');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  return { apiCall, API_URL };
}