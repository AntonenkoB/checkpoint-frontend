import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserService} from '../services/user.service';
import {UserActions} from './actions';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {ApiResponseHelper} from "@shared/helpers/api.helper";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {EAuthPages} from "../../auth/models/router.model";
import {EUserPages} from "../models/user.model";
import {EUserRole} from "@models/user.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {getHighestRole} from "@shared/permissions/role-priority";

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private hapticService = inject(HapticService);

  allUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.allUsers),
      switchMap(({role, page, search}) =>
        this.userService.getAllUsers(role, page, search).pipe(
          map((users) =>
            ApiResponseHelper.handleResponse(
              users,
              (data, meta) => UserActions.allUsersSuccess({usersList: data, pagination: meta}),
              (errors) => UserActions.allUsersFailure({error: errors})
            ),
          ),
          catchError((error) =>
            of(UserActions.allUsersFailure({error: error.message}))
          )
        )
      )
    )
  );

  allUsersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.allUsersFailure),
      map(() => {
        return RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier]});
      })
    )
  );

  allTeachers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.allTeachers),
      switchMap(({page}) =>
        this.userService.getAllUsers(EUserRole.Teacher, page).pipe(
          map((users) =>
            ApiResponseHelper.handleResponse(
              users,
              (data, meta) => UserActions.allTeachersSuccess({teachersList: data, pagination: meta}),
              (errors) => UserActions.allTeachersFailure({error: errors})
            ),
          ),
          catchError((error) =>
            of(UserActions.allTeachersFailure({error: error.message}))
          )
        )
      )
    )
  );

  allStudents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.allStudents),
      switchMap(({page}) =>
        this.userService.getAllUsers(EUserRole.Student, page).pipe(
          map((users) =>
            ApiResponseHelper.handleResponse(
              users,
              (data, meta) => UserActions.allStudentsSuccess({studentsList: data, pagination: meta}),
              (errors) => UserActions.allStudentsFailure({error: errors})
            ),
          ),
          catchError((error) =>
            of(UserActions.allStudentsFailure({error: error.message}))
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({payload}) =>
        this.userService.createUser(payload).pipe(
          map((data) =>
            ApiResponseHelper.handleResponse(
              data,
              (user) => UserActions.createUserSuccess({user}),
              (errors) => UserActions.createUserFailure({error: errors})
            )
          ),
          catchError((error) =>
            of(UserActions.createUserFailure({error: error.message}))
          )
        )
      )
    )
  );

  createUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUserSuccess),
      tap(() => void this.hapticService.impact(ImpactStyle.Medium)),
      switchMap((data) => {
        const highestRole = getHighestRole(data.user.roles)!;

        return [
          UserActions.allUsers({role: highestRole}),
          RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}),
        ]
      })
    )
  );

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      switchMap(({userId}) =>
        this.userService.getUser(userId).pipe(
          map((data) =>
            ApiResponseHelper.handleResponse(
              data,
              (user) => UserActions.getUserSuccess({user}),
              (errors) => UserActions.getUserFailure({error: errors})
            )
          ),
          catchError((error) =>
            of(UserActions.getUserFailure({error: error.message}))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({payload}) =>
        this.userService.updateUser(payload).pipe(
          map((data) => ApiResponseHelper.handleResponse(
            data,
            (user) => UserActions.updateUserSuccess({user}),
            (errors) => UserActions.updateUserFailure({error: errors})
          )),
          catchError((error) =>
            of(UserActions.updateUserFailure({error: error.message}))
          )
        )
      )
    )
  );

  updateUserSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.updateUserSuccess),
        tap(() => void this.hapticService.impact(ImpactStyle.Medium))
      ),
    { dispatch: false }
  );

  deleteUser$ = createEffect(() =>
      this.actions$.pipe(
          ofType(UserActions.deleteUser),
          switchMap(({ userId }) =>
              this.userService.deleteUser(userId).pipe(
                  switchMap((data) => [
                    UserActions.allUsers({role: EUserRole.Student}),
                    RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]})
                  ]),
                  catchError((error) =>
                      of(UserActions.deleteUserFailure({ error: error.message }))
                  )
              )
          )
      )
  );

  getLessons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getLessons),
      switchMap(({}) =>
        this.userService.getLessons().pipe(
          map((data) =>
            ApiResponseHelper.handleResponse(
              data,
              (lessonsList) => UserActions.getLessonsSuccess({lessonsList}),
              (errors) => UserActions.getLessonsFailure({error: errors})
            )
          ),
          catchError((error) =>
            of(UserActions.getLessonsFailure({error: error.message}))
          )
        )
      )
    )
  );
}