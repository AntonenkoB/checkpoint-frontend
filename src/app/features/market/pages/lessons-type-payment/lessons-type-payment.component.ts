import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {MarketFacade} from "../../market.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

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

  ngOnInit() {
  }
}
