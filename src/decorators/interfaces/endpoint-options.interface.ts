import {
  CanActivate,
  HttpStatus,
  NestInterceptor,
  PipeTransform,
  RequestMethod,
  Type,
} from '@nestjs/common';
import {
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

export interface IEndpointOptions {
  method?: RequestMethod;
  path?: string;
  description?: string;
  summary?: string;
  status?: HttpStatus;
  responses?: ApiResponseOptions[];
  guards?: Array<CanActivate | Type<CanActivate>>;
  interceptors?: Array<NestInterceptor | Type<NestInterceptor>>;
  pipes?: Array<PipeTransform | Type<PipeTransform>>;
  serialize?: boolean | Type<NestInterceptor>;
  bodyType?: Type<unknown> | string;
  tags?: string[];
  auth?: boolean | 'bearer' | 'basic' | 'api-key';
  queryParams?: Array<ApiQueryOptions>;
  pathParams?: Array<ApiParamOptions>;
  headers?: Record<string, string>;
}
