import {computed, inject, Injectable, signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages, TRouter} from "@models/router.model";
import {EMarketPages} from "@market/models/market.model";
import {StudentFacade} from "@student/facade/student.facade";
import {ESettingsPages, SETTINGS_LIST_MAP} from "../models/settings.model";
import {NavController} from "@ionic/angular";
import {ProfileStore} from "@profile/store/profile.store";
import {EUserRole, IUser, USER_ROLE_OPTIONS} from "@models/user.model";
import {EStudentPages} from "@student/models/student.model";
import {EHeaderMenu, EUserPages} from "@users/models/user.model";
import {ETheme} from "@models/common.model";
import {ThemeService} from "@shared/services/theme.service";
import {ELessonFlow, ELessonPages} from "@lessons/models/lessons.model";
import {ImpactStyle} from "@capacitor/haptics";
import {HapticService} from "@shared/services/haptic.service";
import {AuthStore} from "@auth/store/auth.store";
import {PushNotificationService} from "@notifacations/services/push-notification.service";

@Injectable()
export class SettingsFacade {
  private store = inject<Store<AppState>>(Store);
  private profileFacade = inject(ProfileFacade);
  private profileStore = inject(ProfileStore);
  private authStore = inject(AuthStore);
  private studentFacade = inject(StudentFacade);
  private themeService = inject(ThemeService);
  private pushNotificationService = inject(PushNotificationService);
  private hapticService = inject(HapticService);
  private navController = inject(NavController);

  public readonly profile = this.profileFacade.profile;
  public readonly isStudent = this.profileFacade.isStudent;

  public readonly amountTeacherLessons = this.studentFacade.amountTeacherLessons;
  public readonly amountIndividualLessons = this.studentFacade.amountIndividualLessons;

  public readonly settingsList = computed(() => {
    return SETTINGS_LIST_MAP[this.profileFacade.activeRole()!] ?? []
  })
  public availableRole = computed(() => {
    return USER_ROLE_OPTIONS.filter(role => this.profileFacade.profile()?.roles!.includes(role.value))
  });
  public activeRole = computed(() => USER_ROLE_OPTIONS.find(role => role.value === this.profileFacade.activeRole()));


  constructor() {
  }

  public goToSelectPaymentType(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Lessons, ELessonPages.LessonType],
      extras: {queryParams: {lessonsFlow: ELessonFlow.Purchase}}
    }));
  }

  public async switchRole(event: CustomEvent): Promise<void> {
    const role = event.detail.value as EUserRole;

    if (role === this.activeRole()?.value) return;
    await this.profileStore.setActiveRole(role);
    void this.hapticService.impact(ImpactStyle.Medium);
    void this.navController.navigateRoot([EAppPages.Settings, ESettingsPages.General], { animated: false });
    void this.pushNotificationService.init();
  }

  public changeTheme(theme: ETheme): void {
    const currentProfile = this.profileFacade.profile();
    if (!currentProfile) return;

    const user = signal<IUser>(currentProfile);
    user.update((u) => ({
      ...u,
      theme
    }));

    this.themeService.apply(theme);
    this.profileFacade.update(user());
  }

  public setReminder(hours: number): void {
    const currentProfile = this.profileFacade.profile();
    if (!currentProfile) return;

    const user = signal<IUser>(currentProfile);
    user.update((profile) => ({
      ...profile,
      reminder_hours_before: hours
    }));

    this.profileFacade.update(user());
  }

  public goToPurchase(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.PaymentType]}))
  }

  public goToNotifications(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Notifications]}))
  }

  public goToProfile(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Profile]}))
  }

  public goToSettingsList(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.List]}))
  }

  public goToSettingsGeneral(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.General]}))
  }

  public goToSettingsTerms(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.Terms]}))
  }

  public goToSettingsPrivacy(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.Privacy]}))
  }

  public goToLink(link: TRouter[], queryParams?: Record<string, string>): void {
    this.store.dispatch(RouterActions.goTo({path: link, extras: {queryParams}}))
  }

  public close(): void {
    switch (this.profileStore.activeRole()) {
      case EUserRole.Student:
        this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student, EStudentPages.StudentDashboard], back: true}));
        break;
      case EUserRole.Teacher:
      case EUserRole.Admin:
      case EUserRole.Owner:
        this.store.dispatch(RouterActions.goTo({
          path: [EAppPages.Users, EUserPages.ListUsers],
          extras: {queryParams: {tab: EHeaderMenu.Schedule}},
          back: true
        }));
        break;
    }
  }

  public logout(): void {
    this.authStore.logout();
  }

  public deleteAccount(): void {
    this.profileStore.deleteAccount()
  }
}