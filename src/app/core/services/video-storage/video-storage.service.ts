import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

interface VideoEntry {
  id: number;
  videoData: Blob;
  recordedAt: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class VideoStorageService {
  private dbName = 'VideoDB';
  private storeName = 'videos';
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('videos')) {
          const store = db.createObjectStore('videos', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('recordedAt', 'recordedAt', { unique: false });
        }
      },
    });
  }

  async saveVideo(
    videoData: Blob,
    recordedAt: string,
    duration: number
  ): Promise<number> {
    const db = await this.dbPromise;
    const id = await db.add(this.storeName, {
      videoData,
      recordedAt,
      duration,
    });
    return id as number;
  }

  async getVideos(): Promise<VideoEntry[]> {
    const db = await this.dbPromise;
    return db.getAll(this.storeName);
  }

  async deleteVideo(videoId: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.storeName, videoId);
  }
}
