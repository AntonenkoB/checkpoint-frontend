import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {IonButton, IonInput} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RatesFacade} from "@rates/rates.facade";
import {addIcons} from "ionicons";
import {FORM_PASSWORD_ICONS, FORM_SELECT_ICONS} from "@models/form.models";

@Component({
  selector: "cp-rete-item",
  templateUrl: "./rete-item.component.html",
  styleUrls: ["./rete-item.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    UserItemComponent,
    IonInput,
    IonButton,
    TranslatePipe
  ],
  providers: [RatesFacade]
})
export class ReteItemComponent implements OnInit {
  public ratesFacade = inject(RatesFacade);
  constructor() {
    addIcons({...FORM_PASSWORD_ICONS, ...FORM_SELECT_ICONS});
  }

  ngOnInit() {}

  public onInput(event: any) {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9.,]/g, '');

    event.target.value = filteredValue;
  }
}
