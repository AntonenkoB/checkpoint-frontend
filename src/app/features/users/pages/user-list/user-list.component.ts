import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {UserListFacade} from "../../facade/user-list.facade";
import {
  IonButton,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem
} from "@ionic/angular/standalone";
import {
  EHeaderMenu,
  ERateTabs,
  SETTING_RATES_TABS,
  USER_CREATE_BTN,
} from "../../models/user.model";
import {EUserRole} from "@models/user.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {InfiniteScrollCustomEvent, NavController} from "@ionic/angular";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {HeaderMobileComponent} from "@shared/components/header-mobile/header-mobile.component";
import {ScheduleListComponent} from "@schedule/pages/schedule-list/schedule-list.component";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {ReteListComponent} from "@rates/pages/rete-list/rete-list.component";
import {SalaryListComponent} from "@rates/pages/salary-list/salary-list.component";

@Component({
  selector: 'cp-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [UserListFacade],
  imports: [
    IonButton,
    TranslatePipe,
    LoaderComponent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    UserItemComponent,
    HeaderMobileComponent,
    ScheduleListComponent,
    EmptyStateComponent,
    TabsComponent,
    ReteListComponent,
    SalaryListComponent,
    IonInput,
    IonItem,
  ]
})
export class UserListComponent implements OnInit {
  public readonly userListFacade = inject(UserListFacade);
  public USER_ACTIONS_BTN = USER_CREATE_BTN();
  public SETTING_RATES_TABS = SETTING_RATES_TABS();
  public profile = computed(() => this.userListFacade.profile());
  public isReady = computed(() => this.userListFacade.userListLoading());
  public activeMenu = computed(() => this.userListFacade.currentTab());
  public activeRatesMenu = computed(() => this.userListFacade.currentRacesTab());
  public amountStudents = computed(() => this.userListFacade.amountStudents()?.total.toString());
  public eHeaderMenu = EHeaderMenu;
  public eRateTabs = ERateTabs;
  public eUserRole = EUserRole;
  public searchUser = signal('');
  private currentPage = signal(1);

  constructor() {
  }

  public ionViewWillEnter(): void {
    const snapshot = this.userListFacade.route.snapshot.queryParams;
    const tab = (snapshot['tab'] || snapshot['role']) as EHeaderMenu ?? EHeaderMenu.Schedule;
    this.menuChange(tab);
  }

  public ngOnInit(): void {
  }

  public menuChange(tab: EHeaderMenu): void {
    this.userListFacade.selectMenu(tab);
  }

  public ratesChange(data: string): void {
    const rateTab = data as ERateTabs;
    this.userListFacade.selectRatesMenu(rateTab);
  }

  public onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this.currentPage() < this.userListFacade.userListPagination().lastPage) {
      this.currentPage.update(p => p + 1);
      this.userListFacade.selectMenu(this.userListFacade.currentTab(), this.currentPage());
    } else {
      void event.target.complete();
    }

    if (this.isReady()) {
     void event.target.complete();
    }
  }
}
