import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CrudListServices } from '../../services/crud.service';
import { IProduct } from '../../models/crud.models';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
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
  currentPage = 0;
  totalSize = 0;
  constructor(private crudServices: CrudListServices, private router: Router) {
    this.getRegistredProducts();
  }

  deleteProduct(id: string): void {
    this.crudServices.deleteProduct(id).subscribe({
      next: (response) => {
        console.log('Exclusão concluída com sucesso!', response);
        this.router.navigate(['/crud-list']);
      },
      error: (error) => {
        console.error('Erro ao excluir o produto', error);
      },
      complete: () => {
        console.log('Subscription complete');
      },
    });
  }
  getRegistredProducts(page: number = 0, pageSize: number = 5) {
    this.crudServices.getProducts().subscribe((response: any) => {
      this.dataSource.data = response.data.map((element: any) => ({
        ...element,
      }));
      console.log(this.dataSource.data);

      this.totalSize = response.total;
    });
  }
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getRegistredProducts(this.currentPage, this.pageSize);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
