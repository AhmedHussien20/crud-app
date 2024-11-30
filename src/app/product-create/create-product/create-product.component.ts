import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service'; 
import { ProductCreateDTO } from '../../model/productCreateDTO';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../model/CategoryDTO ';

@Component({
  selector: 'app-create-product',
  standalone: false,
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @Input() product: ProductCreateDTO = { name: '', price: 0, categoryId: 0 };
  isEditMode: boolean = false;
  categories: CategoryDTO[] = [];
  constructor(
    private productService: ProductService,
    private categoryService:CategoryService,
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
    if (this.data && this.data.product) {
      this.product = this.data.product;
      this.isEditMode = true;
    }
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.productService.createProduct(this.product).subscribe(
      (response) => {
        console.log('Product created successfully:', response);
        this.dialogRef.close('created'); 
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }

  updateProduct(): void {
    // this.productService.updateProduct(this.product).subscribe(
    //   (response) => {
    //     console.log('Product updated successfully:', response);
    //     this.dialogRef.close('updated'); // Close dialog with 'updated' status
    //   },
    //   (error) => {
    //     console.error('Error updating product:', error);
    //   }
    // );
  }
}
