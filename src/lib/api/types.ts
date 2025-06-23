/**
 * Common type definitions for API responses and requests
 */

// Generic API Response structure matching the Spring backend
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PageMeta;
  error?: ErrorDetails;
}

// Error details structure
export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

// Pagination metadata structure
export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

