import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavsService } from '../favs/favs.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    private readonly logger: LoggingService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    this.logger.log(`Creating new track: ${createTrackDto.name}`, 'TrackService');
    const track = await this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });
    this.logger.log(`Track created successfully: ${track.name} (ID: ${track.id})`, 'TrackService');
    return track;
  }

  async findAll(): Promise<Track[]> {
    this.logger.debug('Fetching all tracks', 'TrackService');
    const tracks = await this.prisma.track.findMany();
    this.logger.log(`Found ${tracks.length} tracks`, 'TrackService');
    return tracks;
  }

  async findOne(id: string): Promise<Track | null> {
    this.logger.debug(`Fetching track by ID: ${id}`, 'TrackService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'TrackService');
      return null;
    }
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (track) {
      this.logger.log(`Track found: ${track.name} (ID: ${track.id})`, 'TrackService');
    } else {
      this.logger.warn(`Track not found with ID: ${id}`, 'TrackService');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track | null> {
    this.logger.log(`Updating track: ${id}`, 'TrackService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for update: ${id}`, 'TrackService');
      return null;
    }

    const existing = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Track not found for update: ${id}`, 'TrackService');
      return null;
    }

    const updated = await this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
        artistId:
          updateTrackDto.artistId !== undefined
            ? updateTrackDto.artistId || null
            : existing.artistId,
        albumId:
          updateTrackDto.albumId !== undefined ? updateTrackDto.albumId || null : existing.albumId,
      },
    });
    this.logger.log(
      `Track updated successfully: ${updated.name} (ID: ${updated.id})`,
      'TrackService',
    );
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`Deleting track: ${id}`, 'TrackService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for deletion: ${id}`, 'TrackService');
      return false;
    }

    const existing = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Track not found for deletion: ${id}`, 'TrackService');
      return false;
    }

    await this.prisma.track.delete({
      where: { id },
    });

    await this.favsService.removeTrack(id);

    this.logger.log(`Track deleted successfully: ${existing.name} (ID: ${id})`, 'TrackService');
    return true;
  }

}
