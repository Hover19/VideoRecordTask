import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadSavedVideos, VideoState } from 'src/app/core/state/video.state';

interface VideoItem {
  id: number;
  videoUrl: string;
  recordedAt: string;
  duration: number;
}

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
  videos$ = this.store.select(VideoState.getVideos);
  videos: VideoItem[] = [];

  constructor(private store: Store) {}

  async ngOnInit() {
    console.log(this.videos$);
    this.store.dispatch(new LoadSavedVideos());

    this.videos$.subscribe((videos) => {
      console.log(videos);
      this.videos = videos;
      console.log(this.videos);
    });
  }

  public getDate(dateString: string): string {
    const date = new Date(dateString);
    const fullDay = date.getDate();
    const fullMonth = date.getMonth() + 1;
    const fullYear = date.getFullYear();

    return `${fullDay < 10 ? '0' + fullDay : fullDay}.${
      fullMonth < 10 ? '0' + fullMonth : fullMonth
    }.${fullYear}`;
  }

  public getTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  public checkDelete(): void {
    console.log('Delete');
  }
}
