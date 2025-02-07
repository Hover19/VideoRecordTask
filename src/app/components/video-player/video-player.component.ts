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

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: HTMLVideoElement;
  @Input() videoUrl!: string;
  @Output() close = new EventEmitter<void>();

  public api!: VgApiService;

  ngAfterViewInit() {
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
      this.api.play();
    });
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
  }

  closeModal() {
    if (this.api) {
      this.api.pause(); // Pause video
      this.api.getDefaultMedia().currentTime = 0;
      this.close.emit();
    }
  }

  ngOnDestroy() {
    if (this.api) {
      this.api.pause();
      this.api = null as any; // Clear API reference
    }
  }
}
