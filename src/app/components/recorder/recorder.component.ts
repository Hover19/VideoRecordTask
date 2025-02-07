import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { BandwidthService } from 'src/app/core/services/bandwidth.service';
import { AddVideo } from 'src/app/core/state/video.state';
import { Store } from '@ngxs/store';
import { CameraControlService } from 'src/app/core/services/camera-control.service';

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
  public recording = false;
  public isSettingsOpened = false;
  public recordingTime = 0;
  public isLoading = true;

  public readonly qualityLabels = {
    low: '360p (Low Quality)',
    medium: '720p (Medium Quality)',
    high: '1080p (High Quality)',
  };

  constructor(
    private bandwidthService: BandwidthService,
    private store: Store,
    private cameraService: CameraControlService
  ) {}

  ngOnInit() {
    this.setVideoQuality();
    this.startCamera();
  }

  private async setVideoQuality(): Promise<void> {
    const bandwidth = await this.bandwidthService.checkBandwidth();
    const cameraCapabilities = await this.getCameraCapabilities();

    let maxSupportedWidth = cameraCapabilities?.width?.max || 1280;
    let maxSupportedHeight = cameraCapabilities?.height?.max || 720;

    if (bandwidth < 2) {
      this.quality = 'low';
    } else if (bandwidth > 5) {
      this.quality = 'high';
    } else {
      this.quality = 'medium';
    }

    const requiredResolution = {
      low: { width: 640, height: 360 },
      medium: { width: 1280, height: 720 },
      high: { width: 1920, height: 1080 },
    };

    const selectedResolution = requiredResolution[this.quality];

    if (
      maxSupportedWidth < selectedResolution.width ||
      maxSupportedHeight < selectedResolution.height
    ) {
      alert(
        `Your camera only supports up to ${maxSupportedWidth}x${maxSupportedHeight}. Setting quality to the best available.`
      );

      if (maxSupportedWidth >= 1280 && maxSupportedHeight >= 720) {
        this.quality = 'medium';
      } else {
        this.quality = 'low';
      }
    }

    console.log(
      `Bandwidth: ${bandwidth} Mbps | Camera Max Res: ${maxSupportedWidth}x${maxSupportedHeight} | Final Quality: ${this.quality}`
    );
  }

  private async getCameraCapabilities(): Promise<MediaTrackCapabilities | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      stream.getTracks().forEach((track) => track.stop()); // Stop stream after checking
      return capabilities;
    } catch (error) {
      console.error('Error getting camera capabilities:', error);
      return null;
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
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.getVideoConstraints(),
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      this.cameraService.setCameraStream(this.stream);
      const videoElement = this.videoElement.nativeElement;
      videoElement.srcObject = this.stream;
      videoElement.muted = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
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
    if (!this.validateStream()) return;

    this.initializeMediaRecorder();
    this.startTime = Date.now();
    this.recording = true;
    this.recordingTime = 0;

    this.startRecordingTimer();
  }

  private validateStream(): boolean {
    if (!this.stream) {
      alert(
        'Error: No active camera stream. Please check your camera settings.'
      );
      return false;
    }
    return true;
  }

  private initializeMediaRecorder(): void {
    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'video/webm',
    });

    this.videoElement.nativeElement.muted = true;
    this.mediaRecorder.ondataavailable = (event) =>
      this.chunks.push(event.data);
    this.mediaRecorder.onstop = () => this.handleRecordingStop();

    this.mediaRecorder.start();
  }

  private handleRecordingStop(): void {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    const recordedAt = new Date().toISOString();
    const duration = (Date.now() - this.startTime) / 1000;

    console.log('File Size:', blob.size / 1024, 'KB');
    this.store.dispatch(new AddVideo(blob, recordedAt, duration));
    this.videoElement.nativeElement.muted = false;
  }

  private startRecordingTimer(): void {
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

  public async changeQuality(
    newQuality: 'low' | 'medium' | 'high'
  ): Promise<void> {
    const cameraCapabilities = await this.getCameraCapabilities();

    let maxSupportedWidth = cameraCapabilities?.width?.max || 1280;
    let maxSupportedHeight = cameraCapabilities?.height?.max || 720;

    const requiredResolution = {
      low: { width: 640, height: 360 },
      medium: { width: 1280, height: 720 },
      high: { width: 1920, height: 1080 },
    };

    if (
      maxSupportedWidth < requiredResolution[newQuality].width ||
      maxSupportedHeight < requiredResolution[newQuality].height
    ) {
      this.isSettingsOpened = false;
      alert(
        `Your camera only supports up to ${maxSupportedWidth}x${maxSupportedHeight}.`
      );
      return;
    }

    this.quality = newQuality;
    await this.startCamera();
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
