import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

import { ApiPaginatedResponseOptions } from '@decorators';

/**
 * Decorator para documentar respostas paginadas no Swagger
 *
 * Gera automaticamente a documentação para endpoints que retornam
 * dados paginados seguindo o padrão PaginatedResponseDTO.
 */
export function ApiPaginatedResponse(
  options: ApiPaginatedResponseOptions,
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
      status: options.status || HttpStatus.OK,
      description: options.description || 'Lista paginada',
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
                description: 'Total de registros',
              },
              page: {
                type: 'number',
                description: 'Página atual',
              },
              pages: {
                type: 'number',
                description: 'Total de páginas',
              },
            },
          },
        ],
      },
    }),
  );
}
