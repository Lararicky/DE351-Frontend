import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service'


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = ''
  password: string = ''

  constructor (private http: HttpClient, private router: Router, private authService: AuthService) {}

  onLogin() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://10.20.44.34:3000/user/login', loginData).subscribe(
      (response: any) => {
        console.log('Login successful', response);

        // เก็บ Token และข้อมูลผู้ใช้ผ่าน AuthService
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('token', response.token);

        // นำไปหน้าอื่น
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please check your username and password.');
      }
    );
  }
}
