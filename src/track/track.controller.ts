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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('track')
@ApiTags('Tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new track' })
  @ApiResponse({ status: 201, description: 'Track created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track information' })
  @ApiResponse({ status: 200, description: 'Track updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiResponse({ status: 204, description: 'Track deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async remove(@Param('id') id: string) {
    return this.trackService.remove(id);
  }
}
