import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSignup() {
    const signupData = {
      email: this.email,
      password: this.password,
      username: this.username
    };

    this.http.post('http://10.20.44.34:3000/user/signup', signupData).subscribe(
      (response: any) => {
        console.log('Signup successful', response);
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Signup failed', error);
        alert('Signup failed. Please try again.');
      }
    );
  }
}
