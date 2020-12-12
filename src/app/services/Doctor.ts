import { AddressInfo } from "./AddressInfo";
import {Availability} from "./Availability";
import { Reservation } from './Reservation';
export interface Doctor{
    id?:string,
    name?:string,
    email?:string,
    birthDate?:any,
    phoneNumber?:string,
    gender?:string,
    role?:string,
    speciality?:string,
    bio?:string,
    photoURL?:string,
    idCardUrl?:string,
    medicalLicenseUrl?:string,
    addressInfo?:AddressInfo,   
    isVerified?:boolean,
    status?:string,
    price?:number,
    availability?:Availability,
}