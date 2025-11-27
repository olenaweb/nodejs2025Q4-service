import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(private readonly trackService: TrackService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album | null {
    if (!validate(id)) {
      return null;
    }
    const album = this.albums.find((a) => a.id === id);
    return album || null;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album | null {
    if (!validate(id)) {
      return null;
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return null;
    }
    this.albums[index] = {
      ...this.albums[index],
      ...updateAlbumDto,
      artistId:
        updateAlbumDto.artistId !== undefined
          ? updateAlbumDto.artistId || null
          : this.albums[index].artistId,
    };
    return this.albums[index];
  }

  remove(id: string): boolean {
    if (!validate(id)) {
      return false;
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    this.albums.splice(index, 1);

    // Clear album reference in tracks
    this.trackService.clearAlbumId(id);

    return true;
  }

  // Clear artistId reference when artist is deleted
  clearArtistId(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
