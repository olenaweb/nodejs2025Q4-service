import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { FavsService } from '../favs/favs.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    private readonly logger: LoggingService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    this.logger.log(`Creating new artist: ${createArtistDto.name}`, 'ArtistService');
    const artist = await this.prisma.artist.create({
      data: createArtistDto,
    });
    this.logger.log(
      `Artist created successfully: ${artist.name} (ID: ${artist.id})`,
      'ArtistService',
    );
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    this.logger.debug('Fetching all artists', 'ArtistService');
    const artists = await this.prisma.artist.findMany();
    this.logger.log(`Found ${artists.length} artists`, 'ArtistService');
    return artists;
  }

  async findOne(id: string): Promise<Artist> {
    this.logger.debug(`Fetching artist by ID: ${id}`, 'ArtistService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'ArtistService');
      throw new BadRequestException('Invalid artist ID (not UUID)');
    }
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      this.logger.warn(`Artist not found with ID: ${id}`, 'ArtistService');
      throw new NotFoundException('Artist not found');
    }
    this.logger.log(`Artist found: ${artist.name} (ID: ${artist.id})`, 'ArtistService');
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    this.logger.log(`Updating artist: ${id}`, 'ArtistService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for update: ${id}`, 'ArtistService');
      throw new BadRequestException('Invalid artist ID (not UUID)');
    }

    const existing = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Artist not found for update: ${id}`, 'ArtistService');
      throw new NotFoundException('Artist not found');
    }

    const updated = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
    this.logger.log(
      `Artist updated successfully: ${updated.name} (ID: ${updated.id})`,
      'ArtistService',
    );
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting artist: ${id}`, 'ArtistService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for deletion: ${id}`, 'ArtistService');
      throw new BadRequestException('Invalid artist ID (not UUID)');
    }

    const existing = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Artist not found for deletion: ${id}`, 'ArtistService');
      throw new NotFoundException('Artist not found');
    }

    // not need anymore to delete artist (Prisma will do it)
    await this.prisma.artist.delete({
      where: { id },
    });

    await this.favsService.removeArtist(id);

    this.logger.log(`Artist deleted successfully: ${existing.name} (ID: ${id})`, 'ArtistService');
  }
}
