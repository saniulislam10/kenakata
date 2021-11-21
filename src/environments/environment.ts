// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseLink: 'http://localhost:3000',
  ftpBaseLink: 'http://localhost:3000',
  // apiBaseLink: 'https://api.emedilife.softlabit.com',
  // ftpBaseLink: 'https://api.emedilife.softlabit.com',
  appBaseUrl: '/',
  userBaseUrl: '/admin',
  userLoginUrl: '/login',
  adminLoginUrl: 'admin/login',
  adminBaseUrl: '/admin',
  storageSecret: 'SOFT_2021_IT_1998',
  sslIpnUrl: 'https://api.emedilife.softlabit.com/api/payment-ssl/ipn',
  smsUser: 'UIO',
  smsPass: 'ABC',
  smsSid: 'XYZ',
  firebaseConfig: {
    apiKey: 'AIzaSyAVk3jpXI3JBrNa4OD9bxPfx38fZhvoAas',
    authDomain: 'e-medilife.firebaseapp.com',
    projectId: 'e-medilife',
    storageBucket: 'e-medilife.appspot.com',
    messagingSenderId: '83284106691',
    appId: '1:83284106691:web:e287859193ec6ff7dc3176'
  },
  VERSION: 1
};

