import { API_BASE_URL } from '../constants';

interface RequestOptions extends Omit<RequestInit, 'signal'> {
  headers?: Record<string, string>;
  /** Timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Number of retries on failure (default: 2) */
  retries?: number;
  /** Skip retry for this request */
  noRetry?: boolean;
}

/** HTTP errors with status code */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Status codes that should NOT be retried
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 422]);

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /** Set auth token for subsequent requests */
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = 10000,
      retries = 2,
      noRetry = false,
      headers,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit & { signal?: AbortSignal } = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    let lastError: Error | null = null;
    const maxAttempts = noRetry ? 1 : retries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // AbortController for timeout
      const controller = new AbortController();
      config.signal = controller.signal;

      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, config);

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const error = new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData
          );

          // Don't retry client errors (4xx) except 408/429
          if (NON_RETRYABLE_STATUSES.has(response.status)) {
            throw error;
          }

          lastError = error;
          // Exponential backoff before retry
          if (attempt < maxAttempts - 1) {
            await this.delay(Math.min(1000 * 2 ** attempt, 5000));
            continue;
          }
          throw error;
        }

        // Handle 204 No Content
        if (response.status === 204) {
          return undefined as T;
        }

        return await response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          lastError = new Error(`Request timeout after ${timeout}ms: ${endpoint}`);
        } else if (error instanceof ApiError) {
          throw error; // Already handled above
        } else {
          lastError = error;
        }

        // Network error — retry with backoff
        if (attempt < maxAttempts - 1) {
          await this.delay(Math.min(1000 * 2 ** attempt, 5000));
          continue;
        }
      }
    }

    throw lastError || new Error(`Request failed: ${endpoint}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
