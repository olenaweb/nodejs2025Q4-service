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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
@ApiTags('Artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create artist' })
  @ApiResponse({ status: 201, description: 'Artist created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'Return all artists' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiResponse({ status: 200, description: 'Return artist by id' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  findOne(@Param('id') id: string) {
    const artist = this.artistService.findOne(id);
    if (artist === null) {
      if (!validate(id)) {
        throw new BadRequestException('Invalid UUID');
      }
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiResponse({ status: 200, description: 'Artist updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = this.artistService.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete artist' })
  @ApiResponse({ status: 204, description: 'Artist deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = this.artistService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Artist not found');
    }
  }
}
