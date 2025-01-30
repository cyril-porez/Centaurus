// const address = "https://homalink-back-master.development.atelier.ovh";
// const localAddressStrapi = "http://localhost:1337";
const localAddress = "http://localhost:8080/api/v1";

export const URL = `${localAddress}`;

export const URL_LOGIN = `${localAddress}/auth/sign-in`;
export const URL_REGISTER = `${localAddress}/auth/sign-up`;
export const URL_HORSE = `${localAddress}/horse`;
export const URL_HORSES = `${localAddress}/horses`;
export const URL_WEIGHTS = `${localAddress}/weight`;
export const URL_WEIGHTSS = `${localAddress}/weights`;

export const URL_ADD_HORSE = `${localAddress}/horses/add-horse`;
export const URL_HORSES_BY_USER = `${localAddress}/api/users/4?populate[0]=horses`;
