import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {RatesFacade} from "@rates/rates.facade";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {MONTH_LIST} from "../../../users/models/user.model";
import {IonContent} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";


@Component({
  selector: "cp-salary-item",
  templateUrl: "./salary-item.component.html",
  styleUrls: ["./salary-item.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    UserItemComponent,
    TabsComponent,
    IonContent,
    TranslatePipe
  ],
  providers: [RatesFacade]
})
export class SalaryItemComponent implements OnInit {
  public ratesFacade = inject(RatesFacade);
  public MONTH_LIST = MONTH_LIST();

  ngOnInit() {}
}
