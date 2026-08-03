import {Component, inject, OnInit} from "@angular/core";
import {StudentFacade} from "@student/facade/student.facade";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent} from "@ionic/angular/standalone";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {PriceFormatPipe} from "@shared/pipes/price-format-pipe";
import {DatePipe} from "@angular/common";
import { ERatesType } from "@rates/models/rates.model";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";

@Component({
  selector: "cp-history-purchases",
  templateUrl: "./history-purchases.component.html",
  styleUrls: ["./history-purchases.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PriceFormatPipe,
    DatePipe,
    EmptyStateComponent
  ],
  providers: [StudentFacade]
})
export class HistoryPurchasesComponent implements OnInit {
  public studentFacade = inject(StudentFacade);

  public eRatesType = ERatesType;

  constructor() {}

  ngOnInit() {
    this.studentFacade.loadPurchases();
  }

  public async onInfiniteLoadPurchases(event: InfiniteScrollCustomEvent): Promise<void> {
    this.studentFacade.loadMorePurchases();
    await event.target.complete();
  }
}
