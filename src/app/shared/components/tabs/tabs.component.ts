import {Component, input, output} from '@angular/core';
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {IOptions} from "@models/common.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: 'cp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel,
    TranslatePipe
  ]
})
export class TabsComponent {
  public tabList = input<IOptions[]>();
  public activeTab = input<string>();
  public bntStyle = input<'btn-clear' | 'btn-with-border' | 'btn-fill'>('btn-clear');
  public segmentChange = output<string>();

  public onSegmentChange(event: CustomEvent): void {
    this.segmentChange.emit(event.detail.value);
  }
}
