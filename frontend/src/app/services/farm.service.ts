import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CropResult {
  crop: string;
  suitability: number;
  ph: string;
  temperature: string;
  rainfall: string;
  npk: string;
  season: string;
  water: string;
  info: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  private api = inject(ApiService);

  // =========================
  // FIND MY CROP
  // =========================
  recommend(input: any): Observable<any> {
    return this.api.post('/crop/recommend', input);
  }

  // =========================
  // CHECK SOIL
  // Backend expects:
  // GET /soil/analyze?lat=...&lon=...
  // =========================
analyzeSoil(lat: number, lon: number): Observable<any> {
  return this.api.get(
    '/soil/analyze?lat=' + encodeURIComponent(lat) +
    '&lon=' + encodeURIComponent(lon)
  );
}

  // =========================
  // DISEASE DETECTION
  // =========================
  disease(form: FormData): Observable<any> {
    return this.api.post('/disease/predict', form);
  }

  // =========================
  // AI ASSISTANT
  // =========================
  chat(input: any): Observable<any> {
    return this.api.post('/ai/chat', input);
  }

  // =========================
  // WEATHER
  // =========================
  weather(lat: number, lon: number): Observable<any> {
    return this.api.get(
      '/weather?lat=' +
      encodeURIComponent(lat.toString()) +
      '&lon=' +
      encodeURIComponent(lon.toString())
    );
  }
}