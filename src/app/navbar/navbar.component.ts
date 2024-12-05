import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user: any;
  showDropdown: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        console.log("User found in sessionStorage:", this.user);
      } else {
        console.log("No user found, showing Login button.");
      }
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToNewStory() {
    if (!this.user) {
      alert("Please login to create a new story.");
      this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปยังหน้า Login
    } else {
      this.router.navigate(['/story']); // เปลี่ยนเส้นทางไปยังหน้า Story
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    // ลบข้อมูลผู้ใช้จาก sessionStorage และรีเฟรชหน้า
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.user = null;
    this.router.navigate(['/home']);
  }

}
