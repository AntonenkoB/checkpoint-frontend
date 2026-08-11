import {computed, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, of, pipe, switchMap, tap} from 'rxjs';
import {selectQueryParam, selectRouteParam} from '../../../store/router/selectors';
import {EAppPages, EQueryParams, ERoutParams} from '@shared/models/router.model';
import {LessonsService} from "@lessons/services/lessons.service";
import {ELessonPages, ICancelLesson, ISetLesson, ITransferringLesson} from "@lessons/models/lessons.model";
import {AppState} from "@capacitor/app";
import {RouterActions} from "../../../store/router/actions";
import {IScheduleItem} from "@schedule/models/schedule.model";
import {StudentStore} from "@student/store/student.store";
import {IUser} from "@models/user.model";
import {ProfileStore} from "@profile/store/profile.store";
import {ScheduleStore} from "@schedule/store/schedule.store";
import {formatLessonToDateTime} from "@shared/utils/date.utils";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {ToastService} from "@shared/services/toast.service";
import {TranslateService} from "@shared/services/translate.service";

export interface LessonsState {
  isLoading: boolean;
  slots: IScheduleItem[] | null;
  currentUser: IUser | null;
  currentDateTime: string | null;
  currentLessonId: number | null;
  currentSlotId: number | null;
}

const initialState: LessonsState = {
  isLoading: false,
  slots: null,
  currentUser: null,
  currentDateTime: null,
  currentLessonId: null,
  currentSlotId: null
};

export const LessonsStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),

  withComputed((
    state,
    store = inject(Store),
  ) => ({
    isReady: computed(() => !state.isLoading()),
    teacherId: store.selectSignal(selectRouteParam(ERoutParams.TeacherId)),
    date: store.selectSignal(selectQueryParam(EQueryParams.Date)),
    from: store.selectSignal(selectQueryParam(EQueryParams.From)),
    to: store.selectSignal(selectQueryParam(EQueryParams.To)),
  })),

  withMethods((
    state,
    lessonsService = inject(LessonsService),
  ) => ({

    updateCurrentUser(user: IUser): void {
      patchState(state, {currentUser: user});
    },
    updateCurrentDateTime(time: string): void {
      patchState(state, {currentDateTime: time});
    },
    updateCurrentLessonId(id: number): void {
      patchState(state, {currentLessonId: id});
    },
    clearAdditionalInfo(): void {
      patchState(state, {
        currentUser: null,
        currentDateTime: null,
        currentLessonId: null,
        currentSlotId: null
      });
    },

    getTeacherSlots: rxMethod<string>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((date) => lessonsService.getTeacherSlots(state.from()!, state.to()!, state.teacherId()!).pipe(
          tap((response) => {
            patchState(state, {isLoading: false, slots: response.data});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getIndividualSlots: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((date) => lessonsService.getTIndividualSlots(state.from()!, state.to()!).pipe(
          tap((response) => {
            patchState(state, {isLoading: false, slots: response.data});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
  })),
  withMethods((
    state,
    lessonsService = inject(LessonsService),
    globalStore = inject<Store<AppState>>(Store),
    studentStore = inject(StudentStore),
    scheduleStore = inject(ScheduleStore),
    profileStore = inject(ProfileStore),
    hapticService = inject(HapticService),
    toastService = inject(ToastService),
    translateService = inject(TranslateService),
  ) => ({
    bookAsStudent: rxMethod<ISetLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.setLessonAtStudent(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentUser: response.data.teacher
            });
            void hapticService.impact(ImpactStyle.Medium);
            studentStore.getLessons();
            profileStore.getProfile();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    bookIndividualAsStudent: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.setIndividualAtStudent(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentUser: response.data.teacher
            });
            void hapticService.impact(ImpactStyle.Medium);
            studentStore.getLessons();
            profileStore.getProfile();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonSuccess]}));
          }),
          catchError((err) => {
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    bookAsTeacher: rxMethod<ISetLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.setLessonAtTeacher(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentUser: response.data.student
            });
            void hapticService.impact(ImpactStyle.Medium);
            // scheduleListStore.getScheduleList();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    bookIndividualAsAdmin: rxMethod<ISetLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.setIndividualAsAdmin(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentUser: response.data.student
            });

            void hapticService.impact(ImpactStyle.Medium);
            scheduleStore.getIndividualSlots();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    canceledAsStudent: rxMethod<ICancelLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.cancelLessonAtStudent(data).pipe(
          tap(() => {
            patchState(state, {
              isLoading: false,
            });

            void hapticService.impact(ImpactStyle.Medium);
            profileStore.getProfile();
            studentStore.getLessons();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonCanceled]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    cancelAsTeacher: rxMethod<ICancelLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.canceledLessonAtTeacher(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
            });
            void hapticService.impact(ImpactStyle.Medium);
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonCanceled]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    cancelIndividualAsStudent: rxMethod<ICancelLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.canceledIndividualAtStudent(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
            });
            void hapticService.impact(ImpactStyle.Medium);
            profileStore.getProfile();
            studentStore.getLessons();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonCanceled]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    cancelIndividualAsAdmin: rxMethod<ICancelLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.canceledIndividualAtAdmin(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
            });

            void hapticService.impact(ImpactStyle.Medium);
            scheduleStore.getIndividualSlots();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonCanceled]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    transferringAsStudent: rxMethod<ITransferringLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.transferringLessonAtStudent(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentDateTime: formatLessonToDateTime(response.data)
            });

            void hapticService.impact(ImpactStyle.Medium);
            studentStore.getLessons();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonTransferringSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    transferringAsTeacher: rxMethod<ITransferringLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.transferringLessonAtTeacher(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentDateTime: formatLessonToDateTime(response.data)
            });

            void hapticService.impact(ImpactStyle.Medium);
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonTransferringSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    transferringIndividualAsStudent: rxMethod<ITransferringLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.transferringIndividualAtStudent(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentDateTime: formatLessonToDateTime(response.data)
            });

            void hapticService.impact(ImpactStyle.Medium);
            // scheduleListStore.getScheduleList();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonTransferringSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),

    transferringIndividualAsAdmin: rxMethod<ITransferringLesson>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => lessonsService.transferringIndividualAtAdmin(data).pipe(
          tap((response) => {
            patchState(state, {
              isLoading: false,
              currentDateTime: formatLessonToDateTime(response.data)
            });

            void hapticService.impact(ImpactStyle.Medium);
            scheduleStore.getIndividualSlots();
            globalStore.dispatch(RouterActions.goTo({path: [EAppPages.Lessons, ELessonPages.LessonTransferringSuccess]}));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            void hapticService.impact(ImpactStyle.Heavy);
            toastService.error(translateService.instant('common.error-default'));
            return of(null);
          })
        ))
      )
    ),
  })),
);
