// src/lib/api.ts
class ApiService {
  baseURL: string;

  constructor() {
    this.baseURL = "http://localhost:5000/api";
  }

  // ------------------------
  // 🔑 Auth helpers
  // ------------------------
  private getToken() {
    return localStorage.getItem("cbiusertoken");
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
  }

  // ------------------------
  // 🔑 Auth APIs
  // ------------------------
  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: { name?: string; phone?: string; address?: string }) {
    const response = await fetch(`${this.baseURL}/auth/profile/update`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // ------------------------
  // 🏦 Account APIs
  // ------------------------
  async getBalance() {
    const response = await fetch(`${this.baseURL}/amount/balance`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addMoney(data: { amount: number; accountNumber: string }) {
    const response = await fetch(`${this.baseURL}/amount/add`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deductMoney(data: { amount: number; accountNumber: string }) {
    const response = await fetch(`${this.baseURL}/amount/deduct`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // ------------------------
  // 💳 Transaction APIs
  // ------------------------
  async getTransactions(params: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  } = {}) {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    );

    const response = await fetch(`${this.baseURL}/transactions?${query.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ------------------------
  // 💳 ATM Card APIs
  // ------------------------
  async getATMCards() {
    const response = await fetch(`${this.baseURL}/atm-cards`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async requestATMCard(data: { cardType: string; deliveryAddress: string }) {
    const response = await fetch(`${this.baseURL}/atm-cards/request`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async setATMPin(data: { cardId: string; pin: string; confirmPin: string }) {
    const response = await fetch(`${this.baseURL}/atm-cards/set-pin`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async toggleBlockCard(cardId: string, action: "block" | "unblock") {
    const response = await fetch(`${this.baseURL}/atm-cards/${cardId}/${action}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ------------------------
  // 🏦 Fixed Deposit APIs
  // ------------------------
  async getFDs() {
    const response = await fetch(`${this.baseURL}/fixed-deposits`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createFD(data: { amount: number; tenure: number }) {
    const response = await fetch(`${this.baseURL}/fixed-deposits/create`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async breakFD(fdId: string) {
    const response = await fetch(`${this.baseURL}/fixed-deposits/${fdId}/break`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ------------------------
  // 📩 Contact / Support API
  // ------------------------
  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    const response = await fetch(`${this.baseURL}/contact`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

const apiService = new ApiService();
export default apiService;
