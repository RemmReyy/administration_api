import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgForOf } from '@angular/common';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgForOf, NgClass, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Administration UI';

  navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/salesmen', label: 'Salesmen' },
    { path: '/performance', label: 'Performance' },
    { path: '/bonus', label: 'HR Bonus' },
  ];
}
