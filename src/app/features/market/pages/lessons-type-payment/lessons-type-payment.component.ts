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

  public readonly abonnementParams = computed(() => {
    const rates = this.marketFacade.marketStore.teacherRate();
    const rate = rates[1];

    if (!rate) {
      return null
    }

    return {
      total: +rate.price,
      perLesson: Math.round(rate.price / rate.lessons_per_unit),
      count: +rate.lessons_per_unit
    };
  });

  constructor() {
  }

  ngOnInit() {
    this.marketFacade.loadTeacherRate();
  }
}
