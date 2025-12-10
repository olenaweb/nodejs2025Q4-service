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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
@ApiTags('Artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create artist' })
  @ApiResponse({ status: 201, description: 'Artist created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  async create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'Return all artists' })
  async findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiResponse({ status: 200, description: 'Return artist by id' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiResponse({ status: 200, description: 'Artist updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid data' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist' })
  @ApiResponse({ status: 204, description: 'Artist deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
