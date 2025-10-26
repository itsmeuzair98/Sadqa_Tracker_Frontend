// Backend URL - Updated for Render deployment
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = BACKEND_URL
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sadqa_jwt_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private handleAuthError(status: number) {
    if (status === 401) {
      // JWT token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sadqa_jwt_token');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
  }

  async get(endpoint: string, headers?: Record<string, string>) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers,
      },
    })

    if (!response.ok) {
      this.handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async post(endpoint: string, data?: any, headers?: Record<string, string>) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      this.handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async put(endpoint: string, data?: any, headers?: Record<string, string>) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      this.handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async delete(endpoint: string, headers?: Record<string, string>) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers,
      },
    })

    if (!response.ok) {
      this.handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
