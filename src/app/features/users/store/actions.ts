import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {EUserRole, IUser, IUserUpdate} from "../models/user.model";
import {ETheme} from "@models/common.model";
import {IPagination} from "@models/api.models";

export const UserActions = createActionGroup({
  source: 'Users',
  events: {
    allUsers: props<{ role: EUserRole, page?: number }>(),
    allUsersSuccess: props<{ usersList: IUser[], pagination?: IPagination}>(),
    allUsersFailure: props<{ error: string }>(),

    allTeachers:  props<{ page?: number }>(),
    allTeachersSuccess: props<{ teachersList: IUser[], pagination?: IPagination}>(),
    allTeachersFailure: props<{ error: string }>(),

    allStudents:  props<{ page?: number }>(),
    allStudentsSuccess: props<{ studentsList: IUser[], pagination?: IPagination}>(),
    allStudentsFailure: props<{ error: string }>(),

    createUser: props<{ payload: IUserUpdate }>(),
    createUserSuccess: props<{ user: IUser }>(),
    createUserFailure: props<{ error: string }>(),

    updateUser: props<{ payload: IUserUpdate }>(),
    updateUserSuccess: props<{ user: IUser }>(),
    updateUserFailure: props<{ error: string }>(),

    deleteUser: props<{ userId: string }>(),
    deleteUserSuccess: props<{ userId: string }>(),
    deleteUserFailure: props<{ error: string }>(),

    getUser: props<{ userId: number }>(),
    getUserSuccess: props<{ user: IUser }>(),
    getUserFailure: props<{ error: string }>(),

    getProfile: emptyProps(),
    getProfileSuccess: props<{ profile: IUser }>(),
    getProfileFailure: props<{ error: string }>(),

    updateProfile: props<{ profile: IUser }>(),
    updateProfileSuccess: props<{ profile: IUser }>(),
    updateProfileFailure: props<{ error: string }>(),

    addAvatar: props<{ blob: Blob }>(),
    addAvatarSuccess:props<{ profile: IUser }>(),
    addAvatarFailure: props<{ error: string }>(),

    deleteAvatar: emptyProps(),
    deleteAvatarSuccess:props<{ profile: IUser }>(),
    deleteAvatarFailure: props<{ error: string }>(),

    updateTheme: props<{ theme: ETheme }>(),
    updateThemeSuccess:props<{ theme: ETheme }>(),
    updateThemeFailure: props<{ error: string }>(),
  },
});