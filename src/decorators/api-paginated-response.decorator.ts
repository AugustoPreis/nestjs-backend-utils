import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

import { ApiPaginatedResponseOptions } from './interfaces/api-paginated-response-options.interface';

/**
 * Decorator to document paginated responses in Swagger
 *
 * Automatically generates documentation for endpoints that return
 * paginated data following the PaginatedResponseDTO pattern.
 */
export function ApiPaginatedResponse(
  options: ApiPaginatedResponseOptions,
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
      status: options.status || HttpStatus.OK,
      description: options.description || 'Paginated list',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
              total: {
                type: 'number',
                description: 'Total records',
              },
              page: {
                type: 'number',
                description: 'Current page',
              },
              pages: {
                type: 'number',
                description: 'Total pages',
              },
            },
          },
        ],
      },
    }),
  );
}
