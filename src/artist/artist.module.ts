import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [AlbumModule, TrackModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
