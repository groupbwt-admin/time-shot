import { ApiProperty } from "@nestjs/swagger";

export class StatisticDtoApiExample {
    @ApiProperty({ description: "Date in format YYYY-MM-DD.", example: "2022-07-01"})
    date?: string;

    @ApiProperty({ description: "User UUID.", example: "123e4567-e89b-12d3-a456-426614174121"})
    userId?: string;
}
