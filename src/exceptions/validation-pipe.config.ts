import { INestApplication, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { extractValidationErrorMessages } from '../utils/class-validator.util';

/**
 * Configuração padrão para o ValidationPipe
 *
 * Define valores recomendados para validação e transformação
 * automática de dados em aplicações NestJS.
 */
const DEFAULT_VALIDATION_OPTIONS: ValidationPipeOptions = {
  whitelist: true, // Remove propriedades não decoradas
  transform: true, // Habilita transformação automática de tipos
  forbidNonWhitelisted: false, // Não rejeita propriedades extras
  transformOptions: {
    enableImplicitConversion: true, // Conversão automática de tipos
  },
};

/**
 * Classe helper para configurar ValidationPipe com tratamento de erros padronizado
 *
 * Fornece configuração otimizada do ValidationPipe do NestJS com integração
 * automática ao sistema de exceções personalizado. Converte erros de validação
 * do class-validator em exceções formatadas.
 */
export class ValidationPipeConfig {
  /**
   * Configura o ValidationPipe global da aplicação
   *
   * Aplica configurações padrão e integra com o sistema de exceções,
   * convertendo automaticamente ValidationError[] em formato padronizado.
   */
  public static configure(
    app: INestApplication,
    options: ValidationPipeOptions = {},
  ): void {
    app.useGlobalPipes(this.create(options));
  }

  /**
   * Cria a factory de exceções para o ValidationPipe
   *
   * Converte array de ValidationError em BadRequestException
   * que será capturada pelo GlobalExceptionFilter e formatada
   * adequadamente.
   */
  private static createExceptionFactory(): (
    errors: ValidationError[],
  ) => BadRequestException {
    return (errors: ValidationError[]) => {
      return new BadRequestException({
        message: extractValidationErrorMessages(errors),
      });
    };
  }

  /**
   * Cria uma instância de ValidationPipe configurada
   *
   * Útil para aplicar validação em módulos ou controllers específicos.
   */
  public static create(options: ValidationPipeOptions = {}): ValidationPipe {
    return new ValidationPipe({
      ...DEFAULT_VALIDATION_OPTIONS,
      ...options,
      exceptionFactory: this.createExceptionFactory(),
    });
  }
}
