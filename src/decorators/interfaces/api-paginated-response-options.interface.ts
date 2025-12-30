import { Type } from '@nestjs/common';

/**
 * ApiPaginatedResponse decorator options
 */
export interface ApiPaginatedResponseOptions {
  type: Type<unknown>;
  description?: string;
  status?: number;
}
