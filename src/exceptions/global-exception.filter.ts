import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { ExceptionResponse } from './exception-response';
import { IHttpErrorParam } from './interfaces/http-error-param.interface';
import { extractValidationErrorMessages } from '../utils/class-validator.util';

/**
 * Filtro global para captura e tratamento de todas as exceções da aplicação
 *
 * Este filtro intercepta todos os erros lançados na aplicação e os converte
 * em respostas padronizadas, tratando diferentes tipos de exceções:
 * - ValidationError (erros de validação do class-validator)
 * - HttpException (erros HTTP explícitos do NestJS)
 * - Error genérico (erros não esperados)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Método principal que captura e trata todas as exceções
   */
  public catch(exception: unknown, host: ArgumentsHost): void {
    if (this.isValidationError(exception)) {
      return this.handleValidationError(exception as ValidationError[], host);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, host);
    }

    this.handleUnexpectedError(exception, host);
  }

  /**
   * Verifica se o erro é um ValidationError
   */
  private isValidationError(exception: unknown): boolean {
    return (
      Array.isArray(exception) &&
      exception.length > 0 &&
      exception[0] instanceof ValidationError
    );
  }

  /**
   * Trata erros de validação do class-validator
   *
   * Extrai recursivamente todas as mensagens de erro,
   * incluindo validações de objetos aninhados.
   */
  private handleValidationError(
    errors: ValidationError[],
    host: ArgumentsHost,
  ): void {
    const errorMessages = extractValidationErrorMessages(errors);
    const firstMessage =
      errorMessages[0] || 'Erro de validação nos dados fornecidos';

    const exceptionResponse = new ExceptionResponse(
      HttpStatus.BAD_REQUEST,
      firstMessage,
      errorMessages,
    );

    exceptionResponse.send(host);
  }

  /**
   * Trata erros HTTP explícitos (HttpException)
   */
  private handleHttpException(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const status = exception.getStatus();
    const response = exception.getResponse() as string | IHttpErrorParam;

    const exceptionResponse = ExceptionResponse.fromHttpError(status, response);

    exceptionResponse.send(host);
  }

  /**
   * Trata erros não esperados (Erro genérico)
   *
   * Registra o erro completo no console com stack trace
   * e retorna uma resposta genérica ao cliente com UUID
   * para rastreamento.
   */
  private handleUnexpectedError(exception: unknown, host: ArgumentsHost): void {
    const timestamp = new Date().toISOString();
    const uuid = uuidv4();

    const line = '='.repeat(80);

    this.logger.error(line);
    this.logger.error('Erro inesperado capturado');
    this.logger.error(`Timestamp: ${timestamp}`);
    this.logger.error(`UUID: ${uuid}`);

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`${JSON.stringify(exception)}`);
    }

    this.logger.error(line);

    const exceptionResponse = ExceptionResponse.internalError(uuid);

    exceptionResponse.send(host);
  }
}
