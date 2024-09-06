import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../models/crud.models';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudListServices {
  [x: string]: any;
  private path = 'http://localhost:3001/';
  constructor(private httpClient: HttpClient) {}

  getProducts() {
    return this.httpClient.get<IProduct[]>(this.path + 'products');
  }

  getProduct(id: string) {
    return this.httpClient.get<IProduct>(this.path + 'products/' + id);
  }
  updateProduct(id: string, product: IProduct): Observable<IProduct> {
    if (!id) {
      console.error('ID inválido para atualização');
      return throwError(() => new Error('ID inválido para atualização'));
    }

    return this.httpClient.patch<IProduct>(
      `${this.path}products/${id}`,
      product
    );
  }
  deleteProduct(id: string) {
    return this.httpClient.delete(this.path + 'products/' + id);
  }
  createProduct(Products: any) {
    return this.httpClient.post(this.path + 'products', Products);
  }
}
