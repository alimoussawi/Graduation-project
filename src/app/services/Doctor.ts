
export interface Doctor{
    id?:string,
    name?:string,
    email:string,
    age?:number,
    phoneNumber?:string,
    gender?:string,
    role?:string,
    speciality?:string,
    bio?:string,
    photoURL?:string,
    idURL?:string,
    licenseURL?:string,
    address?:string,   
    location?:firebase.default.firestore.GeoPoint;
    isVerified?:boolean;
}