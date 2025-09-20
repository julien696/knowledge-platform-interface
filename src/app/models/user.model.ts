export interface User {
    id : number;
    name : string;
    email : string;
    role : string;
    isVerified : boolean;
    createdAt? : string;
    updatedAt? : string;
}

export interface LoginRequest {
    email : string;
    password : string;
}

export interface LoginResponse {
    token : string;
    user : User;
}

export interface RegisterRequest {
    name : string;
    email : string;
    plainPassword : string;
}

export interface RegisterResponse {
    message : string;
    user : User;
}