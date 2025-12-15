import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsValidNumber } from '@validators';
import { EOrder } from '@enums';

/**
 * DTO base para filtros de listagem paginada
 *
 * Fornece campos padrão para paginação e ordenação,
 * utilizados em endpoints de listagem.
 */
export class FindManyFiltersDTO {
  /**
   * Limite de registros por página
   */
  @ApiPropertyOptional({
    description: 'Número de registros por página',
    default: 10,
    minimum: 1,
  })
  @IsValidNumber({
    name: 'Número de registros por página',
    required: false,
    allowString: true,
    integerOnly: true,
    min: 1,
  })
  public take: number = 10;

  /**
   * Número da página
   */
  @ApiPropertyOptional({
    description: 'Número da página',
    default: 1,
    minimum: 1,
  })
  @IsValidNumber({
    name: 'Número da página',
    required: false,
    allowString: true,
    integerOnly: true,
    min: 1,
  })
  public page: number = 1;

  /**
   * Campo de ordenação
   */
  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'createdAt',
  })
  @IsOptional()
  public sort?: string;

  /**
   * Direção da ordenação
   */
  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: EOrder,
    default: EOrder.DESC,
  })
  @IsOptional()
  @IsEnum(EOrder, { message: 'Campo "Direção da ordenação" inválido' })
  public order: EOrder = EOrder.DESC;

  /**
   * Calcula o offset para a query
   */
  public getOffset(): number {
    const pageIndex = (this.page || 1) - 1;
    const take = this.take || 10;

    return pageIndex * take;
  }
}
