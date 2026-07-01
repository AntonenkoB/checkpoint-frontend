import {Component, inject, OnInit} from "@angular/core";
import {MonthsListComponent} from "@shared/components/months-list/months-list.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {SalaryStore} from "@rates/store/salary.store";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {RatesFacade} from "@rates/facade/rates.facade";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonContent} from "@ionic/angular/standalone";

@Component({
  selector: "cp-salary-list",
  templateUrl: "./salary-list.component.html",
  styleUrls: ["./salary-list.component.scss"],
  imports: [
    MonthsListComponent,
    TranslatePipe,
    EmptyStateComponent,
    UserItemReadComponent,
    LoaderComponent,
    HeaderSecondaryComponent,
    IonContent
  ],
  providers: [RatesFacade]
})
export class SalaryListComponent implements OnInit {
  public salaryStore = inject(SalaryStore);
  public ratesFacade = inject(RatesFacade);

  constructor() {
  }

  ngOnInit() {
    this.salaryStore.getAllSalary();
  }

  public changeMonth(month: string): void {
    this.ratesFacade.changeAllSalaryMonth(month);
  }
}
