import {Component, computed, effect, inject, OnInit, signal, viewChild} from '@angular/core';
import {UserListFacade} from "../../facade/user-list.facade";
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem
} from "@ionic/angular/standalone";
import {
  EHeaderMenu,
  USER_CREATE_BTN,
} from "../../models/user.model";
import {EUserRole} from "@models/user.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {HeaderMobileComponent} from "@shared/components/header-mobile/header-mobile.component";
import {ScheduleListComponent} from "@schedule/pages/schedule-list/schedule-list.component";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {ScheduleFacade} from "@schedule/facade/schedule.facade";
import {ButtonsComponent} from "@shared/components/buttons/buttons.component";

@Component({
  selector: 'cp-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [UserListFacade],
  imports: [
    TranslatePipe,
    IonContent,
    UserItemComponent,
    HeaderMobileComponent,
    ScheduleListComponent,
    EmptyStateComponent,
    IonInput,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    LoaderComponent,
    ButtonsComponent,
  ]
})
export class UserListComponent implements OnInit {
  private readonly searchStudentInput = viewChild.required<IonInput>('searchStudentInput');
  private readonly scheduleList = viewChild(ScheduleListComponent);

  public readonly userListFacade = inject(UserListFacade);
  public readonly scheduleFacade = inject(ScheduleFacade);
  public USER_ACTIONS_BTN = USER_CREATE_BTN();
  public profile = computed(() => this.userListFacade.profile());
  public isReady = computed(() => this.userListFacade.userListLoading());
  public activeMenu = computed(() => this.userListFacade.currentTab());
  public amountStudents = computed(() => this.userListFacade.amountStudents()?.total.toString());
  public eHeaderMenu = EHeaderMenu;
  public eUserRole = EUserRole;
  public searchUser = signal('');
  private pendingInfinite: InfiniteScrollCustomEvent | null = null;

  constructor() {
    effect(() => {
      if (!this.userListFacade.isLoadingMore() && this.pendingInfinite) {
        void this.pendingInfinite.target.complete();
        this.pendingInfinite = null;
      }
    });
  }

  public ionViewWillEnter(): void {
    const snapshot = this.userListFacade.route.snapshot.queryParams;
    const tab = (snapshot['tab'] || snapshot['role']) as EHeaderMenu ?? EHeaderMenu.Schedule;

    if (tab === EHeaderMenu.Schedule) {
      this.scheduleFacade.getScheduleSlots();
      this.scheduleFacade.loadNotificationsCount();
    }

    this.menuChange(tab);
    this.scheduleList()?.startRefresh();
  }

  public ionViewWillLeave(): void {
    this.scheduleList()?.stopRefresh();
  }

  public ngOnInit(): void {
  }

  public menuChange(tab: EHeaderMenu): void {
    this.userListFacade.selectMenu(tab);
  }

  public async onIonInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    this.userListFacade.loadMoreUsers();

    if (this.userListFacade.isLoadingMore()) {
      this.pendingInfinite = event;
    } else {
      void event.target.complete();
    }
  }

  public onScrollStart(): void {
    if (this.activeMenu() === EHeaderMenu.Student) {
      void this.blurSearchInput();
    }
  }

  private async blurSearchInput(): Promise<void> {
    const inputElement = await this.searchStudentInput().getInputElement();
    inputElement.blur();
  }
}
