import { apiClient } from '../../client';
import { endpoints } from '../../config';
import {
  WardWiseReligionPopulationResponse,
  WardPopulationSummaryResponse,
  ReligionPopulationSummaryResponse,
  WardWiseReligionPopulationFilter,
  CreateWardWiseReligionPopulationDto,
  UpdateWardWiseReligionPopulationDto,
  ReligionType
} from './types';

/**
 * Service for interacting with ward-wise religion population API endpoints
 */
export class WardWiseReligionPopulationService {
  /**
   * Get all ward-wise religion population data with optional filtering
   */
  public async getAll(filter?: WardWiseReligionPopulationFilter): Promise<WardWiseReligionPopulationResponse[]> {
    const queryParams = new URLSearchParams();
    
    if (filter?.wardNumber) {
      queryParams.append('wardNumber', filter.wardNumber.toString());
    }
    
    if (filter?.religionType) {
      queryParams.append('religionType', filter.religionType);
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const path = `${endpoints.profile.demographics.wardWiseReligionPopulation.base}${query}`;
    
    const response = await apiClient.get<WardWiseReligionPopulationResponse[]>(path);
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch ward-wise religion population data:', response.error);
      return [];
    }
    
    return response.data;
  }
  
  /**
   * Get ward-wise religion population data for a specific ward
   */
  public async getByWard(wardNumber: number): Promise<WardWiseReligionPopulationResponse[]> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.byWard(wardNumber);
    
    const response = await apiClient.get<WardWiseReligionPopulationResponse[]>(path);
    
    if (!response.success || !response.data) {
      console.error(`Failed to fetch ward-wise religion population data for ward ${wardNumber}:`, response.error);
      return [];
    }
    
    return response.data;
  }
  
  /**
   * Get ward-wise religion population data for a specific religion type
   */
  public async getByReligion(religionType: ReligionType): Promise<WardWiseReligionPopulationResponse[]> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.byReligion(religionType);
    
    const response = await apiClient.get<WardWiseReligionPopulationResponse[]>(path);
    
    if (!response.success || !response.data) {
      console.error(`Failed to fetch ward-wise religion population data for religion ${religionType}:`, response.error);
      return [];
    }
    
    return response.data;
  }
  
  /**
   * Get religion population summary across all wards
   */
  public async getReligionSummary(): Promise<ReligionPopulationSummaryResponse[]> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.religionSummary;
    
    const response = await apiClient.get<ReligionPopulationSummaryResponse[]>(path);
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch religion population summary:', response.error);
      return [];
    }
    
    return response.data;
  }
  
  /**
   * Get ward population summary across all religions
   */
  public async getWardSummary(): Promise<WardPopulationSummaryResponse[]> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.wardSummary;
    
    const response = await apiClient.get<WardPopulationSummaryResponse[]>(path);
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch ward population summary:', response.error);
      return [];
    }
    
    return response.data;
  }
  
  /**
   * Get ward-wise religion population data by ID
   */
  public async getById(id: string): Promise<WardWiseReligionPopulationResponse | null> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.byId(id);
    
    const response = await apiClient.get<WardWiseReligionPopulationResponse>(path);
    
    if (!response.success || !response.data) {
      console.error(`Failed to fetch ward-wise religion population data with ID ${id}:`, response.error);
      return null;
    }
    
    return response.data;
  }
  
  /**
   * Create new ward-wise religion population data
   */
  public async create(data: CreateWardWiseReligionPopulationDto): Promise<WardWiseReligionPopulationResponse | null> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.base;
    
    const response = await apiClient.post<WardWiseReligionPopulationResponse>(path, data);
    
    if (!response.success || !response.data) {
      console.error('Failed to create ward-wise religion population data:', response.error);
      return null;
    }
    
    return response.data;
  }
  
  /**
   * Update existing ward-wise religion population data
   */
  public async update(id: string, data: UpdateWardWiseReligionPopulationDto): Promise<WardWiseReligionPopulationResponse | null> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.byId(id);
    
    const response = await apiClient.put<WardWiseReligionPopulationResponse>(path, data);
    
    if (!response.success || !response.data) {
      console.error(`Failed to update ward-wise religion population data with ID ${id}:`, response.error);
      return null;
    }
    
    return response.data;
  }
  
  /**
   * Delete ward-wise religion population data
   */
  public async delete(id: string): Promise<boolean> {
    const path = endpoints.profile.demographics.wardWiseReligionPopulation.byId(id);
    
    const response = await apiClient.delete<void>(path);
    
    if (!response.success) {
      console.error(`Failed to delete ward-wise religion population data with ID ${id}:`, response.error);
      return false;
    }
    
    return true;
  }
}

// Export singleton instance
export const wardWiseReligionPopulationService = new WardWiseReligionPopulationService();
