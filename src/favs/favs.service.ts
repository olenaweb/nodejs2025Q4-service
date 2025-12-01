import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FavoritesResponse } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavsService implements OnModuleInit {
  private favoriteArtists: string[] = [];
  private favoriteAlbums: string[] = [];
  private favoriteTracks: string[] = [];

  private artistService: ArtistService;
  private albumService: AlbumService;
  private trackService: TrackService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false });
    this.albumService = this.moduleRef.get(AlbumService, { strict: false });
    this.trackService = this.moduleRef.get(TrackService, { strict: false });
  }

  findAll(): FavoritesResponse {
    const artists = this.favoriteArtists
      .map((id) => this.artistService.findOne(id))
      .filter((artist): artist is Artist => artist !== null);

    const albums = this.favoriteAlbums
      .map((id) => this.albumService.findOne(id))
      .filter((album): album is Album => album !== null);

    const tracks = this.favoriteTracks
      .map((id) => this.trackService.findOne(id))
      .filter((track): track is Track => track !== null);

    return { artists, albums, tracks };
  }

  // Artist methods
  addArtist(id: string): boolean {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      return false;
    }
    if (this.favoriteArtists.includes(id)) {
      return true;
    }
    this.favoriteArtists.push(id);
    return true;
  }

  deleteArtist(id: string): boolean {
    const index = this.favoriteArtists.indexOf(id);
    if (index === -1) {
      return false;
    }
    this.favoriteArtists.splice(index, 1);
    return true;
  }

  removeArtist(id: string): void {
    const index = this.favoriteArtists.indexOf(id);
    if (index !== -1) {
      this.favoriteArtists.splice(index, 1);
    }
  }

  // Album methods
  addAlbum(id: string): boolean {
    const album = this.albumService.findOne(id);
    if (!album) {
      return false;
    }
    if (this.favoriteAlbums.includes(id)) {
      return true;
    }
    this.favoriteAlbums.push(id);
    return true;
  }

  deleteAlbum(id: string): boolean {
    const index = this.favoriteAlbums.indexOf(id);
    if (index === -1) {
      return false;
    }
    this.favoriteAlbums.splice(index, 1);
    return true;
  }

  removeAlbum(id: string): void {
    const index = this.favoriteAlbums.indexOf(id);
    if (index !== -1) {
      this.favoriteAlbums.splice(index, 1);
    }
  }

  // Track methods
  addTrack(id: string): boolean {
    const track = this.trackService.findOne(id);
    if (!track) {
      return false;
    }
    if (this.favoriteTracks.includes(id)) {
      return true;
    }
    this.favoriteTracks.push(id);
    return true;
  }

  deleteTrack(id: string): boolean {
    const index = this.favoriteTracks.indexOf(id);
    if (index === -1) {
      return false;
    }
    this.favoriteTracks.splice(index, 1);
    return true;
  }

  removeTrack(id: string): void {
    const index = this.favoriteTracks.indexOf(id);
    if (index !== -1) {
      this.favoriteTracks.splice(index, 1);
    }
  }
}
