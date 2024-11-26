const address = "https://homalink-back-master.development.atelier.ovh";
// const address = "http://localhost:1337";

export const URL = `${address}`;

export const URL_LOGIN = `${address}/api/auth/local/`;
export const URL_REGISTER = `${address}/api/auth/local/register`;

export const URL_HORSES = `${address}/api/horses/`;
export const URL_HORSES_BY_USER = `${address}/api/users/4?populate[0]=horses`;
