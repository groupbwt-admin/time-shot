import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "./user.entity";
import { LocationEntity } from "./location.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('time_shots')
export class TimeShotEntity extends BaseEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @ManyToOne(() => UserEntity, user => user.timeShots, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @ManyToOne(() => LocationEntity, location => location.startTimeShots, { nullable: false })
    @JoinColumn({ name: "locationStartId" })
    locationStart: LocationEntity;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @ManyToOne(() => LocationEntity, location => location.endTimeShots, { nullable: true })
    @JoinColumn({ name: "locationEndId" })
    locationEnd: LocationEntity;

    @ApiProperty({ example: '2022-06-25 12:07:31', description: 'timestamp' })
    @Column({ precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    start: Date;

    @ApiProperty({ example: '2022-06-25 12:07:31', description: 'timestamp' })
    @Column({ precision: null, type: "timestamp", nullable: true })
    stop?: Date;
}