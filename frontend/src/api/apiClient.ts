import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Transaction {
  id: string;
  nickname: string;
  description: string;
  transactionDate: string;
  purchaseAmountUsd: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ConversionResponse {
  transactionId: string;
  nickname: string;
  description: string;
  transactionDate: string;
  purchaseAmountUsd: number;
  targetCountry: string;
  targetCurrency: string;
  exchangeRate: number;
  exchangeRateDate: string;
  convertedAmount: number;
  rateAgeDays: number;
  rateWindowStatus: string;
}

export interface SupportedCurrency {
  country: string;
  currency: string;
  latestExchangeRate: number;
  latestExchangeRateDate: string;
}

export const fetchTransactions = async (page = 0, size = 10, search = '') => {
  const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (search) params.append('search', search);
  const response = await apiClient.get<PageResponse<Transaction>>('/transactions', { params });
  return response.data;
};

export const fetchTransaction = async (id: string) => {
  const response = await apiClient.get<Transaction>(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (data: any) => {
  const response = await apiClient.post<Transaction>('/transactions', data);
  return response.data;
};

export const convertTransaction = async (id: string, country: string, currency: string) => {
  const params = new URLSearchParams();
  if (country) params.append('country', country);
  if (currency) params.append('currency', currency);
  const response = await apiClient.get<ConversionResponse>(`/transactions/${id}/conversion`, { params });
  return response.data;
};

export const fetchSupportedCurrencies = async () => {
  const response = await apiClient.get<SupportedCurrency[]>('/currencies');
  return response.data;
};
