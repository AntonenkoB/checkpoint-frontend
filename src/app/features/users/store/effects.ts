import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserService} from '../services/user.service';
import {UserActions} from './actions';
import {catchError, from, map, of, switchMap} from 'rxjs';
import {ApiResponseHelper} from "@shared/helpers/api.helper";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {EAuthPages} from "../../auth/models/router.model";
import {EUserPages, EUserRole} from "../models/user.model";
import {SettingsService} from "@shared/services/settings.service";

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private settingsService = inject(SettingsService);

  allUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.allUsers),
      switchMap(({role, page}) =>
        this.userService.getAllUsers(role, page).pipe(
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
        return RouterActions.navigate({ path: [EAppPages.Auth, EAuthPages.Login]});
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
      switchMap(({}) => of(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]})))
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
          switchMap(({ payload }) =>
              this.userService.updateUser(payload).pipe(
                  map((data) => ApiResponseHelper.handleResponse(
                    data,
                    (user) => UserActions.updateUserSuccess({user}),
                    (errors) => UserActions.updateUserFailure({error: errors})
                  )),
                  catchError((error) =>
                      of(UserActions.updateUserFailure({ error: error.message }))
                  )
              )
          )
      )
  );

  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getProfile),
      switchMap(() =>
        this.userService.getProfile().pipe(
          map((data) =>
            ApiResponseHelper.handleResponse(
              data,
              (profile) => UserActions.getProfileSuccess({profile}),
              (errors) => UserActions.getProfileFailure({error: errors})
            )
          ),
          catchError((error) =>
            of(UserActions.getUserFailure({error: error.message}))
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ profile }) =>
        this.userService.updateProfile(profile).pipe(
          map((data) => ApiResponseHelper.handleResponse(
            data,
            (profile) => UserActions.updateProfileSuccess({profile}),
            (errors) => UserActions.updateProfileFailure({error: errors})
          )),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfileSuccess),
      switchMap(({ profile }) =>
        from(this.settingsService.updateSettings({ theme: profile.theme }))
      )
    ), { dispatch: false }
  );

  addAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addAvatar),
      switchMap(({ blob }) => {
        const formData = new FormData();
        const file = new File([blob], 'avatar.webp', { type: 'image/webp' });
        formData.append('avatar', file);

        return this.userService.addAvatar(formData).pipe(
          map((data) => ApiResponseHelper.handleResponse(
            data,
            (profile) => UserActions.addAvatarSuccess({profile}),
            (errors) => UserActions.addAvatarFailure({error: errors})
          )),
          catchError((error) =>
            of(UserActions.addAvatarFailure({ error: error.message }))
          )
        )
      })
    )
  );

  addAvatarSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addAvatarSuccess),
      switchMap(() => of(UserActions.getProfile()))
    )
  );

  deleteAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteAvatar),
      switchMap(() => {
        return this.userService.deleteAvatar().pipe(
          map((data) => ApiResponseHelper.handleResponse(
            data,
            (profile) => UserActions.deleteAvatarSuccess({profile}),
            (errors) => UserActions.deleteAvatarFailure({error: errors})
          )),
          catchError((error) =>
            of(UserActions.deleteAvatarFailure({ error: error.message }))
          )
        )
      })
    )
  );

  deleteAvatarSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteAvatarSuccess),
      switchMap(() => of(UserActions.getProfile()))
    )
  );

  // deleteUser$ = createEffect(() =>
  //     this.actions$.pipe(
  //         ofType(UserActions.deleteUser),
  //         switchMap(({ userId }) =>
  //             this.userService.deleteUser(userId).pipe(
  //                 map(() => UserActions.deleteUserSuccess({ userId })),
  //                 catchError((error) =>
  //                     of(UserActions.deleteUserFailure({ error: error.message }))
  //                 )
  //             )
  //         )
  //     )
  // );
}