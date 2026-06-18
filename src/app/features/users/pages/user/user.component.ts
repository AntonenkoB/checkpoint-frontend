import {Component, computed, effect, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {email, form, FormRoot, hidden, maxLength, minLength, pattern, required} from "@angular/forms/signals";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonModal,
} from "@ionic/angular/standalone";
import {
  IUserUpdate,
  USER_UPDATE_TITLE
} from "../../models/user.model";
import {IUser, EUserRole} from "@models/user.model";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserFacade} from "../../facade/user.facade";
import {addIcons} from "ionicons";
import {FORM_PASSWORD_ICONS, FORM_SELECT_ICONS} from "@models/form.models";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {SelectUserComponent} from "../select-user/select-user.component";
import {TranslateService} from "@shared/services/translate.service";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {PhoneMaskDirective} from "@shared/directives/phone-mask";
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'cp-user',
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
    UserItemComponent,
    HeaderSecondaryComponent,
    IonModal,
    SelectUserComponent,
    LoaderComponent,
    PhoneMaskDirective,
    ConfirmModalComponent,
  ],
  providers: [UserFacade]
})
export class UserComponent implements OnInit {
  @ViewChild('modal') modal!: IonModal;
  @ViewChild('deleteUserModal') deleteUserModal!: IonModal;

  private touchedMap = new Map<string, WritableSignal<boolean>>();
  public userFacade = inject(UserFacade);
  public translateService = inject(TranslateService);
  private platform = inject(Platform);

  public USER_UPDATE_TITLE = USER_UPDATE_TITLE();
  public eUserRole = EUserRole;
  public user = signal(this.userFacade.user());
  public userTitle = computed(() => {
    if (this.userFacade.isTeacher()) {
      return 'users.read-student-title'
    } else {
      return this.translateService.instant(this.USER_UPDATE_TITLE[this.userFacade.menuActive()])
    }
  });
  public attachUser = signal<IUser[]>([]);
  public isReadonly = computed(() => this.userFacade.isTeacher())
  public modalBreakpoints = this.platform.is('desktop') ? undefined : [0, 0.5, 1];
  public initialBreakpoint = this.platform.is('desktop') ? undefined : 0.5;

  public userModel = signal({
    id: 0,
    role: this.userFacade.roleCreate(),
    email: '',
    creative_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    teacher_ids: [] as number[],
  });

  constructor() {
    addIcons({...FORM_PASSWORD_ICONS, ...FORM_SELECT_ICONS});

    effect(() => {
      this.user.set(this.userFacade.user())
      this.attachUser.set(this.user()?.teachers as IUser[] ?? []);
      this.updateForm();
    });
  }

  public ngOnInit(): void {
    this.userFacade.getUser();
  }

  private updateForm(): void {
    this.userModel.set({
      id: this.user()?.id ?? 0,
      role: this.user()?.role ?? this.userFacade.roleCreate(),
      email: this.user()?.email ?? '',
      creative_name: this.user()?.creative_name ?? '',
      first_name: this.user()?.first_name ?? '',
      last_name: this.user()?.last_name ?? '',
      phone: this.user()?.phone ?? '',
      teacher_ids: this.user()?.teachers?.map(t => (t as IUser).id) ?? [],
    });
  }

  public userForm = form(this.userModel, (controls) => {
    required(controls.email, { message: 'errors.required' });
    email(controls.email, { message: 'errors.email' });
    maxLength(controls.creative_name, 64, { message: 'errors.max64' });

    minLength(controls.creative_name, 2, { message: 'errors.min2' });
    maxLength(controls.creative_name, 64, { message: 'errors.max64' });

    required(controls.first_name, { message: 'errors.required' });
    minLength(controls.first_name, 2, { message: 'errors.min2' });
    maxLength(controls.first_name, 64, { message: 'errors.max64' });

    required(controls.last_name, { message: 'errors.required' });
    minLength(controls.last_name, 2, { message: 'errors.min2' });
    maxLength(controls.first_name, 64, { message: 'errors.max64' });

    required(controls.phone, { message: 'errors.required' });
    pattern(controls.phone, /^\+380 \d{2} \d{3} \d{2} \d{2}$/, { message: 'errors.format-phone' });

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

    this.userFacade.updateUser(this.submissionPayload() as IUserUpdate)
  }

  private submissionPayload = computed(() => {
    const values = this.userForm().value();
    values.phone = values.phone.replace(/\D/g, '');
    const payload: Record<string, any> = { ...values };

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

  public deleteModalCansel(): void {
    void this.deleteUserModal.dismiss();
  }
}
