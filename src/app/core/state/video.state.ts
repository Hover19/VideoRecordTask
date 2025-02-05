import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

// Actions
export class AddVideo {
  static readonly type = '[Video] Add Video';
  constructor(public videoUrl: string) {}
}

export class DeleteVideo {
  static readonly type = '[Video] Delete Video';
  constructor(public videoUrl: string) {}
}

interface VideoStateModel {
  videos: string[];
}

@State<VideoStateModel>({
  name: 'video',
  defaults: {
    videos: [],
  },
})
@Injectable()
export class VideoState {
  @Selector()
  static getVideos(state: VideoStateModel) {
    return state.videos;
  }

  @Action(AddVideo)
  addVideo(ctx: StateContext<VideoStateModel>, action: AddVideo) {
    const state = ctx.getState();
    ctx.patchState({ videos: [...state.videos, action.videoUrl] });
    console.log(ctx.getState().videos);
  }

  @Action(DeleteVideo)
  deleteVideo(ctx: StateContext<VideoStateModel>, action: DeleteVideo) {
    const state = ctx.getState();
    ctx.patchState({
      videos: state.videos.filter((video) => video !== action.videoUrl),
    });
  }
}
