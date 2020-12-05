export interface AddressInfo{
    location?:firebase.default.firestore.GeoPoint;
    address:string;
    countryCode:string;
    country:string;
    city:string;
}