import { UserEntity } from "../models/user.entity";

export type UserType = Omit<UserEntity,'hashPassword'>; 