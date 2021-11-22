import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/Service/product.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material/dialog';
import { FileData } from 'src/app/interfaces/file-data';
import { FileUploadService } from 'src/app/Service/file-upload.service';
import { __await } from 'tslib';
import { Subscription } from 'rxjs';
import { ImageCropComponent } from '../image-crop/image-crop.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public dataForm: FormGroup;
  product: Product = null;
  private sub: Subscription;

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

  // slug
  name: string;
  slug: string;

  //update
  chooseImage?: string[] = [];

  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  id: string = null;



  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      price: [null, Validators.required],
      category: [null, Validators.required],
      brand: [null, Validators.required],
    });

    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleProductById();
        console.log(this.product);
      }
    });


    // Auto Generate Slug
    this.autoGenerateSlug();
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('name').valueChanges
        .pipe(
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  fileChangeEvent(event: any) {
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
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }


  /**
   * OPEN COMPONENT DIALOG
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropComponent, {
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

        }
      }
    });
  }

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

  imageUploadOnServer() {

    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'products'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
        console.log(this.url)
      }, error => {
        console.log(error);
      });
  }

  async onSubmitForm() {

      if (this.pickedImage) {
        await this.imageUploadOnServer();
        await this.delay(1000);
      }
      console.log(this.url);
      let product = {
        name: this.dataForm.value.name,
        slug: this.dataForm.value.slug,
        price: this.dataForm.value.price,
        category: this.dataForm.value.category,
        brand: this.dataForm.value.brand,
        imageLink: this.url,
      }
      
      this.dataForm.reset();
      if (this.id) {
        const mDataEdit = { ...product, ...{ _id: this.id } };
        this.editProductById(mDataEdit);
      } else {
        this.productService.postProduct(product).subscribe((result) => {
          console.warn("get api data: ", result);
        })
      }
  }

  async delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  private patchFormData() {
    this.chooseImage = this.product.imageLink;
    this.dataForm.patchValue(this.product);
  }

  private getSingleProductById() {
    this.subDataOne = this.productService.getSingleProductById(this.id)
      .subscribe(res => {
        this.product = res.data;
        if (this.product) {
          this.patchFormData();
        }
      }, error => {
        console.log(error);
      });
  }

  private editProductById(data: any) {
    this.productService.editProductById(data)
      .subscribe(res => {
        console.log(res.message);
      }, error => {
        console.log(error);
      });
  }


}
