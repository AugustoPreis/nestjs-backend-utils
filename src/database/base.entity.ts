import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

import { EStatus } from '../enums/status.enum';

/**
 * Entidade base com campos comuns
 *
 * Fornece campos padrão para todas as entidades, incluindo
 * ID, status, timestamps e soft delete.
 */
@Entity()
export abstract class BaseEntity {
  /**
   * ID autoincremental
   */
  @PrimaryGeneratedColumn()
  public id!: number;

  /**
   * Status do registro
   */
  @Column({
    type: 'enum',
    enum: EStatus,
    default: EStatus.ACTIVE,
  })
  public status!: EStatus;

  /**
   * Data de criação
   */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  /**
   * Data da última atualização
   */
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  /**
   * Data de soft delete
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public deletedAt?: Date | null;

  /**
   * Verifica se o registro está ativo
   */
  public isActive(): boolean {
    return this.status === EStatus.ACTIVE && !this.deletedAt;
  }

  /**
   * Verifica se o registro está deletado
   */
  public isDeleted(): boolean {
    return this.status === EStatus.DELETED || !!this.deletedAt;
  }

  /**
   * Verifica se o registro está inativo
   */
  public isInactive(): boolean {
    return this.status === EStatus.INACTIVE;
  }

  /**
   * Ativa o registro
   */
  public activate(): void {
    this.status = EStatus.ACTIVE;
  }

  /**
   * Desativa o registro
   */
  public deactivate(): void {
    this.status = EStatus.INACTIVE;
  }

  public restore(status: EStatus = EStatus.ACTIVE): void {
    this.status = status;
    this.deletedAt = null;
  }

  /**
   * Marca o registro como deletado (soft delete)
   */
  public softDelete(): void {
    this.status = EStatus.DELETED;
    this.deletedAt = new Date();
  }
}
