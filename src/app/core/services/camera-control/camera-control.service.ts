import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraControlService {
  private stream: MediaStream | null = null;

  public setCameraStream(stream: MediaStream): void {
    this.stream = stream;
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
