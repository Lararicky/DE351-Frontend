import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //getUsername() {
      //throw new Error('Method not implemented.');
    //}
    //constructor() { } 
    // เมธอดที่ใช้ดึงชื่อผู้ใช้
    getUsername(): string {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user).username : ''; // ถ้ามีข้อมูลผู้ใช้ใน sessionStorage, ก็ให้ดึง username
    }
    constructor() { } 

    // ฟังก์ชันนี้ใช้สำหรับดึง ID ของผู้ใช้ที่ล็อกอิน
    getUserId(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode Payload
            return payload.userId || null; // ดึง userId จาก Payload
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    
    getToken(): string | null {
        return sessionStorage.getItem('token'); // ดึง JWT จาก sessionStorage

    }
    

    // ฟังก์ชันนี้สามารถใช้ตรวจสอบว่า User ล็อกอินหรือยัง
    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode Payload
            const isExpired = Date.now() >= payload.exp * 1000; // ตรวจสอบเวลาหมดอายุ
            return !isExpired; // หาก Token ไม่หมดอายุ คืนค่า true
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    // ฟังก์ชันสำหรับการเข้าสู่ระบบ (ควรเชื่อมต่อกับ backend)
    login(token: string): void {
        try {
            // เก็บ Token ใน Local Storage
            sessionStorage.setItem('token', token);
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode Payload
            sessionStorage.setItem('userId', payload.userId); // เก็บ userId เพิ่มเติม
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    // ฟังก์ชันสำหรับออกจากระบบ
    logout(): void {
        sessionStorage.removeItem('token'); // ลบ Token
        sessionStorage.removeItem('userId'); // ลบ userId
    }
}
