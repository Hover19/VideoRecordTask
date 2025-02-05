import { Component, OnInit } from '@angular/core';
import { BandwidthService } from './core/services/bandwidth-service/bandwidth.service';
import { RecorderComponent } from './components/recorder/recorder.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private bandwidthService: BandwidthService) {}

  async ngOnInit() {
    const bandwidth = await this.bandwidthService.checkBandwidth();
    console.log('Detected bandwidth:', bandwidth, 'Mbps');
  }
}
