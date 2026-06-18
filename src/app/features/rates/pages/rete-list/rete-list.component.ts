import {Component, DestroyRef, effect, inject, OnInit} from "@angular/core";
import {RatesFacade} from "@rates/facade/rates.facade";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {ERatesType} from "@rates/models/rates.model";
import {ViewWillEnter} from "@ionic/angular";
import {filter, skip} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: "cp-rete-list",
  templateUrl: "./rete-list.component.html",
  styleUrls: ["./rete-list.component.scss"],
  imports: [
    LoaderComponent,
    TranslatePipe,
    UserItemReadComponent
  ],
  providers: [RatesFacade]
})
export class ReteListComponent implements OnInit, ViewWillEnter {
  public ratesFacade = inject(RatesFacade);
  private router  = inject(Router);
  private destroy = inject(DestroyRef);
  public eRatesType = ERatesType;

  constructor() {
  }

  ngOnInit() {
    this.ratesFacade.getAllRates();

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   skip(1),
    //   takeUntilDestroyed(this.destroy)
    // ).subscribe(() => {
    //   this.ratesFacade.getAllRates();
    // });
  }

  public ionViewWillEnter() {
    // this.ratesFacade.getAllRates();
  }
}
