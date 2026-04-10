import {Component, computed, effect, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {email, form, FormRoot, hidden, minLength, pattern, required} from "@angular/forms/signals";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonModal,
} from "@ionic/angular/standalone";
import {
  EUserRole,
  IUser,
  IUserUpdate,
  USER_CREATE_TITLE,
  USER_UPDATE_TITLE
} from "../../models/user.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserFacade} from "./user.facade";
import {NoRipplePasswordToggle} from "@shared/directives/no-ripple-password-toggle";
import {addIcons} from "ionicons";
import {FORM_PASSWORD_ICONS, FORM_SELECT_ICONS} from "@models/form.models";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {SelectUserComponent} from "../select-user/select-user.component";
import {ERoutParams} from "@models/router.model";
import {TranslateService} from "@shared/services/translate.service";
import {LoaderComponent} from "@shared/components/loader/loader.component";

@Component({
  selector: 'cp-user-create',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    FormRoot,
    FormsModule,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    ReactiveFormsModule,
    TranslatePipe,
    IonInputPasswordToggle,
    NoRipplePasswordToggle,
    UserItemComponent,
    HeaderSecondaryComponent,
    IonModal,
    SelectUserComponent,
    LoaderComponent,
  ],
  providers: [UserFacade]
})
export class UserComponent {
  @ViewChild('modal') modal!: IonModal;
  private touchedMap = new Map<string, WritableSignal<boolean>>();
  public userFacade = inject(UserFacade);
  public translateService = inject(TranslateService);
  public USER_CREATE_TITLE = USER_CREATE_TITLE();
  public USER_UPDATE_TITLE = USER_UPDATE_TITLE();
  public user = signal(this.userFacade.user());
  public userModel = signal({
    role: EUserRole.Student,
    email: '',
    creative_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    temporary_password: 'checkpoint',  // transfer to back
    teacher_ids: [] as number[],
  });
  public EUserRole = EUserRole;
  public isUpdate = computed(() => this.userFacade.selectRouteParams()[ERoutParams.UserId]);
  public userTitle = computed(() => {
    if (this.isUpdate()) {
      return this.translateService.instant(this.USER_UPDATE_TITLE[this.userFacade.roleCreate() as EUserRole])
    } else {
      return this.translateService.instant(this.USER_CREATE_TITLE[this.userFacade.roleCreate() as EUserRole])
    }
  });
  public attachUser = signal<IUser[]>([]);

  constructor() {
    addIcons({...FORM_PASSWORD_ICONS, ...FORM_SELECT_ICONS});

    effect(() => {
      if (this.isUpdate()) {
        this.user.set(this.userFacade.user())
        this.attachUser.set(this.user()?.teachers as IUser[] ?? []);
        this.updateForm();
      }
    });
  }

  private updateForm(): void {
    this.userModel.set({
      role: this.user()?.role ?? this.userFacade.roleCreate(),
      email: this.user()?.email ?? '',
      creative_name: this.user()?.creative_name ?? '',
      first_name: this.user()?.first_name ?? '',
      last_name: this.user()?.last_name ?? '',
      phone: this.user()?.phone ?? '',
      temporary_password: 'checkpoint',
      teacher_ids: this.user()?.teachers?.map(t => (t as IUser).id) ?? [],
    });
  }

  public userForm = form(this.userModel, (controls) => {
    required(controls.email, { message: 'errors.required' });
    email(controls.email, { message: 'errors.email' });

    minLength(controls.creative_name, 2, { message: 'errors.min2' });

    required(controls.first_name, { message: 'errors.required' });
    minLength(controls.first_name, 2, { message: 'errors.min2' });

    required(controls.last_name, { message: 'errors.required' });
    minLength(controls.last_name, 2, { message: 'errors.min2' });

    required(controls.phone, { message: 'errors.required' });
    pattern(controls.phone, /^\+?\d{9,15}$/, { message: 'errors.format-phone' });

    required(controls.temporary_password, { message: 'errors.required' });
    minLength(controls.temporary_password, 8, { message: 'errors.min8' });
    hidden(controls.temporary_password, () => this.isUpdate());

    hidden(controls.teacher_ids, ({ valueOf }) =>
      valueOf(controls.role) !== EUserRole.Student
    );
  });

  public ionFocus(key: string): void {
    this.getTouched(key).set(false);
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
      return
    }

    this.isUpdate()
      ? this.userFacade.updateUser(this.submissionPayload() as IUserUpdate)
      : this.userFacade.createUser(this.submissionPayload() as IUserUpdate);
  }

  private submissionPayload = computed(() => {
    const values = this.userForm().value();
    const payload: Record<string, any> = { ...values };

    if (this.isUpdate()) {
      delete payload['temporary_password'];
    }

    if (values.role !== EUserRole.Student) {
      delete payload['teacher_ids'];
    }

    return payload;
  });

  public updateTeachers(ids: number[]): void {
    this.attachUser.set(this.userFacade.teachersList().filter(teacher => ids.includes(teacher.id)));

    const attachIds = this.attachUser().map((teacher) => teacher.id);
    this.userForm.teacher_ids().value.set(attachIds);

    void this.modal.dismiss();
  }

  public deleteTeacher(id: number): void {
    this.attachUser.set(this.attachUser().filter(teacher => id !== teacher.id));
  }

  private getTouched(key: string): WritableSignal<boolean> {
    if (!this.touchedMap.has(key)) {
      this.touchedMap.set(key, signal(false));
    }
    return this.touchedMap.get(key)!;
  }
}
