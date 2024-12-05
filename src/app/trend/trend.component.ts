import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Story {
  _id: string;
  title: string;
  genre: { _id: string; tag_name: string }[];
  status: string;
  content: string;
  created_by: { _id: string; username: string };
  coverImage: string;
  likeCount?: number;
  commentCount?: number; 
}

@Component({
  selector: 'app-trend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trend.component.html',
  styleUrl: './trend.component.css'
})
export class TrendComponent implements OnInit {
  genres: string[] = [];
  stories: any[] = [];
  filteredStories: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadStories();
  }

  loadStories() {
    this.http.get<any[]>('http://10.20.44.34:3000/story/stories').subscribe(
      (data) => {
        this.stories = data.map((story) => ({
          ...story,
          coverImage: story.coverImage
            ? `data:image/jpeg;base64,${story.coverImage}` // ใช้ Base64
            : 'assets/default-cover.jpg' // รูป default หากไม่มี coverImage
        }));
        this.filteredStories = this.stories; // แสดงผลทุกเรื่อง

        // ดึง genres ทั้งหมดจาก stories
        this.genres = Array.from(
          new Set(
            this.stories.flatMap((story) =>
              story.genre.map((g: { tag_name: string }) => g.tag_name)
            )
          )
        );
      },
      (error) => {
        console.error('Error loading stories:', error);
      }
    );
  }

  loadStoryStats(storyId: string, story: any) {
    this.http.get<{ count: number }>(`http://10.20.44.34:3000/like/count/story/${storyId}`).subscribe(
      (response) => {
        console.log(`Likes for story ${storyId}:`, response.count);
        story.likeCount = response.count;
      },
      (error) => console.error('Error loading likes:', error)
    );

    this.http.get<{ count: number }>(`http://10.20.44.34:3000/comment/count/story/${storyId}`).subscribe(
      (response) => {
        console.log(`Comments for story ${storyId}:`, response.count);
        story.commentCount = response.count;
      },
      (error) => console.error('Error loading comments:', error)
    );
}

  filterByGenre(genre: string) {
    if (genre === 'All') {
      this.filteredStories = this.stories;
    } else {
      this.filteredStories = this.stories.filter(
        (story) => story.genre.some((g: any) => g.tag_name === genre)
      );
    }
  }
  // Navigate to Story-detail
  readStory(id: string) {
    this.router.navigate(['/story', id]);
  }
  
  collabStory(storyId: string) {
    console.log(`Collaborate on story with ID: ${storyId}`);
  }
  
}




