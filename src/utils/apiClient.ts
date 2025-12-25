interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  response?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = '', timeout: number = 10000, retries: number = 3) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
  }

  private async makeRequest(url: string, config: RequestConfig = {}): Promise<any> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = 1000
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: controller.signal
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    let lastError: ApiError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${url}`, requestConfig);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          error.response = response;

          // Try to parse error response
          try {
            const errorData = await response.json();
            error.message = errorData.message || error.message;
            error.code = errorData.code;
          } catch {
            // Ignore JSON parsing errors
          }

          throw error;
        }

        // Handle different content types
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else if (contentType?.includes('text/')) {
          return await response.text();
        } else {
          return response;
        }

      } catch (error: any) {
        lastError = error;
        clearTimeout(timeoutId);

        // Don't retry on certain errors
        if (error.name === 'AbortError') {
          const timeoutError: ApiError = new Error('Request timeout');
          timeoutError.code = 'TIMEOUT_ERROR';
          throw timeoutError;
        }

        if (error.status && error.status >= 400 && error.status < 500) {
          // Client errors (4xx) - don't retry
          throw error;
        }

        // Retry on network errors and 5xx errors
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If we've exhausted retries, throw the last error
        if (!navigator.onLine) {
          const networkError: ApiError = new Error('No internet connection');
          networkError.code = 'NETWORK_ERROR';
          throw networkError;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }

  async get(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.makeRequest(url, { ...config, method: 'GET' });
  }

  async post(url: string, body?: any, config?: Omit<RequestConfig, 'method'>) {
    return this.makeRequest(url, { ...config, method: 'POST', body });
  }

  async put(url: string, body?: any, config?: Omit<RequestConfig, 'method'>) {
    return this.makeRequest(url, { ...config, method: 'PUT', body });
  }

  async delete(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.makeRequest(url, { ...config, method: 'DELETE' });
  }
}

// Create default instance
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || 'http://localhost:3001',
  10000, // 10 second timeout
  3 // 3 retries
);

export { ApiClient };
export type { ApiError };