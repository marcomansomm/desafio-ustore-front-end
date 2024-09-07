import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CrudListServices } from '../../services/crud.service';
import {
  IError,
  IProductError,
  IProductResponse,
} from '../../models/crud.models';

@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss',
})
export class CrudFormComponent {
  form: FormGroup = new FormGroup({});
  productId: string | null = null;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private crudServices: CrudListServices,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      describe: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      expiry_date: new FormControl('', [Validators.required]),
    });

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.crudServices.getProduct(this.productId).subscribe((product: any) => {
        this.form.patchValue(product.data);
      });
    }
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onSubmit(): void {
    if (this.form && this.form.valid) {
      const formData = this.form.value;
      if (this.productId) {
        this.crudServices.updateProduct(this.productId, formData).subscribe({
          next: (response: IProductResponse) => {
            this.showNotification(response.message, 'Fechar');
            console.log('Atualização concluída com sucesso!', response);
            this.router.navigate(['/crud-list']);
          },
          error: (error: IError) => {
            this.showNotification(error.error.message, 'Fechar');
            console.error('Erro ao atualizar o produto', error);
          },
          complete: () => {
            console.log('Subscription complete');
          },
        });
      } else {
        this.crudServices.createProduct(formData).subscribe({
          next: (response: IProductResponse) => {
            this.showNotification(response.message, 'Fechar');
            console.log('Cadastro realizado com sucesso!', response);
            this.router.navigate(['/crud-list']);
          },
          error: (error: IError) => {
            this.showNotification(error.error.message, 'Fechar');
            console.error('Erro ao cadastrar o produto', error);
          },
          complete: () => {
            console.log('Subscription complete');
          },
        });
      }
    } else {
      console.error('Formulário inválido!');
    }
  }
}
