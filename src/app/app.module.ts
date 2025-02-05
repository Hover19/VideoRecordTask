import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { VideoState } from './core/state/video.state';

@NgModule({
  declarations: [AppComponent, RecorderComponent],
  imports: [BrowserModule, AppRoutingModule, NgxsModule.forRoot([VideoState])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
