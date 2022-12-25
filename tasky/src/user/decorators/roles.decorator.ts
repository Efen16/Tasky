import { SetMetadata } from "@nestjs/common";
import { RoleNameEnum } from "../types/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleNameEnum[]) => SetMetadata(ROLES_KEY, roles);