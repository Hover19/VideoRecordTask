import { Component, OnInit } from '@angular/core';
import { BandwidthService } from 'src/app/core/services/bandwidth-service/bandwidth.service';
import { AddVideo } from 'src/app/core/state/video.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent implements OnInit {
  private mediaRecorder!: MediaRecorder;
  private stream!: MediaStream;
  private chunks: Blob[] = [];
  private recordingInterval: any;
  private startTime!: number;

  public quality: 'low' | 'medium' | 'high' = 'medium';
  public recording: boolean = false;
  public isSettingsOpened = false;
  public recordingTime: number = 0;

  constructor(
    private bandwidthService: BandwidthService,
    private store: Store
  ) {}

  async ngOnInit() {
    await this.setVideoQuality();
    await this.startCamera();
  }

  async setVideoQuality() {
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
    console.log(this.quality);
  }

  private getVideoConstraints(): { width: number; height: number } {
    return this.quality === 'low'
      ? { width: 640, height: 360 }
      : this.quality === 'high'
      ? { width: 1920, height: 1080 }
      : { width: 1280, height: 720 };
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.getVideoConstraints(),
      });
      console.log(this.stream);
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert(
        'Error: No camera detected or permission denied. Please check your device settings.'
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
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (event) =>
      this.chunks.push(event.data);
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      const recordedAt = new Date().toISOString();
      const duration = (Date.now() - this.startTime) / 1000;
      this.store.dispatch(new AddVideo(blob, recordedAt, duration));
      console.log(blob, recordedAt, duration);
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
  }

  public toggleSettings(): void {
    this.isSettingsOpened = !this.isSettingsOpened;
  }

  public changeQuality(newQuality: 'low' | 'medium' | 'high') {
    this.quality = newQuality;
    this.startCamera(); // Restart camera with new quality
    this.isSettingsOpened = false;
  }
}
