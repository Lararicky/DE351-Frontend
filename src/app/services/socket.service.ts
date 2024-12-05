import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3000'); // เชื่อมต่อกับ WebSocket Server
  }

  // ส่งข้อมูลคอลแลปไปยัง Server
  sendCollab(collabData: any) {
    this.socket.emit('sendCollab', collabData);
  }

  // ฟังการรับข้อมูลคอลแลป
  onReceiveCollab(callback: (collabData: any) => void) {
    this.socket.on('newCollab', callback);
  }

  // ปิดการเชื่อมต่อ
  disconnect() {
    this.socket.disconnect();
  }
}
