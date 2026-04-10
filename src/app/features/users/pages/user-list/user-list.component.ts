import {Component, computed, effect, inject, signal} from '@angular/core';
import {UserListFacade} from "./user-list.facade";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {
  IonButton,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from "@ionic/angular/standalone";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {EUserRole, IUser, USER_CREATE_BTN, USER_ROLE_TABS} from "../../models/user.model";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";

@Component({
  selector: 'cp-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [UserListFacade],
  imports: [
    EmptyStateComponent,
    IonButton,
    TabsComponent,
    AvatarComponent,
    TranslatePipe,
    LoaderComponent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    UserItemComponent,
  ]
})
export class UserListComponent {
  public readonly userListFacade = inject(UserListFacade);
  public USER_ROLE_TABS = USER_ROLE_TABS();
  public USER_ACTIONS_BTN = USER_CREATE_BTN();
  public activeTab = signal(EUserRole.Student)
  public profile = signal(this.userListFacade.profile())
  public isReady = computed(() => this.userListFacade.userListLoading());
  private currentPage = signal(1);

  constructor() {
    effect(() => {
      this.profile.set(this.userListFacade.profile())
    });
  }

  public tabChange(tab: string) {
    this.activeTab.set(tab as EUserRole);
    this.userListFacade.getUserList(this.activeTab())
  }

  public onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this.currentPage() < this.userListFacade.userListPagination().lastPage) {
      this.currentPage.update(p => p + 1)
      this.userListFacade.getUserList(this.activeTab(), this.currentPage())
    } else {
      void event.target.complete();
    }

    if (this.isReady()) {
     void event.target.complete();
    }
  }
}
