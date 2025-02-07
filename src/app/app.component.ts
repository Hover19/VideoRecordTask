import { Component } from '@angular/core';
import { BandwidthService } from './core/services/bandwidth.service';

import { Store } from '@ngxs/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isLoading: boolean = true;

  constructor(private bandwidthService: BandwidthService) {}

  async ngOnInit() {
    const bandwidth = await this.bandwidthService.checkBandwidth();
    console.log('Detected bandwidth:', bandwidth, 'Mbps');
  }

  public onCameraLoaded(status: boolean): void {
    this.isLoading = !status;
  }
}
