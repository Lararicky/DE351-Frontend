import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { SocketService } from '../services/socket.service' // ต้องนำเข้าด้วย

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './story-detail.component.html',
  styleUrl: './story-detail.component.css'
})
export class StoryDetailComponent implements OnInit {
  story: any = null
  comments: any[] = []
  newComment = { content: '', story_id: '' }
  genreText: string = ''
  token: string | null = localStorage.getItem('token')
  likeCount: number = 0
  isLiked: boolean = false
  newCollabContent: any
  collaborations: any
  socket: any

  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit () {
    const storyId = this.route.snapshot.paramMap.get('id')
    if (storyId !== null) {
      this.loadStory(storyId)
      this.loadComments(storyId)
      this.loadLikes(storyId)
      this.loadCollaborations(storyId) // โหลด Collaboration
    } else {
      console.error('Story ID is null.')
    }
    // เชื่อมต่อกับ WebSocket

    // รับข้อมูลคอลแลปแบบเรียลไทม์
    this.socketService.onReceiveCollab((collabData: any) => {
      if (collabData.story_id === this.story._id) {
        this.story.content += `\n\n${collabData.username}: ${collabData.content}` // เพิ่มข้อมูลคอลแลปในเนื้อหาของเรื่อง
      }
    })
  }
  ngOnDestroy () {
    // เมื่อคอมโพเนนต์ถูกทำลายให้ปิดการเชื่อมต่อกับ WebSocket
    this.socketService.disconnect()
  }

  // โหลดข้อมูล Story
  loadStory (id: string | null) {
    if (id) {
      this.http
        .get<any>(`http://10.20.44.34:3000/story/stories/${id}/full`)
        .subscribe(
          data => {
            this.story = data
            this.newComment.story_id = id
            if (data.genre) {
              this.genreText = data.genre.map((g: any) => g.tag_name).join(', ')
            }
          },
          error => {
            console.error('Error loading story:', error)
          }
        )
    }
  }

  // โหลดคอมเมนต์
  loadComments (storyId: string | null) {
    if (storyId) {
      this.http
        .get<any[]>(`http://10.20.44.34:3000/comment/story/${storyId}`)
        .subscribe(
          data => {
            this.comments = data
          },
          error => {
            console.error('Error loading comments:', error)
          }
        )
    }
  }

  // เพิ่ม Method โหลด Likes
  loadLikes (storyId: string | null) {
    if (storyId) {
      this.http
        .get<any[]>(`http://10.20.44.34:3000/like/story/${storyId}`)
        .subscribe(
          likes => {
            this.likeCount = likes.length

            // ตรวจสอบว่าผู้ใช้เคย Like หรือยัง
            const userId = this.authService.getUserId()
            this.isLiked = likes.some(like => like.user_id === userId)
          },
          error => {
            console.error('Error loading likes:', error)
          }
        )
    }
  }

  // เพิ่ม Method สำหรับการ Like
  toggleLike () {
    // ตรวจสอบการล็อกอิน
    if (!this.authService.isLoggedIn()) {
      alert('Please login to like this story')
      return
    }

    // ดึง Token จาก AuthService
    const token = this.authService.getToken()
    const userId = this.authService.getUserId()
    if (!token || !userId) {
      alert('Token or User ID not found. Please login again.')
      return
    }

    // ตั้งค่า Headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const url = `http://10.20.44.34:3000/like`

    if (this.isLiked) {
      // Unlike
      this.http
        .delete(`${url}/${this.story._id}`, {
          headers,
          body: { user_id: userId }
        })
        .subscribe(
          () => {
            this.isLiked = false
            this.likeCount--
          },
          error => {
            console.error('Error unliking story:', error)
            if (error.status === 401)
              alert('Session expired, please login again.')
          }
        )
    } else {
      // Like
      this.http
        .post(url, { story_id: this.story._id, user_id: userId }, { headers })
        .subscribe(
          response => {
            this.isLiked = true
            this.likeCount++
          },
          error => {
            console.error('Error liking story:', error)
            if (error.status === 401)
              alert('Session expired, please login again.')
          }
        )
    }
  }

  // เพิ่มคอมเมนต์ใหม่
  submitComment () {
    if (this.newComment.content.trim() === '') {
      alert('Comment cannot be empty!')
      return
    }

    const token = this.authService.getToken() // ดึง Token จาก AuthService
    if (!token) {
      alert('You must be logged in to comment.')
      return
    }

    const headers = new HttpHeaders().set('Authorization', token) // เพิ่ม Authorization Header

    this.http
      .post<any>('http://10.20.44.34:3000/comment', this.newComment, { headers })
      .subscribe(
        data => {
          this.comments.push(data) // เพิ่มคอมเมนต์ใหม่ในรายการ
          this.newComment.content = '' // ล้างฟอร์ม
        },
        error => {
          console.error('Error submitting comment:', error)
          if (error.status === 401) {
            alert('Unauthorized: Please log in again.')
          }
        }
      )
  }

  loadCollaborations (storyId: string) {
    this.http
      .get<any[]>(`http://10.20.44.34:3000/stories/${storyId}/collaborations`)
      .subscribe(
        collaborations => {
          this.collaborations = collaborations // เก็บคอลแลปไว้ในตัวแปร
        },
        error => {
          console.error('Error loading collaborations:', error)
        }
      )
  }

  sendCollab () {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to submit a collaboration.')
      return
    }

    if (this.newCollabContent.trim() === '') {
      alert('Collaboration content cannot be empty!')
      return
    }

    const collabData = {
      story_id: this.story._id,
      username: this.authService.getUsername(), // ดึงชื่อผู้ใช้จาก AuthService
      content: this.newCollabContent
    }

    // ส่งข้อมูลไปยัง Backend
    this.http
      .post('http://10.20.44.34:3000/collaborations', collabData)
      .subscribe(
        response => {
          console.log('Collaboration saved:', response)
        },
        error => {
          console.error('Error sending collaboration:', error)
        }
      )

    this.newCollabContent = '' // ล้างฟอร์ม
  }
}
