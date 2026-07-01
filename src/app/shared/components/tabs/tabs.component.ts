import {Component, input, model, output} from '@angular/core';
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {IOptions} from "@models/common.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {EHeaderMenu} from "@users/models/user.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'cp-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel,
    TranslatePipe,
    NgClass
  ]
})
export class TabsComponent {
  public tabList = input<IOptions[]>();
  public activeTab = input<string | number>();
  public disabledTabs = input<(string | number)[]>();
  public amountStudents = model<string>();
  public bntStyle = input<'btn-clear' | 'btn-with-border' | 'btn-fill'>('btn-clear');
  public segmentChange = output<string>();

  public readonly eHeaderMenu = EHeaderMenu;

  public onSegmentChange(event: CustomEvent): void {
    this.segmentChange.emit(event.detail.value);
  }
}
