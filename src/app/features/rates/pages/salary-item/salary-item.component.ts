import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RatesFacade} from "@rates/facade/rates.facade";
import {IonContent} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {MonthsListComponent} from "@shared/components/months-list/months-list.component";
import {SalaryStore} from "@rates/store/salary.store";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {DatePipe, JsonPipe} from "@angular/common";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {PriceFormatPipe} from "@shared/pipes/price-format-pipe";
import {LoaderComponent} from "@shared/components/loader/loader.component";


@Component({
  selector: "cp-salary-item",
  templateUrl: "./salary-item.component.html",
  styleUrls: ["./salary-item.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonContent,
    TranslatePipe,
    MonthsListComponent,
    UserItemReadComponent,
    EmptyStateComponent,
    PriceFormatPipe,
    LoaderComponent
  ],
  providers: [RatesFacade]
})
export class SalaryItemComponent implements OnInit {
  public salaryStore = inject(SalaryStore);
  public ratesFacade = inject(RatesFacade);
  private datePipe = inject(DatePipe);


  ngOnInit() {
    this.salaryStore.getTeacherSalary()
  }

  public formatDate(isoString: string): string {
    if (!isoString) return '';
    return this.datePipe?.transform(isoString, 'd MMMM, HH:mm', '', 'uk-UA') || '';
  }
}
