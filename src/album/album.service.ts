import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
// import { TrackService } from '../track/track.service';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album | null> {
    if (!validate(id)) {
      return null;
    }
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album | null> {
    if (!validate(id)) {
      return null;
    }

    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
        artistId:
          updateAlbumDto.artistId !== undefined
            ? updateAlbumDto.artistId || null
            : existing.artistId,
      },
    });
  }

  async remove(id: string): Promise<boolean> {
    if (!validate(id)) {
      return false;
    }

    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      return false;
    }

    // Delete album (Prisma will handle CASCADE for tracks via onDelete: SetNull)
    await this.prisma.album.delete({
      where: { id },
    });

    await this.favsService.removeAlbum(id);

    return true;
  }

  // Clear artistId reference when artist is deleted
  // Not needed anymore - Prisma handles this with onDelete: SetNull
  // Keeped the method for backward compatibility
  async clearArtistId(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
