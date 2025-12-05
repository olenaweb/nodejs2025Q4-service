import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track | null> {
    if (!validate(id)) {
      return null;
    }
    return this.prisma.track.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track | null> {
    if (!validate(id)) {
      return null;
    }

    const existing = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return this.prisma.track.update({
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
  }

  async remove(id: string): Promise<boolean> {
    if (!validate(id)) {
      return false;
    }

    const existing = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!existing) {
      return false;
    }

    // Delete track
    await this.prisma.track.delete({
      where: { id },
    });

    // Remove from favorites
    await this.favsService.removeTrack(id);

    return true;
  }

  // Clear artistId reference when artist is deleted
  // Not needed anymore - Prisma handles this with onDelete: SetNull
  async clearArtistId(artistId: string): Promise<void> {
    // This is now handled by Prisma's onDelete: SetNull
    // But we keep the method for backward compatibility
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  // Clear albumId reference when album is deleted
  // Not needed anymore - Prisma handles this with onDelete: SetNull
  async clearAlbumId(albumId: string): Promise<void> {
    // This is now handled by Prisma's onDelete: SetNull
    // But we keep the method for backward compatibility
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
