import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoadSavedVideos,
  VideoState,
  DeleteVideo,
} from 'src/app/core/state/video.state';
import { CameraControlService } from 'src/app/core/services/camera-control/camera-control.service';

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
  public selectedVideo: VideoItem | null = null;

  constructor(
    private store: Store,
    private cameraService: CameraControlService
  ) {}

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
    this.cameraService.muteCameraAudio();
  }

  closeDeleteModal() {
    this.selectedVideoId = null;
    this.cameraService.unmuteCameraAudio();
  }

  confirmDelete(videoId: number) {
    this.store.dispatch(new DeleteVideo(videoId));
    this.closeDeleteModal();
  }

  openVideoPlayer(video: VideoItem) {
    this.selectedVideo = video;
    this.cameraService.muteCameraAudio();
  }

  closeVideoPlayer() {
    this.selectedVideo = null;
    this.cameraService.unmuteCameraAudio();
  }
}
