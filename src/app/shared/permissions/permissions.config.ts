import {EUserRole} from "@models/user.model";

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete';

export type PermissionMode = 'any' | 'all';

export const ROLE_PERMISSIONS: Record<EUserRole, Permission[]> = {
  [EUserRole.Student]: [],

  [EUserRole.Teacher]: [
    'users:read',
  ],

  [EUserRole.Admin]: [
    'users:read', 'users:write', 'users:delete',
  ],

  [EUserRole.Owner]: [
    'users:read', 'users:write', 'users:delete',
  ],
};