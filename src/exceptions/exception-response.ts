import { HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { IExceptionResponse } from './interfaces/exception-response.interface';
import { IHttpErrorParam } from './interfaces/http-error-param.interface';

/**
 * Classe principal para padronização de respostas de erro HTTP
 *
 * Fornece uma estrutura consistente para retornar erros ao cliente,
 * incluindo status HTTP, mensagem principal e array de erros detalhados.
 */
export class ExceptionResponse implements IExceptionResponse {
  public readonly message: string;
  public readonly errors: string[];
  public readonly statusCode: number;
  public readonly uuid?: string;

  public constructor(
    statusCode: number,
    message: string,
    errors: string[] = [],
    uuid?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.uuid = uuid;
  }

  /**
   * Constrói o objeto de resposta padronizada
   */
  public build(): IExceptionResponse {
    const response: IExceptionResponse = {
      message: this.message,
      errors: this.errors,
      statusCode: this.statusCode,
      uuid: this.uuid,
    };

    return response;
  }

  /**
   * Envia automaticamente a resposta de erro ao cliente
   *
   * Utiliza o ArgumentsHost do NestJS para enviar
   * a resposta HTTP formatada.
   */
  public send(host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(this.statusCode).json(this.build());
  }

  /**
   * Cria uma ExceptionResponse a partir de um erro HTTP padrão
   */
  public static fromHttpError(
    statusCode: HttpStatus,
    message: string | IHttpErrorParam,
  ): ExceptionResponse {
    if (typeof message === 'string') {
      return new ExceptionResponse(statusCode, message);
    }

    if (Array.isArray(message.message)) {
      const firstMessage = message.message[0] || 'Erro de validação';
      return new ExceptionResponse(statusCode, firstMessage, message.message);
    }

    return new ExceptionResponse(statusCode, message.message);
  }

  /**
   * Cria uma ExceptionResponse para erros internos do servidor
   */
  public static internalError(uuid: string): ExceptionResponse {
    return new ExceptionResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      `Ocorreu um erro interno no servidor. ID: ${uuid}`,
      [],
      uuid,
    );
  }
}
