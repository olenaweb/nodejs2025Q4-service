import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponse } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavsService implements OnModuleInit {
  private artistService: ArtistService;
  private albumService: AlbumService;
  private trackService: TrackService;
  private favoriteId: string;

  constructor(
    private readonly prisma: PrismaService,
    private moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false });
    this.albumService = this.moduleRef.get(AlbumService, { strict: false });
    this.trackService = this.moduleRef.get(TrackService, { strict: false });

    // Ensure there is one Favorite record
    let favorite = await this.prisma.favorite.findFirst();
    if (!favorite) {
      favorite = await this.prisma.favorite.create({
        data: {},
      });
    }
    this.favoriteId = favorite.id;
  }

  async findAll(): Promise<FavoritesResponse> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id: this.favoriteId },
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
        albums: {
          include: {
            album: true,
          },
        },
        tracks: {
          include: {
            track: true,
          },
        },
      },
    });

    return {
      artists: favorite?.artists.map((fa) => fa.artist) || [],
      albums: favorite?.albums.map((fa) => fa.album) || [],
      tracks: favorite?.tracks.map((ft) => ft.track) || [],
    };
  }

  // Artist methods
  async addArtist(id: string): Promise<boolean> {
    try {
      const artist = await this.artistService.findOne(id);
      if (!artist) {
        return false;
      }
    } catch {
      // Artist not found
      return false;
    }

    // Check if already in favorites
    const existing = await this.prisma.favoriteArtist.findUnique({
      where: {
        favoriteId_artistId: {
          favoriteId: this.favoriteId,
          artistId: id,
        },
      },
    });

    if (existing) {
      return true;
    }

    await this.prisma.favoriteArtist.create({
      data: {
        favoriteId: this.favoriteId,
        artistId: id,
      },
    });

    return true;
  }

  async deleteArtist(id: string): Promise<boolean> {
    try {
      await this.prisma.favoriteArtist.delete({
        where: {
          favoriteId_artistId: {
            favoriteId: this.favoriteId,
            artistId: id,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async removeArtist(id: string): Promise<void> {
    try {
      await this.prisma.favoriteArtist.delete({
        where: {
          favoriteId_artistId: {
            favoriteId: this.favoriteId,
            artistId: id,
          },
        },
      });
    } catch {
      // Artist not in favorites, nothing to do
    }
  }

  // Album methods
  async addAlbum(id: string): Promise<boolean> {
    try {
      const album = await this.albumService.findOne(id);
      if (!album) {
        return false;
      }
    } catch {
      // Album not found
      return false;
    }

    // Check if already in favorites
    const existing = await this.prisma.favoriteAlbum.findUnique({
      where: {
        favoriteId_albumId: {
          favoriteId: this.favoriteId,
          albumId: id,
        },
      },
    });

    if (existing) {
      return true;
    }

    await this.prisma.favoriteAlbum.create({
      data: {
        favoriteId: this.favoriteId,
        albumId: id,
      },
    });

    return true;
  }

  async deleteAlbum(id: string): Promise<boolean> {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: {
          favoriteId_albumId: {
            favoriteId: this.favoriteId,
            albumId: id,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async removeAlbum(id: string): Promise<void> {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: {
          favoriteId_albumId: {
            favoriteId: this.favoriteId,
            albumId: id,
          },
        },
      });
    } catch {
      // Album not in favorites, nothing to do
    }
  }

  // Track methods
  async addTrack(id: string): Promise<boolean> {
    try {
      const track = await this.trackService.findOne(id);
      if (!track) {
        return false;
      }
    } catch {
      // Track not found
      return false;
    }

    // Check if already in favorites
    const existing = await this.prisma.favoriteTrack.findUnique({
      where: {
        favoriteId_trackId: {
          favoriteId: this.favoriteId,
          trackId: id,
        },
      },
    });

    if (existing) {
      return true;
    }

    await this.prisma.favoriteTrack.create({
      data: {
        favoriteId: this.favoriteId,
        trackId: id,
      },
    });

    return true;
  }

  async deleteTrack(id: string): Promise<boolean> {
    try {
      await this.prisma.favoriteTrack.delete({
        where: {
          favoriteId_trackId: {
            favoriteId: this.favoriteId,
            trackId: id,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async removeTrack(id: string): Promise<void> {
    try {
      await this.prisma.favoriteTrack.delete({
        where: {
          favoriteId_trackId: {
            favoriteId: this.favoriteId,
            trackId: id,
          },
        },
      });
    } catch {
      // Track not in favorites, nothing to do
    }
  }
}
