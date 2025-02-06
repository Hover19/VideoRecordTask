import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { VideoState } from './core/state/video.state';
import { VideoListComponent } from './components/video-list/video-list.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';

@NgModule({
  declarations: [AppComponent, RecorderComponent, VideoListComponent, DeleteModalComponent],
  imports: [BrowserModule, AppRoutingModule, NgxsModule.forRoot([VideoState])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
