
import { UserType } from "./user.type";

export interface userResponse{
    user: UserType & {token: string}
}