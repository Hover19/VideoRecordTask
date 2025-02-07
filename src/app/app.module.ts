import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { VideoState } from './core/state/video.state';
import { VideoListComponent } from './components/video-list/video-list.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

@NgModule({
  declarations: [
    AppComponent,
    RecorderComponent,
    VideoListComponent,
    DeleteModalComponent,
    VideoPlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([VideoState]),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
