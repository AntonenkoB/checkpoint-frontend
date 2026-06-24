import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList, IonModal,
  IonSegment,
  IonSegmentButton, ModalController
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {email, form, FormRoot, minLength, pattern, required} from "@angular/forms/signals";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileFacade} from "../../facade/profile.facade";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {ETheme} from "@models/common.model";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {AvatarUploadComponent} from "@shared/components/avatar-upload/avatar-upload.component";
import {DomSanitizer} from "@angular/platform-browser";
import {DELETE_SVG, PLUS_SVG} from "@models/svg.models";
import {PhoneMaskDirective} from "@shared/directives/phone-mask";
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {Platform} from "@ionic/angular";
import {STUDENT_PROFILE_TABS, THEME_ACTIONS} from "@profile/models/profile.model";
import {EUserRole, IUser, USER_ROLE_OPTIONS} from "@models/user.model";


@Component({
  selector: 'cp-profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    IonLabel,
    IonSegment,
    IonSegmentButton,
    TranslatePipe,
    IonImg,
    IonButton,
    FormRoot,
    FormsModule,
    IonInput,
    IonItem,
    IonList,
    ReactiveFormsModule,
    IonContent,
    LoaderComponent,
    HeaderSecondaryComponent,
    PhoneMaskDirective,
    IonModal,
    ConfirmModalComponent,
  ],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('exitModal') exitModal!: IonModal;
  @ViewChild('deleteModal') deleteModal!: IonModal;
  public profileFacade = inject(ProfileFacade);

  private touchedMap = new Map<string, WritableSignal<boolean>>();
  private modalController = inject(ModalController);
  public readonly sanitizer = inject(DomSanitizer);
  public avatarUrl = signal<string | null>(null);
  public THEME_ACTIONS = THEME_ACTIONS();
  public STUDENT_PROFILE_TABS = STUDENT_PROFILE_TABS();
  public availableRole = computed(() => {
    return USER_ROLE_OPTIONS.filter(role => this.profileFacade.profile()?.roles!.includes(role.value))
  });
  public activeRole = computed(() => USER_ROLE_OPTIONS.filter(role => role.value === this.profileFacade.activeRole()));

  public userModel = signal({
    email: '',
    creative_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    theme: ETheme.Light
  });
  public DELETE_SVG = this.sanitizer.bypassSecurityTrustHtml(DELETE_SVG);
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);

  private platform = inject(Platform);

  public modalBreakpoints = this.platform.is('desktop') ? undefined : [0, 0.5, 1];
  public initialBreakpoint = this.platform.is('desktop') ? undefined : 0.5;


  constructor() {
    effect(() => {
      this.updateForm();
    });
  }

  public userForm = form(this.userModel, (controls) => {
    required(controls.email, { message: 'errors.required' });
    email(controls.email, { message: 'errors.email' });

    minLength(controls.creative_name, 2, { message: 'errors.min2' });

    required(controls.first_name, { message: "errors.required" });
    minLength(controls.first_name, 2, { message: 'errors.min2' });

    minLength(controls.last_name, 2, { message: 'errors.min2' });

    pattern(controls.phone, /^\+380 \d{2} \d{3} \d{2} \d{2}$/, { message: 'errors.format-phone' });
  });

  public ngOnInit(): void {
  }

  private updateForm(): void {
      this.userModel.set({
        email: this.profileFacade.profile()?.email ?? '',
        creative_name: this.profileFacade.profile()?.creative_name ?? '',
        first_name: this.profileFacade.profile()?.first_name ?? '',
        last_name: this.profileFacade.profile()?.last_name ?? '',
        phone: this.profileFacade.profile()?.phone ?? '',
        theme: this.profileFacade.profile()?.theme ?? ETheme.Light,
      })
  }

  public ionFocus(key: string): void {
    requestAnimationFrame(() => {
      this.getTouched(key).set(false);
    })
  }

  public ionBlur(key: string): void {
    requestAnimationFrame(() => {
      this.getTouched(key).set(true);
    })
  }

  public isTouched(key: string): boolean {
    return this.getTouched(key)();
  }

  public exitModalCansel(): void {
    void this.exitModal.dismiss();
  }

  public exitModalConfirm(): void {
    void this.exitModal.dismiss();
    this.profileFacade.logout();
  }

  public deleteModalCansel(): void {
    void this.deleteModal.dismiss();
  }

  public deleteModalConfirm(): void {
    void this.deleteModal.dismiss();
  }

  public onSubmit(): void {
    if (this.userForm().invalid()) {
      Object.keys(this.userForm().value()).forEach(key => this.ionBlur(key))
      return;
    }

    const form =  this.userForm().value() as IUser
    form.phone = form.phone.replace(/\D/g, '');

    this.profileFacade.update(form);
  }

  public changeTheme(event: any): void {
    const newTheme = event.detail.value as ETheme;
    this.userModel.update(user => ({
      ...user,
      theme: newTheme
    }));

    this.profileFacade.changeTheme(newTheme);
  }

  public changeRole(event: any): void {
    const role = event.detail.value as EUserRole;
    void this.profileFacade.switchRole(role);
  }

  private getTouched(key: string): WritableSignal<boolean> {
    if (!this.touchedMap.has(key)) {
      this.touchedMap.set(key, signal(false));
    }
    return this.touchedMap.get(key)!;
  }

  async onPickPhoto() {
    const modal = await this.modalController.create({
      component: AvatarUploadComponent,
      cssClass: 'avatar-upload-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<{ blob: Blob }>();
    if (!data?.blob) return;

    const url = URL.createObjectURL(data.blob);
    this.avatarUrl.set(url);

    this.profileFacade.addAvatar(data.blob)
  }
}
