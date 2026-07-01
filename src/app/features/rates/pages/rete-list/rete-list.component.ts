import {Component, inject, OnInit} from "@angular/core";
import {RatesFacade} from "@rates/facade/rates.facade";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {ERatesType} from "@rates/models/rates.model";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonContent, IonHeader} from "@ionic/angular/standalone";

@Component({
  selector: "cp-rete-list",
  templateUrl: "./rete-list.component.html",
  styleUrls: ["./rete-list.component.scss"],
  imports: [
    LoaderComponent,
    TranslatePipe,
    UserItemReadComponent,
    HeaderSecondaryComponent,
    IonContent,
  ],
  providers: [RatesFacade]
})
export class ReteListComponent implements OnInit {
  public ratesFacade = inject(RatesFacade);
  public eRatesType = ERatesType;

  constructor() {
  }

  ngOnInit() {
    this.ratesFacade.getAllRates();
  }
}
