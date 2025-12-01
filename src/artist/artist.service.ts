import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist | null {
    if (!validate(id)) {
      return null;
    }
    const artist = this.artists.find((a) => a.id === id);
    return artist || null;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist | null {
    if (!validate(id)) {
      return null;
    }
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      return null;
    }
    this.artists[index] = {
      ...this.artists[index],
      ...updateArtistDto,
    };
    return this.artists[index];
  }

  remove(id: string): boolean {
    if (!validate(id)) {
      return false;
    }
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    this.artists.splice(index, 1);

    // Clear artist reference in albums, tracks and favorites
    this.albumService.clearArtistId(id);
    this.trackService.clearArtistId(id);
    this.favsService.removeArtist(id);

    return true;
  }
}
