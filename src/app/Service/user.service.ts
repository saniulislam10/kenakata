import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {User} from '../interfaces/user';
import {DATABASE_KEY} from '../utils/global-variable';
import {NgxSpinnerService} from 'ngx-spinner';
// import {CartService} from './cart.service';
import {ProductService} from './product.service';
// import {AngularFireAuth} from '@angular/fire/auth';
// import firebase from 'firebase';
// import auth = firebase.auth;
// import {BulkSmsService} from './bulk-sms.service';
import {StorageService} from './storage.service';
import { ReloadService } from './reload.service';

const API_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private isUser = false;
  private userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;
  private newToken: string;

  constructor(
    private httpClient: HttpClient,
    private productService: ProductService,
    private router: Router,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    // private cartService: CartService,
    // private afAuth: AngularFireAuth,
    private storageService: StorageService,
    // private bulkSmsService: BulkSmsService,
  ) {
  }

  /**
   * USER REGISTRATION
   */

  userRegistration(data: User, redirectFrom?: string) {
    this.httpClient.post<{ success: boolean; message: string; token: string; expiredIn: number }>


    (API_USER + 'registration', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          if (res.token) {
            
            this.onSuccessLogin(res.token, res.expiredIn, redirectFrom);
          }

          // this.bulkSmsService.sendMessageWithSubscribe(
          //   '88' + data.phoneNo,
          //   `Dear ${data.fullName}, Welcome to E-medilife. Enjoy authentic home appliances at country’s most trusted electronics store www.emedilife.com.`
          // );
        } else {
          // this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          // this.spinner.hide();
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        // this.spinner.hide();
      });
  }

  userLogin(data: { username: string, password: string }, redirectFrom?: string) {

    this.httpClient.put<{ success: boolean; message: string; token: string; expiredIn: number }>
    (API_USER + 'login', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          console.log(res.expiredIn);
          // Make User Auth True..
          if (res.token) {
            this.onSuccessLogin(res.token, res.expiredIn, redirectFrom);
          }
        } else {
          this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          this.spinner.hide();
        }
        
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }
  
  /**
   * ON SUCCESS LOGIN
   */
  
   private onSuccessLogin(token: string, expiredIn: number, redirectFrom?: string, fromRegistration?: boolean) {
    this.isUser = true;
    this.userStatusListener.next(true);

    // For Token Expired Time..
    const expiredInDuration = expiredIn;
    this.setSessionTimer(expiredInDuration);

    // Save Login Time & Expiration Time & Token to Local Storage..
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
    this.saveUserData(token, expirationDate);

    // Snack bar..
    this.uiService.success('Welcome! Login Success.');
    // Spinner
    this.spinner.hide();

    // SYNC CART ITEM
    // this.getCarsItemFromLocal();

    // Navigate with Auth..

    this.reloadService.needRefreshUser$();
    
    if (redirectFrom) {
      this.router.navigate([redirectFrom]);
    } else {
      this.router.navigate([environment.appBaseUrl]);
    }
  }
  
  /**
   * EDIT PASSWORD
   */
  editPassword(data: any) {
    return this.httpClient.post<{ message: string }>(API_USER + 'edit-password', data);
  }

  updatePassword(data: any) {
    return this.httpClient.post<{ success: boolean; message: string }>(API_USER + 'update-password', data);
  }
  
  protected saveUserData(token: string, expiredDate: Date) {
    const data = {
      token,
      expiredDate
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptUserLogin);

  }

  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
    }, duration * 1000);
  }

  getUserData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }

  protected clearUserData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }
  
  getUserToken() {
    return this.token;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  getUserStatus() {
    return this.isUser;
  }

  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.setSessionTimer(expiresIn / 10000);
    }
  }
  userLogOut() {
    this.token = null;
    this.isUser = false;
    this.userStatusListener.next(false);
    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.appBaseUrl]);
  }



}
