import {Component, computed, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {MarketFacade} from "../../facade/market.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {EMarketPlanType} from "../../models/market.model";

@Component({
  selector: "cp-lessons-type-payment",
  templateUrl: "./lessons-type-payment.component.html",
  styleUrls: ["./lessons-type-payment.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    TranslatePipe
  ],
  providers: [MarketFacade]
})
export class LessonsTypePaymentComponent implements OnInit {
  public marketFacade = inject(MarketFacade);
  public eMarketPlanType = EMarketPlanType;

  constructor() {
  }

  ngOnInit() {
    this.marketFacade.loadTeacherRate();
  }
}
