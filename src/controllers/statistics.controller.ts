import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { StatisticService } from '../services/statistic.service';
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { StatisticDtoApiExample } from "../common/dtos/statistics.dto";

@ApiTags("Statistic")
@Controller('statistic')
export class StatisticsController {
    constructor(
        private readonly statisticService: StatisticService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({summary: "Recalculate users statistic by date or today."})
    @ApiOkResponse({status: 200})
    @ApiInternalServerErrorResponse({status: 500})
    async refreshUserStatistic(@Body() dto: StatisticDtoApiExample): Promise<void> {
        return await this.statisticService.createStatisticByUsers(dto.date, dto.userId);
    }
}
