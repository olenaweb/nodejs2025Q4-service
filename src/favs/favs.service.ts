import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponse } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class FavsService implements OnModuleInit {
  private artistService: ArtistService;
  private albumService: AlbumService;
  private trackService: TrackService;
  private favoriteId: string;

  constructor(
    private readonly prisma: PrismaService,
    private moduleRef: ModuleRef,
    private readonly logger: LoggingService,
  ) {}

  async onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false });
    this.albumService = this.moduleRef.get(AlbumService, { strict: false });
    this.trackService = this.moduleRef.get(TrackService, { strict: false });

    // need at least one Favorite record
    let favorite = await this.prisma.favorite.findFirst();
    if (!favorite) {
      favorite = await this.prisma.favorite.create({
        data: {},
      });
    }
    this.favoriteId = favorite.id;
  }

  async findAll(): Promise<FavoritesResponse> {
    this.logger.debug('Fetching all favorites', 'FavsService');
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

    const response = {
      artists: favorite?.artists.map((fa) => fa.artist) || [],
      albums: favorite?.albums.map((fa) => fa.album) || [],
      tracks: favorite?.tracks.map((ft) => ft.track) || [],
    };

    this.logger.log(
      `Found ${response.artists.length} artists, ${response.albums.length} albums, ${response.tracks.length} tracks in favorites`,
      'FavsService',
    );

    return response;
  }

  // Artist methods
  async addArtist(id: string): Promise<boolean> {
    this.logger.log(`Adding artist to favorites: ${id}`, 'FavsService');
    try {
      const artist = await this.artistService.findOne(id);
      if (!artist) {
        this.logger.warn(`Artist not found: ${id}`, 'FavsService');
        return false;
      }
    } catch {
      this.logger.warn(`Artist not found (exception): ${id}`, 'FavsService');
      return false;
    }

    const existing = await this.prisma.favoriteArtist.findUnique({
      where: {
        favoriteId_artistId: {
          favoriteId: this.favoriteId,
          artistId: id,
        },
      },
    });

    if (existing) {
      this.logger.log(`Artist already in favorites: ${id}`, 'FavsService');
      return true;
    }

    await this.prisma.favoriteArtist.create({
      data: {
        favoriteId: this.favoriteId,
        artistId: id,
      },
    });

    this.logger.log(`Artist added to favorites successfully: ${id}`, 'FavsService');
    return true;
  }

  async deleteArtist(id: string): Promise<boolean> {
    this.logger.log(`Removing artist from favorites: ${id}`, 'FavsService');
    try {
      await this.prisma.favoriteArtist.delete({
        where: {
          favoriteId_artistId: {
            favoriteId: this.favoriteId,
            artistId: id,
          },
        },
      });
      this.logger.log(`Artist removed from favorites successfully: ${id}`, 'FavsService');
      return true;
    } catch {
      this.logger.warn(`Artist not found in favorites: ${id}`, 'FavsService');
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
    this.logger.log(`Adding album to favorites: ${id}`, 'FavsService');
    try {
      const album = await this.albumService.findOne(id);
      if (!album) {
        this.logger.warn(`Album not found: ${id}`, 'FavsService');
        return false;
      }
    } catch {
      this.logger.warn(`Album not found (exception): ${id}`, 'FavsService');
      return false;
    }

    const existing = await this.prisma.favoriteAlbum.findUnique({
      where: {
        favoriteId_albumId: {
          favoriteId: this.favoriteId,
          albumId: id,
        },
      },
    });

    if (existing) {
      this.logger.log(`Album already in favorites: ${id}`, 'FavsService');
      return true;
    }

    await this.prisma.favoriteAlbum.create({
      data: {
        favoriteId: this.favoriteId,
        albumId: id,
      },
    });

    this.logger.log(`Album added to favorites successfully: ${id}`, 'FavsService');
    return true;
  }

  async deleteAlbum(id: string): Promise<boolean> {
    this.logger.log(`Removing album from favorites: ${id}`, 'FavsService');
    try {
      await this.prisma.favoriteAlbum.delete({
        where: {
          favoriteId_albumId: {
            favoriteId: this.favoriteId,
            albumId: id,
          },
        },
      });
      this.logger.log(`Album removed from favorites successfully: ${id}`, 'FavsService');
      return true;
    } catch {
      this.logger.warn(`Album not found in favorites: ${id}`, 'FavsService');
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
    this.logger.log(`Adding track to favorites: ${id}`, 'FavsService');
    try {
      const track = await this.trackService.findOne(id);
      if (!track) {
        this.logger.warn(`Track not found: ${id}`, 'FavsService');
        return false;
      }
    } catch {
      // Track not found
      this.logger.warn(`Track not found (exception): ${id}`, 'FavsService');
      return false;
    }

    const existing = await this.prisma.favoriteTrack.findUnique({
      where: {
        favoriteId_trackId: {
          favoriteId: this.favoriteId,
          trackId: id,
        },
      },
    });

    if (existing) {
      this.logger.log(`Track already in favorites: ${id}`, 'FavsService');
      return true;
    }

    await this.prisma.favoriteTrack.create({
      data: {
        favoriteId: this.favoriteId,
        trackId: id,
      },
    });

    this.logger.log(`Track added to favorites successfully: ${id}`, 'FavsService');
    return true;
  }

  async deleteTrack(id: string): Promise<boolean> {
    this.logger.log(`Removing track from favorites: ${id}`, 'FavsService');
    try {
      await this.prisma.favoriteTrack.delete({
        where: {
          favoriteId_trackId: {
            favoriteId: this.favoriteId,
            trackId: id,
          },
        },
      });
      this.logger.log(`Track removed from favorites successfully: ${id}`, 'FavsService');
      return true;
    } catch {
      this.logger.warn(`Track not found in favorites: ${id}`, 'FavsService');
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
