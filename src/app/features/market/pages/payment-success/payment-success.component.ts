import {Component, computed, DestroyRef, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonButton} from "@ionic/angular/standalone";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {MarketFacade} from "../../facade/market.facade";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {MarketStore} from "@market/store/market.store";
import {EMarketPlanType, EPaymentStatus} from "@market/models/market.model";
import {ELessonFlow} from "@lessons/models/lessons.model";
import {TranslatePluralPipe} from "@shared/pipes/translate-plural.pipe";
import {takeWhile, timer} from "rxjs";
import {take} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: "cp-payment-success",
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonButton,
    RecordStudentItemComponent,
    TranslatePipe,
    TranslatePluralPipe
  ],
  providers: [MarketFacade]
})
export class PaymentSuccessComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public marketFacade = inject(MarketFacade);
  public marketStore = inject(MarketStore);
  public eMarketPlanType = EMarketPlanType;
  public eLessonFlow = ELessonFlow;
  public ePurchaseStatus = EPaymentStatus;

  public successData = computed(() => this.marketStore.paymentSuccessData());
  public successInvoiceData = computed(() => this.marketStore.paymentInvoice());

  ngOnInit() {
    this.marketFacade.getPayment();

    if (this.marketFacade.paymentId()) {
      timer(1000, 3000).pipe(
        take(100),
        takeWhile(() => !this.isPaymentFinished()),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => this.marketFacade.getPayment());
    }
  }

  private isPaymentFinished(): boolean {
    const invoice = this.successInvoiceData();

    return invoice?.id === +this.marketFacade.paymentId()!
      && invoice.status !== EPaymentStatus.Pending;
  }
}
