import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { ReloadService } from 'src/app/Service/reload.service';
import { UserDataService } from 'src/app/Service/user-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { FileUploadService } from 'src/app/Service/file-upload.service';
import { FileData } from 'src/app/interfaces/file-data';
import { ImageCropperComponent } from './image-cropper/image-crop.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Image Upload
  imageChangedEvent: any = null;
  staticImage = '/assets/svg/user.svg';
  imgPlaceHolder = '/assets/svg/user.svg';
  croppedImage: any = null;

  pickedImage?: any;
  file: any = null;
  newFileName: string;
  url: any;
  autoSlug = true;

  imgBlob: any = null;

  //update
  chooseImage?: string[] = [];

  //user

  user !: User;

  constructor(
    private dialog: MatDialog,
    protected userDataService: UserDataService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshUser$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();
  }

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
        if(res.data.profileImg){
          this.imgPlaceHolder = res.data.profileImg;
        }
      }, error => {
        console.log(error);
      });
  }

  openNewDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want edit user informations?'
      }
    });
  }

  async fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onload = () => {
      // this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      await this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }


  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '680px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          this.pickedImage = dialogResult.croppedImage;
          this.imgPlaceHolder = this.pickedImage;
          this.imageUploadOnServer();
        }
      }
    });
  }

  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  imageUploadOnServer() {

    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'users'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
        this.sendUrl(res.downloadUrl);
      }, error => {
        console.log(error);
      });
  }

  sendUrl(url: any){
    let user = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      password: this.user.password,
      username: this.user.phone,
      profileImg: url,
    }
    this.userDataService.editLoginUserInfo(user)
    .subscribe(res => {
      console.log(res.message);
    })
  }

}
