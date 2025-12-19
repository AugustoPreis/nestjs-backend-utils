import {
  applyDecorators,
  Header,
  HttpCode,
  HttpStatus,
  RequestMapping,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { IEndpointOptions } from './interfaces/endpoint-options.interface';
import { ArrayHelper } from '../helpers/array.helper';

/**
 * Decorator para definir endpoints REST com diversas opções
 *
 * Define endpoints de API REST com várias opções como método, caminho,
 * guards, interceptors, pipes, serialização, headers, autenticação e
 * documentação Swagger.
 */
export function Endpoint(
  options: IEndpointOptions,
): ClassDecorator & MethodDecorator & PropertyDecorator {
  const decorators: Array<ClassDecorator | MethodDecorator> = [
    RequestMapping({
      method: options.method,
      path: options.path,
    }),

    HttpCode(options.status ?? HttpStatus.OK),
  ];

  options.queryParams?.forEach((param) => decorators.push(ApiQuery(param)));
  options.pathParams?.forEach((param) => decorators.push(ApiParam(param)));

  if (ArrayHelper.isNotEmpty(options.guards)) {
    decorators.push(UseGuards(...options.guards));
  }

  if (ArrayHelper.isNotEmpty(options.interceptors)) {
    decorators.push(UseInterceptors(...options.interceptors));
  }

  if (ArrayHelper.isNotEmpty(options.pipes)) {
    decorators.push(UsePipes(...options.pipes));
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      decorators.push(Header(key, value));
    });
  }

  if (ArrayHelper.isNotEmpty(options.tags)) {
    decorators.push(ApiTags(...options.tags));
  }

  if (options.serialize) {
    const serializeInterceptor =
      options.serialize === true
        ? ClassSerializerInterceptor
        : options.serialize;

    decorators.push(UseInterceptors(serializeInterceptor));
  }

  if (options.auth) {
    switch (options.auth) {
      case 'bearer':
        decorators.push(ApiBearerAuth());
        break;
      case 'basic':
        decorators.push(ApiBasicAuth());
        break;
      case 'api-key':
        decorators.push(ApiSecurity('api-key'));
        break;
      case true:
        decorators.push(ApiBearerAuth());
        break;
    }
  }

  if (options.description || options.summary) {
    decorators.push(
      ApiOperation({
        summary: options.summary,
        description: options.description,
      }),
    );
  }

  if (options.bodyType) {
    decorators.push(
      ApiBody({
        type: options.bodyType,
      }),
    );
  }

  if (options.responses) {
    decorators.push(
      ...options.responses.map((response) => ApiResponse(response)),
    );
  }

  return applyDecorators(...decorators);
}
