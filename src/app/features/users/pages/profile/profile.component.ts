import {Component, computed, effect, ElementRef, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton, ModalController
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {email, form, FormRoot, minLength, pattern, required} from "@angular/forms/signals";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IUser, THEME_ACTIONS} from "../../models/user.model";
import {ProfileFacade} from "./profile.facade";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {ETheme} from "@models/common.model";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {AvatarUploadComponent} from "@shared/components/avatar-upload/avatar-upload.component";
import {DomSanitizer} from "@angular/platform-browser";
import {DELETE_SVG, PLUS_SVG} from "@models/svg.models";

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
  ],
  providers: [ProfileFacade],
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private touchedMap = new Map<string, WritableSignal<boolean>>();
  private modalController = inject(ModalController);
  public readonly sanitizer = inject(DomSanitizer);
  public avatarUrl = signal<string | null>(null);
  public THEME_ACTIONS = THEME_ACTIONS();
  public profileFacade = inject(ProfileFacade);
  public profile = signal(this.profileFacade.profile());
  public userModel = signal({
    role: '',
    email: '',
    creative_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    theme: ETheme.Light
  });
  public DELETE_SVG = this.sanitizer.bypassSecurityTrustHtml(DELETE_SVG);
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);


  constructor() {
    effect(() => {
      this.profile.set(this.profileFacade.profile());
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

    pattern(controls.phone, /^\+?\d{9,15}$/, { message: 'errors.format-phone' });
  });

  private updateForm(): void {
      this.userModel.set({
        role: this.profile()?.role ?? '',
        email: this.profile()?.email ?? '',
        creative_name: this.profile()?.creative_name ?? '',
        first_name: this.profile()?.first_name ?? '',
        last_name: this.profile()?.last_name ?? '',
        phone: this.profile()?.phone ?? '',
        theme: this.profile()?.theme ?? ETheme.Light,
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

  public onSubmit(): void {
    if (this.userForm().invalid()) {
      Object.keys(this.userForm().value()).forEach(key => this.ionBlur(key))
      return;
    }

    this.profileFacade.update(this.userForm().value() as IUser);
  }

  public changeTheme(event: any): void {
    const newTheme = event.detail.value as ETheme;
    this.userModel.update(user => ({
      ...user,
      theme: newTheme
    }));

    this.profileFacade.changeTheme(newTheme);
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
