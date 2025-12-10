import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { FavsService } from '../favs/favs.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    private readonly logger: LoggingService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    this.logger.log(`Creating new album: ${createAlbumDto.name}`, 'AlbumService');
    const album = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
    this.logger.log(`Album created successfully: ${album.name} (ID: ${album.id})`, 'AlbumService');
    return album;
  }

  async findAll(): Promise<Album[]> {
    this.logger.debug('Fetching all albums', 'AlbumService');
    const albums = await this.prisma.album.findMany();
    this.logger.log(`Found ${albums.length} albums`, 'AlbumService');
    return albums;
  }

  async findOne(id: string): Promise<Album> {
    this.logger.debug(`Fetching album by ID: ${id}`, 'AlbumService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided: ${id}`, 'AlbumService');
      throw new BadRequestException('Invalid album ID (not UUID)');
    }
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      this.logger.warn(`Album not found with ID: ${id}`, 'AlbumService');
      throw new NotFoundException('Album not found');
    }
    this.logger.log(`Album found: ${album.name} (ID: ${album.id})`, 'AlbumService');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    this.logger.log(`Updating album: ${id}`, 'AlbumService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for update: ${id}`, 'AlbumService');
      throw new BadRequestException('Invalid album ID (not UUID)');
    }

    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Album not found for update: ${id}`, 'AlbumService');
      throw new NotFoundException('Album not found');
    }

    const updated = await this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
        artistId:
          updateAlbumDto.artistId !== undefined
            ? updateAlbumDto.artistId || null
            : existing.artistId,
      },
    });
    this.logger.log(
      `Album updated successfully: ${updated.name} (ID: ${updated.id})`,
      'AlbumService',
    );
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting album: ${id}`, 'AlbumService');
    if (!validate(id)) {
      this.logger.warn(`Invalid UUID provided for deletion: ${id}`, 'AlbumService');
      throw new BadRequestException('Invalid album ID (not UUID)');
    }

    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Album not found for deletion: ${id}`, 'AlbumService');
      throw new NotFoundException('Album not found');
    }

    // Delete album (Prisma will handle CASCADE for tracks via onDelete: SetNull)
    await this.prisma.album.delete({
      where: { id },
    });

    await this.favsService.removeAlbum(id);

    this.logger.log(`Album deleted successfully: ${existing.name} (ID: ${id})`, 'AlbumService');
  }
}
