import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  public async checkBandwidth(): Promise<number> {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.downlink) {
        return Promise.resolve(connection.downlink);
      }
    }
    return Promise.resolve(3);
  }
}
