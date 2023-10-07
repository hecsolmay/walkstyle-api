import { Role } from "@/constanst/enums";
import { RegisterDTO } from "@/schemas/auth";

export interface UserCreateDTO extends RegisterDTO{
    role?: Role



}