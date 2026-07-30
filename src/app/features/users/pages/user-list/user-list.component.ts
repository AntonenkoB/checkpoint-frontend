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
    UserItemComponent,
    HeaderMobileComponent,
    ScheduleListComponent,
    EmptyStateComponent,
    IonInput,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ]
})
export class UserListComponent implements OnInit {
  public readonly userListFacade = inject(UserListFacade);
  public USER_ACTIONS_BTN = USER_CREATE_BTN();
  public profile = computed(() => this.userListFacade.profile());
  public isReady = computed(() => this.userListFacade.userListLoading());
  public activeMenu = computed(() => this.userListFacade.currentTab());
  public amountStudents = computed(() => this.userListFacade.amountStudents()?.total.toString());
  public eHeaderMenu = EHeaderMenu;
  public eUserRole = EUserRole;
  public searchUser = signal('');

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

  public async onIonInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    this.userListFacade.loadMoreStudents();
    await event.target.complete();
  }
}
