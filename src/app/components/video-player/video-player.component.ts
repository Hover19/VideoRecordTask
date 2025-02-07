import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: HTMLVideoElement;
  @Input() videoUrl!: string;
  @Output() close = new EventEmitter<void>();

  private metadataSubscription!: Subscription;

  public api!: VgApiService;

  ngAfterViewInit() {
    if (this.api) {
      this.metadataSubscription = this.api
        .getDefaultMedia()
        .subscriptions.loadedMetadata.subscribe(() => {
          this.api.play();
        });
    }
  }

  public onPlayerReady(api: VgApiService): void {
    this.api = api;
  }

  public closeModal(): void {
    if (this.api) {
      this.api.pause();
      this.api.getDefaultMedia().currentTime = 0;
      this.close.emit();
    }
  }

  ngOnDestroy() {
    if (this.api) {
      this.api.pause();
      this.api = null as any;
    }

    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
  }
}
