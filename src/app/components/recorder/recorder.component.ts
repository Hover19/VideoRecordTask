import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { BandwidthService } from 'src/app/core/services/bandwidth-service/bandwidth.service';
import { AddVideo } from 'src/app/core/state/video.state';
import { Store } from '@ngxs/store';
import { CameraControlService } from 'src/app/core/services/camera-control/camera-control.service';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Output() loaded = new EventEmitter<boolean>();

  private mediaRecorder!: MediaRecorder;
  private stream!: MediaStream;
  private chunks: Blob[] = [];
  private recordingInterval: any;
  private startTime!: number;

  public quality: 'low' | 'medium' | 'high' = 'medium';
  public recording: boolean = false;
  public isSettingsOpened = false;
  public recordingTime: number = 0;
  public isLoading: boolean = true;

  constructor(
    private bandwidthService: BandwidthService,
    private store: Store,
    private cameraService: CameraControlService
  ) {}

  ngOnInit() {
    this.setVideoQuality();
    this.startCamera();
  }

  private async setVideoQuality() {
    const bandwidth = await this.bandwidthService.checkBandwidth();
    if (bandwidth < 2) {
      this.quality = 'low';
    } else if (bandwidth > 5) {
      this.quality = 'high';
    } else {
      this.quality = 'medium';
    }

    if (!bandwidth) {
      this.quality = 'medium';
      alert(
        `Can not detect bandwidth. Your video quality automatically set to ${this.quality}`
      );
    }
  }

  private getVideoConstraints(): MediaTrackConstraints {
    return {
      width:
        this.quality === 'low' ? 640 : this.quality === 'high' ? 1920 : 1280,
      height:
        this.quality === 'low' ? 360 : this.quality === 'high' ? 1080 : 720,
      frameRate: {
        ideal: this.quality === 'low' ? 15 : this.quality === 'high' ? 60 : 30,
      },
    };
  }

  private async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.getVideoConstraints(),
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      this.cameraService.setCameraStream(this.stream);
      const videoElement = this.videoElement.nativeElement;
      videoElement.srcObject = this.stream;
      videoElement.muted = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100vh';
      videoElement.style.objectFit = 'cover';
      this.isLoading = false;
      this.loaded.emit(true);
    } catch (error) {
      console.error('Error accessing webcam/microphone:', error);
      alert(
        'Error: No camera or microphone detected, or permission denied. Please check your device settings.'
      );
    }
  }

  public startRecording(): void {
    if (!this.stream) {
      alert(
        'Error: No active camera stream. Please check your camera settings.'
      );
      return;
    }
    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'video/webm', // Ensures audio + video is included
    });
    this.videoElement.nativeElement.muted = true;
    this.mediaRecorder.ondataavailable = (event) =>
      this.chunks.push(event.data);
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      const recordedAt = new Date().toISOString();
      const duration = (Date.now() - this.startTime) / 1000;
      this.store.dispatch(new AddVideo(blob, recordedAt, duration));
      this.videoElement.nativeElement.muted = false;
    };

    this.mediaRecorder.start();
    this.startTime = Date.now();
    this.recording = true;
    this.recordingTime = 0;

    this.recordingInterval = setInterval(() => {
      this.recordingTime = parseFloat((this.recordingTime + 0.1).toFixed(1));
      if (this.recordingTime >= 10) {
        this.stopRecording();
      }
    }, 100);
  }

  public stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.recording = false;
      clearInterval(this.recordingInterval);
    }

    setTimeout(() => {
      this.videoElement.nativeElement.muted = true;
    }, 1);
  }

  public toggleSettings(): void {
    this.isSettingsOpened = !this.isSettingsOpened;
  }

  public changeQuality(newQuality: 'low' | 'medium' | 'high'): void {
    this.quality = newQuality;
    this.startCamera();
    this.isSettingsOpened = false;
  }

  public muteCameraAudio(): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => (track.enabled = false));
    }
  }

  public unmuteCameraAudio(): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => (track.enabled = true));
    }
  }
}
