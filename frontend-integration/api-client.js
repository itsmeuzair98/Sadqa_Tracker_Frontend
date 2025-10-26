// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// API Client class for making HTTP requests
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/';
        }
        const error = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async getGoogleAuthUrl() {
    return this.request('/auth/google');
  }

  async handleGoogleCallback(code) {
    const data = await this.request('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    
    this.setToken(data.access_token);
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // User methods
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Sadqa methods
  async createSadqaEntry(entryData) {
    return this.request('/sadqa/', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async getSadqaEntries(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (filters[key] instanceof Date) {
          params.append(key, filters[key].toISOString());
        } else {
          params.append(key, filters[key]);
        }
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/sadqa/?${queryString}` : '/sadqa/';
    return this.request(endpoint);
  }

  async getRecentSadqaEntries(limit = 3) {
    return this.request(`/sadqa/recent?limit=${limit}`);
  }

  async getSadqaStats() {
    return this.request('/sadqa/stats');
  }

  async getSadqaEntry(id) {
    return this.request(`/sadqa/${id}`);
  }

  async updateSadqaEntry(id, entryData) {
    return this.request(`/sadqa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteSadqaEntry(id) {
    return this.request(`/sadqa/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
const apiClient = new APIClient();

export default apiClient;

// Export individual methods for easier imports
export const {
  getGoogleAuthUrl,
  handleGoogleCallback,
  logout,
  getCurrentUser,
  updateUser,
  createSadqaEntry,
  getSadqaEntries,
  getRecentSadqaEntries,
  getSadqaStats,
  getSadqaEntry,
  updateSadqaEntry,
  deleteSadqaEntry,
} = apiClient;
