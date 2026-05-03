import {Component, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {MarketFacade} from "../../market.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {DomSanitizer} from "@angular/platform-browser";
import {MINUS_SVG, PLUS_SVG} from "@models/svg.models";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

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

  public amount = signal(1)
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);
  public MINUS_SVG = this.sanitizer.bypassSecurityTrustHtml(MINUS_SVG);

  ngOnInit() {}

  public increment(): void {
    if (this.amount() > 1) {
      this.amount.set(this.amount() - 1)
    }
  }

  public decrement(): void {
    if (this.amount() < 5) {
      this.amount.set(this.amount() + 1)
    }
  }
}
