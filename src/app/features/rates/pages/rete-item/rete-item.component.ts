import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {IonButton, IonContent, IonInput, IonItem} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RatesFacade} from "@rates/facade/rates.facade";
import {addIcons} from "ionicons";
import {FORM_PASSWORD_ICONS, FORM_SELECT_ICONS} from "@models/form.models";
import {ERatesType, IRate, IUpdateRate} from "@rates/models/rates.model";
import {RatesStore} from "@rates/store/rates.store";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {LoaderComponent} from "@shared/components/loader/loader.component";

@Component({
  selector: "cp-rete-item",
  templateUrl: "./rete-item.component.html",
  styleUrls: ["./rete-item.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonInput,
    IonButton,
    TranslatePipe,
    UserItemReadComponent,
    LoaderComponent,
    IonContent
  ],
  providers: [RatesFacade]
})
export class ReteItemComponent implements OnInit {
  public ratesFacade = inject(RatesFacade);
  public ratesStore = inject(RatesStore);
  public teacherRate = computed(() => this.ratesStore.teacherRate());
  public teacherId = computed(() => this.ratesStore.teacherId() ?? null)
  public teacher = computed(() => this.teacherRate()?.[0]?.teacher);
  public eRatesType = ERatesType;

  public rateSingleUpdateModel = signal<IUpdateRate>({
    teacher_amount: null,
    school_amount: '',
  })

  public rateSubscriptionUpdateModel = signal<IUpdateRate>({
    teacher_amount: null,
    school_amount: '',
  })

  constructor() {
    addIcons({...FORM_PASSWORD_ICONS, ...FORM_SELECT_ICONS});

    effect(() => {
      if (this.teacherRate()) {
        this.updateForm();
      }
    });
  }

  ngOnInit() {
    this.ratesFacade.loadTeacherRate();
    this.updateForm();
  }

  private updateForm(): void {
    const single = this.teacherRate()?.find((rate) => rate.type === ERatesType.Single);
    const subscription = this.teacherRate()?.find((rate) => rate.type === ERatesType.Subscription);

    this.rateSingleUpdateModel.set({
      teacher_amount: single?.teacher_amount ? single?.teacher_amount : '',
      school_amount: single?.school_amount ? single?.school_amount : '',
    });

    this.rateSubscriptionUpdateModel.set({
      teacher_amount: subscription?.teacher_amount ? subscription?.teacher_amount : '',
      school_amount: subscription?.school_amount ? subscription?.school_amount : '',
    });
  }

  public onInput(event: any, type: ERatesType, key: string) {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9.,]/g, '');

    event.target.value = filteredValue;

    if (type === ERatesType.Single) {
      this.rateSingleUpdateModel.update((prev) => ({
        ...prev,
        [key]: filteredValue ?? ''
      }));
    }

    if (type === ERatesType.Subscription) {
      this.rateSubscriptionUpdateModel.update((prev) => ({
        ...prev,
        [key]: filteredValue ?? ''
      }));
    }
  }

  public save(): void {
    const single = this.teacherRate()?.find((rate) => rate.type === ERatesType.Single);
    const subscription = this.teacherRate()?.find((rate) => rate.type === ERatesType.Subscription);

    if (this.teacher()) {
      this.ratesStore.updateTeacherRate({id: single?.id.toString()!, data: this.rateSingleUpdateModel()});
      this.ratesStore.updateTeacherRate({id: subscription?.id.toString()!, data: this.rateSubscriptionUpdateModel()});
    } else {
      this.ratesStore.updateTeacherRate({
        id: single?.id.toString()!,
        data: {school_amount: this.rateSingleUpdateModel().school_amount}
      });
      this.ratesStore.updateTeacherRate({
        id: subscription?.id.toString()!,
        data: {school_amount: this.rateSubscriptionUpdateModel().school_amount}
      });
    }
  }
}
