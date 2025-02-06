import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { VideoStorageService } from '../services/video-storage/video-storage.service';

// Actions
export class AddVideo {
  static readonly type = '[Video] Add Video';
  constructor(
    public videoBlob: Blob,
    public recordedAt: string,
    public duration: number
  ) {}
}

export class DeleteVideo {
  static readonly type = '[Video] Delete Video';
  constructor(public videoId: number) {}
}

export class LoadSavedVideos {
  static readonly type = '[Video] Load Saved Videos';
}

export interface StoredVideoEntry {
  id: number;
  videoData: Blob;
  recordedAt: string;
  duration: number;
}

interface VideoStateModel {
  videos: {
    id: number;
    videoUrl: string;
    recordedAt: string;
    duration: number;
  }[];
}

@State<VideoStateModel>({
  name: 'video',
  defaults: {
    videos: [],
  },
})
@Injectable()
export class VideoState {
  constructor(private videoStorageService: VideoStorageService) {}

  @Selector()
  static getVideos(state: VideoStateModel) {
    return state.videos;
  }

  @Action(AddVideo)
  async addVideo(ctx: StateContext<VideoStateModel>, action: AddVideo) {
    const state = ctx.getState();
    const videoId = await this.videoStorageService.saveVideo(
      action.videoBlob,
      action.recordedAt,
      action.duration
    );
    const videoUrl = URL.createObjectURL(action.videoBlob);
    ctx.patchState({
      videos: [
        ...state.videos,
        {
          id: videoId,
          videoUrl,
          recordedAt: action.recordedAt,
          duration: action.duration,
        },
      ],
    });
    console.log(ctx.getState().videos);
  }

  @Action(DeleteVideo)
  async deleteVideo(ctx: StateContext<VideoStateModel>, action: DeleteVideo) {
    const state = ctx.getState();
    const updatedVideos = state.videos.filter(
      (video) => video.id !== action.videoId
    );
    ctx.patchState({ videos: updatedVideos });
    await this.videoStorageService.deleteVideo(action.videoId);
  }

  @Action(LoadSavedVideos)
  async loadSavedVideos(ctx: StateContext<VideoStateModel>) {
    const savedVideos: StoredVideoEntry[] =
      await this.videoStorageService.getVideos();
    const videoUrls = savedVideos
      .filter((video) => video.videoData)
      .map((video) => ({
        id: video.id,
        videoUrl: URL.createObjectURL(video.videoData),
        recordedAt: video.recordedAt,
        duration: video.duration,
      }));
    ctx.patchState({ videos: videoUrls });
  }
}
