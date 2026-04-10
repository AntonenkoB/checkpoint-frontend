import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() public tabList: IOptions[] = [];
  @Input() public activeTab: string = '';
  @Output() public segmentChange: EventEmitter<string> = new EventEmitter<string>();

  public onSegmentChange(event: CustomEvent): void {
    this.segmentChange.emit(event.detail.value);
  }
}
