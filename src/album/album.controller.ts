import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { validate } from 'uuid';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
@ApiTags('Albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: 'Add new album' })
  @ApiResponse({ status: 201, description: 'Album created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({ status: 200, description: 'Return all albums' })
  async findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiResponse({ status: 200, description: 'Return album by id' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (album === null) {
      if (!validate(id)) {
        throw new BadRequestException('Invalid UUID');
      }
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album information' })
  @ApiResponse({ status: 200, description: 'Album updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = await this.albumService.update(id, updateAlbumDto);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204, description: 'Album deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.albumService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Album not found');
    }
  }
}
