import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { LocationEntity } from "../database/entities/location.entity";
import { AuthService } from "../services/auth.service";
import { LocationService } from "../services/location.service";
import { UserService } from "../services/user.service";

@Controller("api/locations")
export class LocationController {

  constructor(
    private locationService: LocationService,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLocation(@Req() req): Promise<LocationEntity> {
    return await this.locationService.createLocation(req.user.username, req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllLocation(): Promise<LocationEntity[]> {
    return await this.locationService.findAllLocation();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  async findOneLocationByName(@Param('name') name: string): Promise<LocationEntity> {
    return await this.locationService.findOneLocationByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':name')
  async updateLocationByName(@Param('name') name: string, @Body() body: object): Promise<LocationEntity> {
    return await this.locationService.updateLocationByName(name, body["updateName"]);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':name')
  async deleteLocationByName(@Param('name') name: string): Promise<LocationEntity | object> {
    return await this.locationService.deleteLocationByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':name')
  async generateTokenLocation(@Param('name') name: string, @Req() req): Promise<object> {
    const location = await this.locationService.findOneLocationByName(name);
    if (!location) {
      return { "error": `location ${name} does not exist` }
    }
    const user = await this.userService.findOneByEmail(req.user.username);
    const payload = { locationName: name, activatorEmail: user.email, sub: user.id };
    return {
      access_token: this.authService.getAccessToke(payload)
    };
  }
}