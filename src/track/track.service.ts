import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track | null {
    if (!validate(id)) {
      return null;
    }
    const track = this.tracks.find((t) => t.id === id);
    return track || null;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track | null {
    if (!validate(id)) {
      return null;
    }
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    this.tracks[index] = {
      ...this.tracks[index],
      ...updateTrackDto,
      artistId:
        updateTrackDto.artistId !== undefined
          ? updateTrackDto.artistId || null
          : this.tracks[index].artistId,
      albumId:
        updateTrackDto.albumId !== undefined
          ? updateTrackDto.albumId || null
          : this.tracks[index].albumId,
    };
    return this.tracks[index];
  }

  remove(id: string): boolean {
    if (!validate(id)) {
      return false;
    }
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      return false;
    }
    this.tracks.splice(index, 1);

    // Clear track reference in favorites
    this.favsService.removeTrack(id);

    return true;
  }

  clearArtistId(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  clearAlbumId(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
