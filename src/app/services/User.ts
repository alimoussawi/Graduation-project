
export interface User{
    uid:string,
    email:string,
    displayName:string,
    photoURL:string,
    role?:any,
    isVerified?:boolean;
}