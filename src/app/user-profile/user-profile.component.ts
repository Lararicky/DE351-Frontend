import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userProfile: any;
  userId: string | null = '';
  username: string | null = '';
  email: string | null = '';
  selectedFile: File | null = null;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // ดึงข้อมูลจาก sessionStorage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
      this.username = user.username;
      this.email = user.email;
    }

    // ถ้ามี userId ให้ไปเรียกข้อมูลโปรไฟล์จาก backend
    if (this.userId) {
      this.http.get(`http://10.20.44.34:3000/user/${this.userId}`).subscribe(
        (data: any) => {
          this.userProfile = data;
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    }
  }

  // ฟังก์ชันเพื่อบันทึกการแก้ไขโปรไฟล์
  saveProfile(): void {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      // ส่งคำขอ PATCH เพื่ออัปเดตข้อมูลโปรไฟล์
      this.http.patch<any>(`http://10.20.44.34:3000/user/${this.userId}`, this.userProfile).subscribe(
        (response) => {
          console.log('Profile updated successfully', response);
          alert('Profile updated successfully!');
          this.router.navigate(['/user-profile']);  // กลับไปยังหน้าโปรไฟล์
        },
        (error) => {
          console.error('Error updating profile', error);
        }
      );
    }
  }

  //ฟังก์ชันสำหรับการเลือกไฟล์รูปภาพ
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewImage(file);
   }
  }

  // ฟังก์ชันที่จะแสดงภาพที่อัพโหลด
  previewImage(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.userProfile.coverImage = reader.result as string;  // อัพเดตภาพในโปรไฟล์
    };
    reader.readAsDataURL(file);
  }

  // ฟังก์ชันสำหรับอัปโหลดรูปภาพ
  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('coverImage', this.selectedFile, this.selectedFile.name);

      // ส่งข้อมูลไปยัง backend
      this.http.patch<any>(`http://10.20.44.34:3000/user/${this.userId}`, formData)
        .subscribe(
          (response) => {
            // อัปเดตโปรไฟล์หลังจากอัปโหลดรูปภาพสำเร็จ
            this.userProfile.coverImage = response.coverImage;
            console.log('Image uploaded successfully');
            this.router.navigate(['/user-profile']);
          },
          (error) => {
            console.error('Error uploading image', error);
          }
        );
    }
  }

  isEditing = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // ฟังก์ชันเปลี่ยนหน้าไปยังหน้ารายการเนื้อเรื่อง
  goToMyStories() {
    this.router.navigate(['/my-stories']);
  }

  // Navigate to Home page
  goToHome(): void {
    this.router.navigate(['/home']);
  }

  // Log out function
  logout(): void {
    // Clear user session or token (example: sessionStorage)
    sessionStorage.removeItem('userToken');
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
