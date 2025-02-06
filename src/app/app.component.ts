import { Component, OnInit } from '@angular/core';
import { BandwidthService } from './core/services/bandwidth-service/bandwidth.service';
import { LoadSavedVideos, VideoState } from './core/state/video.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  videos$ = this.store.select(VideoState.getVideos);
  videos: string[] = [];

  constructor(
    private bandwidthService: BandwidthService,
    private store: Store
  ) {}

  async ngOnInit() {
    const bandwidth = await this.bandwidthService.checkBandwidth();
    console.log('Detected bandwidth:', bandwidth, 'Mbps');

    this.store.dispatch(new LoadSavedVideos());

    // Subscribe to videos list and get the first video URL
    this.videos$.subscribe((videos) => {
      this.videos = videos;
    });
  }
}
