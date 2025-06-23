import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig } from './config';
import { ApiResponse } from './types';

/**
 * Base API client with Axios
 * Handles common config, errors, and response transformations
 */
export class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${apiConfig.baseUrl}/${apiConfig.version}`;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor to standardize data format
    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }

  // Standard response handler
  private handleSuccess(response: AxiosResponse): AxiosResponse {
    return response;
  }

  // Error handler
  private handleError = (error: AxiosError): Promise<never> => {
    if (error.response) {
      // Server returned an error response
      const status = error.response.status;
      const data = error.response.data as any;
      
      let errorMessage = data?.error?.message || data?.message || 'An error occurred';
      let errorCode = data?.error?.code || 'UNKNOWN_ERROR';
      
      console.error(`API Error (${status}): ${errorMessage}`);
      
      // We return the exact error structure that matches our ApiResponse
      return Promise.reject({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details: data?.error?.details || {},
          status: status
        }
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API Error: No response received', error.request);
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'No response received from server',
          status: 0
        }
      });
    } else {
      // Error setting up the request
      console.error('API Error: Request setup failed', error.message);
      return Promise.reject({
        success: false,
        error: {
          code: 'REQUEST_SETUP_ERROR',
          message: error.message,
          status: 0
        }
      });
    }
  };

  // Generic GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        console.log('GET request to:', url);
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return error as ApiResponse<T>;
    }
  }

  // Generic POST method
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return error as ApiResponse<T>;
    }
  }

  // Generic PUT method
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return error as ApiResponse<T>;
    }
  }

  // Generic DELETE method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return error as ApiResponse<T>;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
