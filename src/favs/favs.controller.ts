import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { validate } from 'uuid';

@Controller('favs')
@ApiTags('Favorites')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 422, description: "Artist doesn't exist" })
  async addArtist(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const added = await this.favsService.addArtist(id);
    if (!added) {
      throw new UnprocessableEntityException("Artist doesn't exist");
    }
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist not in favorites' })
  async deleteArtist(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.favsService.deleteArtist(id);
    if (!deleted) {
      throw new NotFoundException('Artist not in favorites');
    }
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 422, description: "Album doesn't exist" })
  async addAlbum(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const added = await this.favsService.addAlbum(id);
    if (!added) {
      throw new UnprocessableEntityException("Album doesn't exist");
    }
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not in favorites' })
  async deleteAlbum(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.favsService.deleteAlbum(id);
    if (!deleted) {
      throw new NotFoundException('Album not in favorites');
    }
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 422, description: "Track doesn't exist" })
  async addTrack(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const added = await this.favsService.addTrack(id);
    if (!added) {
      throw new UnprocessableEntityException("Track doesn't exist");
    }
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track not in favorites' })
  async deleteTrack(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.favsService.deleteTrack(id);
    if (!deleted) {
      throw new NotFoundException('Track not in favorites');
    }
  }
}
