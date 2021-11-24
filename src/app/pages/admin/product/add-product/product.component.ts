import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/Service/product.service';
import { MatDialog } from '@angular/material/dialog';
import { FileData } from 'src/app/interfaces/file-data';
import { FileUploadService } from 'src/app/Service/file-upload.service';
import { __await } from 'tslib';
import { Subscription } from 'rxjs';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { ImageFolder } from 'src/app/interfaces/image-folder';
import { GalleryService } from 'src/app/Service/gallery.service';
import { ReloadService } from 'src/app/Service/reload.service';
import { UtilsService } from 'src/app/Service/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageFolderService } from 'src/app/Service/image-folder.service';
import { Pagination } from 'src/app/interfaces/pagination';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public dataForm: FormGroup;
  product: Product = null;
  private sub: Subscription;
  private links: any;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;
  
  // Multiple image

  // SELECTED IMAGE
  selectedImages: ImageGallery[] = [];
  selectPreview?: ImageGallery;


  private holdPrevData: any[] = [];
  images: ImageGallery[] = [];
  folders: ImageFolder[] = [];
  selectedFolder = null;

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

 // Query
 queryFolder: string = null;
  searchQuery: any;
  searchProducts: any[];
  searchForm: any;



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private galleryService: GalleryService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private imageFolderService: ImageFolderService,
    public utilsService: UtilsService,
    private spinner: NgxSpinnerService
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

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */


  onSubmitForm() {

      console.log(this.links);
      let product = {
        name: this.dataForm.value.name,
        slug: this.dataForm.value.slug,
        price: this.dataForm.value.price,
        category: this.dataForm.value.category,
        brand: this.dataForm.value.brand,
        imageLink: this.links,
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


  // IMAGE UPLOAD, edit , remove by gallery

  /**
   * PATCH IMAGE INFO
   */
   private setImageDataForm(data: any) {
    this.dataForm?.patchValue(data);
  }

  /**
   * HTTP REQ HANDLE
   */
  private getAllImageFolderList() {
    this.imageFolderService.getAllImageFolderList()
      .subscribe(res => {
        this.folders = res.data;
      }, err => {
        console.log(err);
      });
  }


  private getAllGalleryList() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.galleryService.getAllGalleryList(pagination, this.queryFolder ? this.queryFolder : null)
      .subscribe(res => {
        this.images = res.data;
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
        this.spinner.hide();
        window.scrollTo(0, 0);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private editGalleryData(data: ImageGallery) {
    this.galleryService.editGalleryData(data)
      .subscribe(res => {
        this.reloadService.needRefreshGallery$();
      }, error => {
        console.log(error);
      });
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * ON SELECT IMAGE
   */

  onSelectImage(image: any) {
    const index = this.selectedImages.findIndex(x => x._id === image._id);


    if (index === -1) {
      this.selectedImages.push(image);
      // Set Preview Image
      const i = this.selectedImages.length - 1;
      this.selectPreview = this.selectedImages[i];
      const folder = this.selectPreview.folder as ImageFolder;
      const dataFolder = this.folders.find(f => f._id === folder._id);
      this.setImageDataForm({name: this.selectPreview.name, folder: dataFolder});

      if (this.selectedImages.length === 1) {
      } else {
        this.setImageDataForm({});
      }

    } else {
      this.removeSelectImage(image);
    }

  }

  checkSelected(image: any) {
    const index = this.selectedImages.findIndex(x => x._id === image._id);
    return index === -1;

  }


  removeSelectImage(s: ImageGallery, event?: any) {
    if (event) {
      event.stopPropagation();
    }
    const index = this.selectedImages.findIndex(x => x._id === s._id);
    this.selectedImages.splice(index, 1);
    const i = this.selectedImages.length - 1;
    if (i >= 0) {
      this.selectPreview = this.selectedImages[i];
      const folder = this.selectPreview.folder as ImageFolder;
      const dataFolder = this.folders.find(f => f._id === folder._id);
      this.setImageDataForm({name: this.selectPreview.name, folder: dataFolder});
    } else {
      this.selectPreview = undefined;
    }
  }

  /**
   *  DIALOG
   */
  public openComponentDialog(data?: ImageFolder[]) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      data,
      panelClass: ['theme-dialog', 'dialog-no-radius'],
      maxWidth: '800px',
      maxHeight: '580px',
      height: '100%',
      width: '100%',
      autoFocus: false,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.links = dialogResult.downloadLinks;
        console.log(this.links);
      }
    });
  }

  /**
   * DELETE IMAGE PERMANENT
   */
  deleteImages() {
    const dbIds = this.selectedImages.map(m => m._id) as string[];
    const fileUrls = this.selectedImages.map(m => m.url) as string[];

    this.galleryService.deleteGalleryDataMulti(dbIds)
      .subscribe(res => {
        this.fileUploadService.removeFileMultiArray(fileUrls)
          .subscribe(res2 => {
            this.reloadService.needRefreshGallery$();
            this.selectedImages = [];
          });
      }, error => {
        console.log(error);
      });
  }


  onImageDataUpdate() {
    if (this.dataForm?.invalid) {
      return;
    }
    const folder = this.dataForm?.value.folder;
    const finalData = {...this.dataForm?.value, ...{folder: folder._id}, ...{_id: this.selectedImages[0]._id}};
    this.editGalleryData(finalData);

  }

  selectPreviewImage(s: ImageGallery) {
    this.selectPreview = s;
    this.setImageDataForm({name: this.selectPreview.name, folder: this.selectPreview.folder});
  }

  /**
   * DE SELECT IMAGE
   */
  deselectAll() {
    this.selectedImages = [];
    this.selectPreview = undefined;
    this.setImageDataForm({});
    this.searchQuery = null;
    this.searchProducts = [];
    this.searchForm?.resetForm();
    this.queryFolder = null;
    this.router.navigate([], {queryParams: {page: 1}});
  }

  onFilterSelectChange(event: MatSelectChange) {
    this.queryFolder = event.value;
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllGalleryList();
    }
  }



}
