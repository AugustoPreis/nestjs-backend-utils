import { Type } from '@nestjs/common';

/**
 * Opções para resposta paginada no Swagger
 */
export interface ApiPaginatedResponseOptions {
  type: Type<unknown>;
  description?: string;
  status?: number;
}
