import {Component, computed, effect, inject, OnInit, signal, ViewChild, WritableSignal} from "@angular/core";
import {email, form, FormRoot, hidden, maxLength, minLength, pattern, required} from "@angular/forms/signals";
import {FormsModule} from "@angular/forms";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonModal
} from "@ionic/angular/standalone";
import {NoRipplePasswordToggle} from "@shared/directives/no-ripple-password-toggle";
import {PhoneMaskDirective} from "@shared/directives/phone-mask";
import {SelectUserComponent} from "@users/pages/select-user/select-user.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {UserFacade} from "@users/facade/user.facade";
import {TranslateService} from "@shared/services/translate.service";
import {EUserRole, IUser} from "@models/user.model";
import {addIcons} from "ionicons";
import {FORM_PASSWORD_ICONS, FORM_SELECT_ICONS} from "@models/form.models";
import {IUserUpdate, USER_CREATE_TITLE} from "@users/models/user.model";
import {RoleListComponent} from "@shared/components/role-list/role-list.component";

@Component({
  selector: "cp-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.scss"],
  imports: [
    FormRoot,
    FormsModule,
    HeaderSecondaryComponent,
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonList,
    IonModal,
    NoRipplePasswordToggle,
    PhoneMaskDirective,
    SelectUserComponent,
    TranslatePipe,
    UserItemComponent,
    RoleListComponent
  ],
  providers: [UserFacade]
})
export class UserCreateComponent implements OnInit {
  @ViewChild('modal') modal!: IonModal;

  private touchedMap = new Map<string, WritableSignal<boolean>>();
  public userFacade = inject(UserFacade);
  public translateService = inject(TranslateService);

  public USER_CREATE_TITLE = USER_CREATE_TITLE();
  public eUserRole = EUserRole;
  public user = signal(this.userFacade.user());
  public userTitle = computed(() => this.translateService.instant(this.USER_CREATE_TITLE[this.userFacade.menuActive()]));
  public attachUser = signal<IUser[]>([]);
  public selectedRoles = signal<EUserRole[]>([this.userFacade.roleCreate()])
  public userModel = signal({
    role: this.userFacade.roleCreate(),
    roles: this.selectedRoles(),
    email: '',
    creative_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    temporary_password: 'checkpoint',
    teacher_ids: [] as number[],
  });

  constructor() {
    addIcons({...FORM_PASSWORD_ICONS, ...FORM_SELECT_ICONS});

    effect(() => {
      this.userModel.update(model => ({
        ...model,
        role: this.userFacade.roleCreate()
      }));

      this.userForm.roles().value.set(this.selectedRoles());
    });
  }

  public ngOnInit(): void {
    this.selectedRoles.set([this.userFacade.roleCreate()]);
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
    maxLength(controls.last_name, 64, { message: 'errors.max64' });

    required(controls.phone, { message: 'errors.required' });
    pattern(controls.phone, /^\+380 \d{2} \d{3} \d{2} \d{2}$/, { message: 'errors.format-phone' });

    required(controls.temporary_password, { message: 'errors.required' });
    minLength(controls.temporary_password, 8, { message: 'errors.min8' });
    maxLength(controls.temporary_password, 64, { message: 'errors.max64' });

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

    this.userFacade.createUser(this.submissionPayload() as IUserUpdate);
  }

  private submissionPayload = computed(() => {
    const values = this.userForm().value();
    values.phone = values.phone.replace(/\D/g, '');
    const payload: Record<string, any> = { ...values };

    if (values.role !== EUserRole.Student) {
      delete payload['teacher_ids'];
    }

    if (values.role === EUserRole.Student && this.userFacade.isTeacher()) {
      const hasTeacher = payload['teacher_ids'].some((id: string) => id === this.userFacade.profile()?.id.toString());

      if (!hasTeacher) {
        payload['teacher_ids'].push(this.userFacade.profile()?.id);
      }
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
