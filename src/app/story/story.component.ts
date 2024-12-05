import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

interface Tag {
  _id: string;
  tag_name: string;
}

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  storyForm: FormGroup;
  tags: Tag[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  statuses: string[] = ['draft', 'active', 'inactive', 'completed'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      genre: [[], Validators.required],
      status: ['draft', Validators.required],
      content: ['', Validators.required],
      created_by: [''],
      coverImage: [null]
    });
  }

  ngOnInit(): void {
    this.fetchTags();
    //this.initializeRichTextEditor();
    this.storyForm.patchValue({
      created_by: this.authService.getUserId()
    });
  }

  // Fetch tags for the genre selection
  fetchTags(): void {
    this.http.get<Tag[]>('http://10.20.44.34:3000/tag/tags').subscribe(
      (data) => {
        this.tags = data; // กำหนดข้อมูล tag ที่ดึงมา
        // สมมติว่าเลือกหลาย tag
        this.storyForm.patchValue({
          genre: this.tags.map(tag => tag._id)  // ส่งชื่อ tag ทั้งหมดในฟอร์ม
        });
      },
      (error) => console.error('Error fetching tags:', error)
    );
  }

  changeFont(font: string): void {
    const contentField = document.getElementById('content') as HTMLTextAreaElement;
    if (contentField) {
      contentField.style.fontFamily = font;
    }
  }

  toggleBold(): void {
    const contentField = document.getElementById('content') as HTMLTextAreaElement;
    if (contentField) {
      contentField.style.fontWeight = contentField.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
  }

  toggleItalic(): void {
    const contentField = document.getElementById('content') as HTMLTextAreaElement;
    if (contentField) {
      contentField.style.fontStyle = contentField.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
  }

  // Handle image preview
  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.storyForm.patchValue({ coverImage: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit form data to create a new story
  onSubmit(): void {
    if (this.storyForm.valid) {
      const formData = new FormData();

      formData.append('title', this.storyForm.get('title')?.value);
      formData.append('genre', this.storyForm.get('genre')?.value);
      formData.append('status', this.storyForm.get('status')?.value);
      formData.append('content', this.storyForm.get('content')?.value);

      // ดึง userId จาก AuthService
      const createdBy = this.authService.getUserId();
      formData.append('created_by', createdBy || ''); // fallback in case createdBy is null

      // เพิ่ม coverImage ถ้ามีการอัพโหลด
      if (this.storyForm.get('coverImage')?.value) {
        formData.append('coverImage', this.storyForm.get('coverImage')?.value);
      }

      //const token = this.authService.getToken(); // ดึง JWT Token จาก AuthService
      const token = sessionStorage.getItem('token');
      console.log(formData)

      // ส่งข้อมูลไปยัง backend
      this.http.post('http://10.20.44.34:3000/story/newstory', formData, {
        headers: { 'Authorization': token || '' }
      }).subscribe(
        (response) => {
          console.log('Story created successfully:', response);
          alert('Story created successfully!');
          this.router.navigate(['/stroy']); // นำไปยังหน้ารายการเรื่องราว
        },
        (error) => {
          console.error('Error creating story:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

}
