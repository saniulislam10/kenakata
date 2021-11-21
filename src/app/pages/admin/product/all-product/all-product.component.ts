import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/Service/product.service';
import { ReloadService } from 'src/app/Service/reload.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {

  products: Product[];
  currentPage: number = 1;
  // products = ELEMENT_DATA;
  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private reloadService: ReloadService,    
    ) { }
  
    ngOnInit(): void {

    this.reloadService.refreshProduct$
      .subscribe(() => {
        this.getAllProducts();
      });
    // this.dataSource = this.products;
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getAllProducts()
    .subscribe(res => {
      this.products= res.data;
    })
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteProductById(id);
      }
    });
  }

  private deleteProductById(productId: string) {
    this.productService.deleteProductById(productId)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshProduct$();
      }, error => {
        console.log(error);
      });
  }
  

}
