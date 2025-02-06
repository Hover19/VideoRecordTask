import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoadSavedVideos,
  VideoState,
  DeleteVideo,
} from 'src/app/core/state/video.state';

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
  private videos$ = this.store.select(VideoState.getVideos);
  public videos: VideoItem[] = [];
  public selectedVideoId: number | null = null;

  constructor(private store: Store) {}

  async ngOnInit() {
    this.store.dispatch(new LoadSavedVideos());

    this.videos$.subscribe((videos) => {
      this.videos = videos;
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

  openDeleteModal(videoId: number) {
    this.selectedVideoId = videoId;
  }

  closeDeleteModal() {
    this.selectedVideoId = null;
  }

  confirmDelete(videoId: number) {
    this.store.dispatch(new DeleteVideo(videoId));
    this.closeDeleteModal();
  }
}
