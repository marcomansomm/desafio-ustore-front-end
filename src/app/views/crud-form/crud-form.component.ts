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
  isReadOnly = false;
  constructor(
    private router: Router,
    private crudServices: CrudListServices,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('mode') === 'view') {
      this.isReadOnly = true;
    }
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
  onCheckboxChange(event: MatCheckboxChange, day: string) {
    const days = this.form.get('actions')?.value as string[];
    if (event.checked) {
      days.push(day);
    } else {
      const index = days.indexOf(day);
      if (index > -1) {
        days.splice(index, 1);
      }
    }
    this.form.get('actions')?.setValue(days);
  }

  isDaySelected(day: string): boolean {
    return this.form.get('actions')?.value.includes(day);
  }

  isActiveSelected(status: boolean): boolean {
    if (this.form.get('status')?.value === status) {
      return true;
    }
    return false;
  }

  onSubmit(): void {
    if (this.isReadOnly) return;
    if (this.form && this.form.valid) {
      const formData = this.form.value;
      if (this.productId) {
        this.crudServices.updateProduct(this.productId, formData).subscribe({
          next: (response) => {
            console.log('Atualização concluída com sucesso!', response);
            this.router.navigate(['/crud-list']);
          },
          error: (error) => {
            console.error('Erro ao atualizar o profissional', error);
          },
          complete: () => {
            console.log('Subscription complete');
          },
        });
      } else {
        this.crudServices.createProduct(formData).subscribe({
          next: (response) => {
            console.log('Cadastro realizado com sucesso!', response);
            this.router.navigate(['/crud-list']);
          },
          error: (error) => {
            console.error('Erro ao cadastrar o profissional', error);
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
