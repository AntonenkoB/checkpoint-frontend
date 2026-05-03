import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {UserListFacade} from "./user-list.facade";
import {IonButton, IonContent, IonInfiniteScroll, IonInfiniteScrollContent} from "@ionic/angular/standalone";
import {EHeaderMenu, ERateTabs, SETTING_RATES_TABS, USER_CREATE_BTN, MONTH_LIST} from "../../models/user.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {HeaderMobileComponent} from "@shared/components/header-mobile/header-mobile.component";
import {ScheduleListComponent} from "@schedule/pages/schedule-list/schedule-list.component";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {TabsComponent} from "@shared/components/tabs/tabs.component";

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
  ]
})
export class UserListComponent implements OnInit {
  public readonly userListFacade = inject(UserListFacade);
  public USER_ACTIONS_BTN = USER_CREATE_BTN();
  public SETTING_RATES_TABS = SETTING_RATES_TABS();
  public MONTH_LIST = MONTH_LIST();
  public userList = computed(() => this.userListFacade.userList());
  public profile = computed(() => this.userListFacade.profile());
  public isReady = computed(() => this.userListFacade.userListLoading());
  public activeMenu = computed(() => this.userListFacade.currentTab());
  public activeRatesMenu = computed(() => this.userListFacade.currentRacesTab());
  public eHeaderMenu = EHeaderMenu;
  public eRateTabs = ERateTabs;
  private currentPage = signal(1);

  public ngOnInit(): void {
    this.menuChange(this.activeMenu());
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
      this.userListFacade.selectMenu(this.activeMenu(), this.currentPage());
    } else {
      void event.target.complete();
    }

    if (this.isReady()) {
     void event.target.complete();
    }
  }
}
