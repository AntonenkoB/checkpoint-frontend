import {Component, computed, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonButton} from "@ionic/angular/standalone";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {MarketFacade} from "../../facade/market.facade";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {MarketStore} from "@market/store/market.store";
import {EMarketPlanType} from "@market/models/market.model";

@Component({
  selector: "cp-payment-success",
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonButton,
    RecordStudentItemComponent,
    TranslatePipe
  ],
  providers: [MarketFacade]
})
export class PaymentSuccessComponent implements OnInit {
  public marketFacade = inject(MarketFacade);
  public marketStore = inject(MarketStore);
  public mMarketPlanType = EMarketPlanType

  public successData = computed(() => this.marketStore.paymentSuccessData());

  ngOnInit() {
  }
}
