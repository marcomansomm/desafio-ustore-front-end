import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct, IProductResponse } from '../models/crud.models';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudListServices {
  [x: string]: any;
  private path = 'http://localhost:3001/';
  constructor(private httpClient: HttpClient) {}

  getProducts(page: number, pageSize: number): Observable<IProductResponse[]> {
    return this.httpClient.get<IProductResponse[]>(
      this.path + 'products' + '?page=' + page + '&limit=' + pageSize
    );
  }

  getProduct(id: string): Observable<IProductResponse> {
    return this.httpClient.get<IProductResponse>(this.path + 'products/' + id);
  }
  updateProduct(id: string, product: IProduct): Observable<IProductResponse> {
    if (!id) {
      console.error('ID inválido para atualização');
      return throwError(() => new Error('ID inválido para atualização'));
    }

    return this.httpClient.patch<IProductResponse>(
      `${this.path}products/${id}`,
      product
    );
  }
  deleteProduct(id: string): Observable<IProductResponse> {
    return this.httpClient.delete<IProductResponse>(
      this.path + 'products/' + id
    );
  }
  createProduct(Products: any): Observable<IProductResponse> {
    return this.httpClient.post<IProductResponse>(
      this.path + 'products',
      Products
    );
  }
}
