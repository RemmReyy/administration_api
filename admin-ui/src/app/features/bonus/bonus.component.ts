import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-bonus',
  standalone: true,
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.css',
  imports: [ReactiveFormsModule, MatButtonModule, NgIf]
})
export class BonusComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(DataService);

  success = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    employeeId: ['', Validators.required],
    year: ['', Validators.required],
    value: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    const { employeeId, year, value } = this.form.getRawValue();
    this.loading.set(true);
    this.data.addBonus(employeeId, { year: Number(year), value: Number(value) }).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.error.set(null);
      },
      error: err => {
        this.error.set(err.message || 'Ошибка');
        this.loading.set(false);
        this.success.set(false);
      },
    });
  }
}
