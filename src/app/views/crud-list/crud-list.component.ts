import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CrudListServices } from '../../services/crud.service';
import {
  IError,
  IProduct,
  IProductError,
  IProductResponse,
} from '../../models/crud.models';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './crud-list.component.html',
  styleUrl: './crud-list.component.scss',
})
export class CrudListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'id',
    'describe',
    'price',
    'expiry_date',
    'actions',
  ];
  logElementId(elementId: any) {
    console.log(elementId);
  }
  dataSource = new MatTableDataSource<IProduct>([]);
  pageSize = 5;
  currentPage = 1;
  previusPage = 0;
  totalSize = 0;
  constructor(
    private crudServices: CrudListServices,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.getRegistredProducts();
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  deleteProduct(id: string): void {
    this.crudServices.deleteProduct(id).subscribe({
      next: (response: IProductResponse) => {
        this.showNotification(response.message, 'Fechar');
        console.log(response.message, response);
        this.router.navigate(['/crud-list']);
      },
      error: (error: IError) => {
        this.showNotification(error.error.message, 'Fechar');
        console.error('Erro ao excluir o produto', error);
      },
      complete: () => {
        this.getRegistredProducts(this.currentPage, this.pageSize);
        console.log('Subscription complete');
      },
    });
  }
  getRegistredProducts(page: number = 1, pageSize: number = 5) {
    this.crudServices.getProducts(page, pageSize).subscribe((response: any) => {
      this.dataSource.data = response.data.products.map(
        (element: IProduct) => ({
          ...element,
          expiry_date: new Date(element.expiry_date).toISOString(),
        })
      );
      this.totalSize = response.data.totalItems;
      this.paginator.pageIndex = response.data.totalPages;
    });
  }
  handlePageEvent(event: PageEvent) {
    console.log(event);

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getRegistredProducts(this.currentPage, this.pageSize);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
