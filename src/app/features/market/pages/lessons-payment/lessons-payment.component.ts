import {Component, computed, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {MarketFacade} from "../../facade/market.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {DomSanitizer} from "@angular/platform-browser";
import {MINUS_SVG, PLUS_SVG} from "@models/svg.models";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {MarketStore} from "../../store/market.store";
import {
  EMarketPlanType,
  IMarketPurchaseLessons,
  SELECTED_LESSONS_TYPE,
} from "../../models/market.model";
import {ELessonsType} from "@lessons/models/lessons.model";

@Component({
  selector: "cp-lessons-payment",
  templateUrl: "./lessons-payment.component.html",
  styleUrls: ["./lessons-payment.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    IonButton,
    TranslatePipe
  ],
  providers: [MarketFacade]
})
export class LessonsPaymentComponent implements OnInit {
  public readonly sanitizer = inject(DomSanitizer);
  public marketFacade = inject(MarketFacade);
  public eLessonsType = ELessonsType
  public currentDescription = computed(() => SELECTED_LESSONS_TYPE()[this.marketFacade.currentTypePlan() as EMarketPlanType])

  public amount = signal(1)
  public totalPrice = computed(() => this.marketFacade.getTotalPrice(this.amount()));
  
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);
  public MINUS_SVG = this.sanitizer.bypassSecurityTrustHtml(MINUS_SVG);

  public paymentLessons = computed(() => ({
    plan_id: this.marketFacade.planId(),
    quantity: this.amount()
  }));

  ngOnInit() {
  }

  public increment(): void {
    if (this.amount() > 1) {
      this.amount.set(this.amount() - 1);
    }
  }

  public decrement(): void {
    if (this.amount() < 5) {
      this.amount.set(this.amount() + 1);
    }
  }

  public purchase(): void {
    const paymentLessons = this.paymentLessons() as IMarketPurchaseLessons
    this.marketFacade.purchaseLessons(paymentLessons);
  }
}
