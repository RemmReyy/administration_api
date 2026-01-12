import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../data.service';
import { Salesman } from '../../models';

@Component({
  selector: 'app-salesmen',
  standalone: true,
  templateUrl: './salesmen.component.html',
  styleUrl: './salesmen.component.css',
  imports: [NgForOf, NgIf, AsyncPipe, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class SalesmenComponent implements OnInit {
  private readonly data = inject(DataService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  salesmen = signal<Salesman[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    sid: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    jobTitle: [''],
    email: [''],
  });

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.data.listSalesmen().subscribe({
      next: list => {
        this.salesmen.set(list);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Не удалось загрузить salesmen');
        this.loading.set(false);
      },
    });
  }

  create() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const payload: Partial<Salesman> = {
      sid: Number(raw.sid),
      firstname: raw.firstname,
      lastname: raw.lastname,
      jobTitle: raw.jobTitle || undefined,
      email: raw.email || undefined,
    };
    this.data.createSalesman(payload).subscribe({
      next: () => {
        this.form.reset();
        this.fetch(); // reload to avoid double-adding when mocks already push
      },
      error: err => this.error.set(err.message || 'Ошибка создания'),
    });
  }

  delete(sid: number) {
    this.data.deleteSalesman(sid).subscribe({
      next: () => this.salesmen.set(this.salesmen().filter(s => s.sid !== sid)),
      error: err => this.error.set(err.message || 'Ошибка удаления'),
    });
  }
}
