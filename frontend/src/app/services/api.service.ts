import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private get baseUrl(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // On any deployed cloud domain (e.g. onrender.com, vercel.app, etc.)
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return '/api';
      }
      // On local Angular dev server (:4200)
      if (window.location.port === '4200') {
        return 'http://127.0.0.1:8001/api';
      }
      // Direct local production / container
      return '/api';
    }
    return '/api';
  }

  constructor(private http: HttpClient) {}

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(
      this.baseUrl + path,
      body
    );
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(
      this.baseUrl + path
    );
  }
}
