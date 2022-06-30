import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BaseEntity, 
    Index, 
    ManyToOne, 
    CreateDateColumn,
    UpdateDateColumn, 
    RelationId
 } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity('user_statistic')
@Index(['user', 'workDate'], { unique: true })
export class UsersStatisticsEntity extends BaseEntity {
    @ApiProperty({ example: '1', description: 'Record id.' })
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User UUID.' })
    @Index("ix_statistic_user")
    @ManyToOne(() => UserEntity, { nullable: false })
    @RelationId((statistic: UsersStatisticsEntity) => statistic.user)
    user: UserEntity;

    @ApiProperty({ example: '146320', description: 'User work time in secounds.' })
    @Column({ type: 'mediumint', nullable: false, select: true, update: true })
    @Index("ix_statistic_workTime")
    workTime: number;

    @ApiProperty({ example: '2022-01-01', description: 'Work date.' })
    @Column({ type: 'date', nullable: false, select: true, update: false})
    @Index("ix_statistic_workDate")
    workDate: Date;

    @ApiProperty({ example: '2022-06-27 09:26:50', description: 'Create time of database record.' })
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    
    @ApiProperty({ example: '2022-06-27 18:30:21', description: 'Update record time.' })
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}
