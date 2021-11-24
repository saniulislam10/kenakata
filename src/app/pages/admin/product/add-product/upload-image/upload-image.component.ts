import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageFolder } from 'src/app/interfaces/image-folder';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { FileUploadService } from 'src/app/Service/file-upload.service';
import { GalleryService } from 'src/app/Service/gallery.service';
import { ImageFolderService } from 'src/app/Service/image-folder.service';
import { ReloadService } from 'src/app/Service/reload.service';
import { UiService } from 'src/app/Service/ui.service';
import { UtilsService } from 'src/app/Service/utils.service';




@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  // in app.component.ts
  files: File[] = [];
  folders: ImageFolder[] = [];
  selectedFolder: ImageFolder = null;
  downloadUrls: any;


  constructor(
    private fileUploadService: FileUploadService,
    private galleryService: GalleryService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private imageFolderService: ImageFolderService,
    public dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.getAllImageFolderList();
  }
  private getAllImageFolderList() {
    this.imageFolderService.getAllImageFolderList()
      .subscribe(res => {
        this.folders = res.data;
      }, err => {
        console.log(err);
      });
  }

  /**
   * IMAGE DRUG & DROP
   */
  onSelect(event: { addedFiles: any; }) {
    this.files.push(...event.addedFiles);
    console.log(this.files);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  /**
   * ON IMAGE UPLOAD
   */
  onUploadImages() {
    if (!this.selectedFolder) {
      this.uiService.warn('No Folder name found!');
      return;
    }
    if (!this.files || this.files.length <= 0) {
      this.uiService.warn('No Image selected!');
      return;
    }
    this.fileUploadService.uploadMultiImageOriginal(this.files)
      .subscribe(res => {
        this.downloadUrls = res.downloadUrls;
        this.onSaveImage();
        const data: ImageGallery[] = this.downloadUrls.map(m => {
          return {
            url: m,
            name: this.utilsService.getPopString(m),
            folder: this.selectedFolder,
          } as ImageGallery;
        });

        this.addImagesToGallery(data);

      }, error => {
        console.log(error);
      });
  }

  /**
   * HTTP REQ HANDLE
   */

  private addImagesToGallery(data: ImageGallery[]) {
    this.galleryService.addNewGalleryMultiData(data)
      .subscribe(res => {
        this.reloadService.needRefreshGallery$();
        this.dialogRef.close(
          {
            downloadLinks: this.downloadUrls ? this.downloadUrls : null
          }
        );
        console.log(res.message);
      }, error => {
        console.log(error);
      });
  }

  onCloseDialogue() {
    this.dialogRef.close();
  }

  onSaveImage() {
    console.log("On close");
    this.dialogRef.close(
      {
        downloadLinks: this.downloadUrls ? this.downloadUrls : null
      }
    );
  }


}
