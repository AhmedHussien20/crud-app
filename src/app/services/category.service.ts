import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { ProductDTO } from '../model/productDTO';
import { ApiResponse } from '../model/apiResponse';
import { map } from 'rxjs/operators';
import { CategoryDTO } from '../model/CategoryDTO ';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {private apiUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) {}
  getAllCategories(): Observable<ApiResponse<CategoryDTO []>> {
    return this.http.get<ApiResponse<CategoryDTO []>>(this.apiUrl);
  }
}