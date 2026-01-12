import { AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../data.service';
import { PerformanceRecord } from '../../models';

@Component({
  selector: 'app-performance',
  standalone: true,
  templateUrl: './performance.component.html',
  styleUrl: './performance.component.css',
  imports: [NgForOf, NgIf, AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class PerformanceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(DataService);

  records = signal<PerformanceRecord[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  activePanel = signal<'create' | 'update' | 'delete' | null>(null);

  createForm = this.fb.nonNullable.group({
    goalId: ['', Validators.required],
    goalDescription: ['', Validators.required],
    valueSupervisor: ['', Validators.required],
    valuePeerGroup: ['', Validators.required],
    year: ['', Validators.required],
  });

  updateForm = this.fb.nonNullable.group({
    sid: ['', Validators.required],
    description: ['', Validators.required],
    newValueSupervisor: ['', Validators.required],
    newValuePeerGroup: ['', Validators.required],
  });

  deleteForm = this.fb.nonNullable.group({
    sid: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit() {
    this.loadAllFor(1);
  }

  private togglePanel(panel: 'create' | 'update' | 'delete') {
    this.activePanel.set(this.activePanel() === panel ? null : panel);
  }

  toggleCreate() { this.togglePanel('create'); }
  toggleUpdate() { this.togglePanel('update'); }
  toggleDelete() { this.togglePanel('delete'); }

  loadAllFor(sid: number) {
    this.loading.set(true);
    this.data.listPerformanceBySalesman(sid).subscribe({
      next: list => {
        this.records.set(list);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Ошибка загрузки');
        this.loading.set(false);
      },
    });
  }

  create() {
    if (this.createForm.invalid) return;
    const raw = this.createForm.getRawValue();
    const payload: PerformanceRecord = {
      goalId: Number(raw.goalId),
      goalDescription: raw.goalDescription,
      valueSupervisor: Number(raw.valueSupervisor),
      valuePeerGroup: Number(raw.valuePeerGroup),
      year: Number(raw.year),
    };
    this.data.createPerformance(payload).subscribe({
      next: r => {
        this.records.set([...this.records(), r]);
        this.createForm.reset();
      },
      error: err => this.error.set(err.message || 'Ошибка создания'),
    });
  }

  update() {
    if (this.updateForm.invalid) return;
    const raw = this.updateForm.getRawValue();
    const payload = {
      sid: Number(raw.sid),
      description: raw.description,
      newValueSupervisor: Number(raw.newValueSupervisor),
      newValuePeerGroup: Number(raw.newValuePeerGroup),
    };
    this.data.updatePerformance(payload).subscribe({
      next: updated => {
        const next = this.records().map(r =>
          r.goalId === payload.sid && r.goalDescription === payload.description ? updated : r
        );
        this.records.set(next);
      },
      error: err => this.error.set(err.message || 'Ошибка обновления'),
    });
  }

  remove() {
    if (this.deleteForm.invalid) return;
    const raw = this.deleteForm.getRawValue();
    const payload = { sid: Number(raw.sid), description: raw.description };
    this.data.deletePerformance(payload).subscribe({
      next: () => this.records.set(
        this.records().filter(r => !(r.goalId === payload.sid && r.goalDescription === payload.description))
      ),
      error: err => this.error.set(err.message || 'Ошибка удаления'),
    });
  }
}
