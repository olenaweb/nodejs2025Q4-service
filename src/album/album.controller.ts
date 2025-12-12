import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('album')
@ApiTags('Albums')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album information' })
  @ApiResponse({ status: 200, description: 'Album updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204, description: 'Album deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}
