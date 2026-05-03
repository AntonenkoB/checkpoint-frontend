import {Component, computed, input, output} from "@angular/core";
import {TabsComponent} from "@shared/components/tabs/tabs.component";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {ADMIN_TABS, EHeaderMenu, EUserRole, IUser, TEACHER_TABS} from "../../../features/users/models/user.model";

@Component({
  selector: "cp-header-mobile",
  templateUrl: "./header-mobile.component.html",
  styleUrls: ["./header-mobile.component.scss"],
  imports: [
    TabsComponent,
    AvatarComponent
  ]
})
export class HeaderMobileComponent {
  public profile = input<IUser | null>();
  public activeMenu = input<EHeaderMenu>();
  public selectMenu = output<EHeaderMenu>();
  public goToProfile = output();
  public USER_ROLE_TABS = computed(() => {
    switch (this.profile()?.role) {
      case EUserRole.Admin:
        return ADMIN_TABS();
      default:
        return TEACHER_TABS();
    }
  });

  public menuChange(tab: string): void {
    this.selectMenu.emit(tab as EHeaderMenu)
  }
}
