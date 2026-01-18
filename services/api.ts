
export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
}

class ApiService {
  private config: ApiConfig = {
    baseUrl: localStorage.getItem('vms_api_url') || '',
    apiKey: localStorage.getItem('vms_api_key') || ''
  };

  updateConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.baseUrl) localStorage.setItem('vms_api_url', newConfig.baseUrl);
    if (newConfig.apiKey) localStorage.setItem('vms_api_key', newConfig.apiKey);
  }

  getConfig() {
    return this.config;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    if (!this.config.baseUrl) {
      return this.fallbackRequest(endpoint, options);
    }

    const url = `${this.config.baseUrl}/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`[API] Connection failed to ${url}:`, error);
      throw error;
    }
  }

  private fallbackRequest(endpoint: string, options: RequestInit) {
    const storageKey = `vms_data_${endpoint.replace(/\//g, '_')}`;
    const method = options.method || 'GET';
    
    let data = JSON.parse(localStorage.getItem(storageKey) || (endpoint.includes('global_config') ? 'null' : '[]'));

    if (method === 'GET') return data;
    
    if (method === 'POST') {
      const newItem = { ...JSON.parse(options.body as string), id: Date.now().toString() };
      data = Array.isArray(data) ? [newItem, ...data] : newItem;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return newItem;
    }

    if (method === 'PUT') {
      const updatedData = JSON.parse(options.body as string);
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return updatedData;
    }

    return null;
  }

  async getRegistrations() { return this.request('registrations'); }
  async createRegistration(data: any) { return this.request('registrations', { method: 'POST', body: JSON.stringify(data) }); }
  async updateRegistration(id: string, data: any) { return this.request(`registrations/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async getFeedbacks() { return this.request('feedbacks'); }
  async createFeedback(data: any) { return this.request('feedbacks', { method: 'POST', body: JSON.stringify(data) }); }
}

export const api = new ApiService();
