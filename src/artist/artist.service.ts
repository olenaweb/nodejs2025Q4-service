import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | null> {
    if (!validate(id)) {
      return null;
    }
    return this.prisma.artist.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist | null> {
    if (!validate(id)) {
      return null;
    }

    const existing = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string): Promise<boolean> {
    if (!validate(id)) {
      return false;
    }

    const existing = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!existing) {
      return false;
    }

    // Delete artist (Prisma will handle CASCADE for albums/tracks via onDelete: SetNull)
    await this.prisma.artist.delete({
      where: { id },
    });

    // Remove from favorites
    await this.favsService.removeArtist(id);

    return true;
  }
}
