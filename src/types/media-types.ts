export type EntityType =
  | "LOCATION"
  | "WARD"
  | "SETTLEMENT"
  | "SQUATTER_AREA"
  | "ROAD"
  | "AGRICULTURAL_AREA"
  | "BUSINESS_AREA"
  | "INDUSTRIAL_AREA"
  | "PARKING_FACILITY";

export interface MediaItem {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl?: string;
  url?: string;
  fileSize?: number;
  mimeType?: string;
  title?: string;
  description?: string;
  displayOrder?: number;
  isPrimary?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaUploadRequest {
  files: File[];
  entityId: string;
  entityType: EntityType;
  title?: string;
  description?: string;
}

export interface SetPrimaryMediaRequest {
  mediaId: string;
  entityId: string;
  entityType: EntityType;
}

export interface DeleteMediaRequest {
  id: string;
}
