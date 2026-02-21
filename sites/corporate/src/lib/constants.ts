const isDev = process.env.NODE_ENV === "development";

export const LP_URL = isDev ? "http://localhost:3001/" : "/sotobacoportal/";
export const CONTACT_URL = isDev ? "http://localhost:3001/contact/" : "/sotobacoportal/contact/";
export const BTONE_CONTACT_URL = isDev ? "http://localhost:3001/contact/?category=btone" : "/sotobacoportal/contact/?category=btone";
export const BLOG_URL = isDev ? "http://localhost:3002/" : "https://blog.sotobaco.com/";
export const BTONE_SIGNUP_URL = "https://app.sotobaco.com/signup";
