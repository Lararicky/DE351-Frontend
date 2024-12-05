import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, Routes, RouterModule, Router } from '@angular/router';  // เพิ่ม Router ที่นี่
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent {
  title = 'webapp';
  showNavbar = true;  // ควบคุมการแสดงผลของ Navbar

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      // ตรวจสอบว่าเส้นทางปัจจุบันคือ login, signup หรือ user-profile หรือไม่
      this.showNavbar = !(currentRoute === '/login' || currentRoute === '/signup' || currentRoute === '/user-profile' || currentRoute === '/user-profile-edit');
    });
  }
}
