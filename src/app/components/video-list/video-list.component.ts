import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoadSavedVideos,
  VideoState,
  DeleteVideo,
} from 'src/app/core/state/video.state';
import { CameraControlService } from 'src/app/core/services/camera-control.service';
import { getDate, getTime } from 'src/app/core/utils/date.utility';
import { Subscription } from 'rxjs';

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
export class VideoListComponent implements OnInit, OnDestroy {
  private videos$ = this.store.select(VideoState.getVideos);
  private subscription: Subscription = new Subscription();

  public videos: VideoItem[] = [];
  public selectedVideoId: number | null = null;
  public selectedVideo: VideoItem | null = null;
  public getDate = getDate;
  public getTime = getTime;

  public readonly noVideos = 'There are no recorded videos yet';
  public readonly browserError = 'Your browser does not support the video tag.';

  constructor(
    private store: Store,
    private cameraService: CameraControlService
  ) {}

  async ngOnInit() {
    this.store.dispatch(new LoadSavedVideos());

    this.subscription.add(
      this.videos$.subscribe((videos) => {
        this.videos = videos;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openDeleteModal(videoId: number): void {
    this.selectedVideoId = videoId;
    this.cameraService.muteCameraAudio();
  }

  public closeDeleteModal(): void {
    this.selectedVideoId = null;
    this.cameraService.unmuteCameraAudio();
  }

  public confirmDelete(videoId: number): void {
    this.store.dispatch(new DeleteVideo(videoId));
    this.closeDeleteModal();
  }

  public openVideoPlayer(video: VideoItem): void {
    this.selectedVideo = video;
    this.cameraService.muteCameraAudio();
    document.querySelectorAll<HTMLElement>('.description').forEach((el) => {
      el.style.zIndex = '0';
    });
  }

  public closeVideoPlayer(): void {
    this.selectedVideo = null;
    this.cameraService.unmuteCameraAudio();
    document.querySelectorAll<HTMLElement>('.description').forEach((el) => {
      el.style.zIndex = '2';
    });
  }
}
