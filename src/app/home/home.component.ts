import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  
})
export class HomeComponent {
  cardpic1 = {
    pic:"./assets/Actionfilm.jpg"
  }
  cardpic2 = {
    pic: "./assets/Advfilm.jpg"
  }
  cardpic3 = {
    pic: "./assets/Fufanworld.jpg"
  }
  cardpic4 = {
    pic: "./assets/Romance.jpg"
  }
}
