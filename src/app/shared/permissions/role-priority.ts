import { EUserRole } from "@models/user.model";

export const ROLE_PRIORITY: Record<EUserRole, number> = {
  [EUserRole.Owner]: 4,
  [EUserRole.Admin]: 3,
  [EUserRole.Teacher]: 2,
  [EUserRole.Student]: 1,
};

export function getHighestRole(roles: EUserRole[]): EUserRole | null {
  if (!roles.length) return null;
  return [...roles].sort((a, b) => ROLE_PRIORITY[b] - ROLE_PRIORITY[a])[0];
}