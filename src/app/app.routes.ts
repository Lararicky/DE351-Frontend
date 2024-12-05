import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // เพิ่ม FormsModule
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { TrendComponent } from './trend/trend.component';
import { StoryComponent } from './story/story.component';
import { SignupComponent } from './signup/signup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { StoryDetailComponent } from './story-detail/story-detail.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'login', component: LoginComponent },
    { path: 'trend', component: TrendComponent },
    { path: 'story', component: StoryComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'story/:id', component: StoryDetailComponent }
];

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule, 
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
