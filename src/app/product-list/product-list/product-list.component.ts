import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../../model/productDTO';
import { MatTableDataSource } from '@angular/material/table';  // Import MatTableDataSource
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiResponse } from '../../model/apiResponse';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from '../../product-create/create-product/create-product.component';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']  // Corrected styleUrls
})
export class ProductListComponent implements OnInit {

  products: ProductDTO[] = [];  // Store products
  displayedColumns: string[] = ['id','name', 'price', 'categoryName','action']; 
  dataSource: MatTableDataSource<ProductDTO> = new MatTableDataSource();   
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  constructor(private productService: ProductService ,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(query => {
        this.searchQuery = query;
        return this.productService.getAllProducts(query); 
      })
    ).subscribe((products:ApiResponse<ProductDTO[]>) => {
      console.log(products);
      this.products = products.data;
      this.dataSource.data = products.data;  
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data.data;
        this.dataSource.data = this.products;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSearchChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);  
  }

  openCreateProductDialog(): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '600px',
      height: '400px',
      data: { product: null }   
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created' || result === 'updated') {
        this.loadProducts();  
      }
    });
  }
  openEditProductDialog(product: any): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '400px',
      data: { product: product }   
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openDeleteConfirmationDialog(product: any): void {
    const confirmation = window.confirm('Are you sure you want to delete this product?');

    if (confirmation) {
      this.deleteProduct(product.id);
    }
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }
}
