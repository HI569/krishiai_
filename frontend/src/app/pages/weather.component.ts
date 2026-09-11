import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ForecastDay {
  dayName: string;
  date: string;
  condition: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  windSpeed: number; // km/h
  humidity: number; // %
  sprayRating: 'OPTIMAL' | 'MODERATE' | 'HIGH_RISK';
  sprayAdvice: string;
  irrigationAdvice: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="weather-page">
      
      <!-- HERO -->
      <section class="hero">
        <div>
          <span class="eyebrow">KRISHIAI • HYPER-LOCAL METEOROLOGY</span>
          <h1>Weather & Spray Window Advisory</h1>
          <p>AI-driven agro-forecast paired with precision chemical spraying windows, wind drift alerts, and irrigation schedules.</p>
        </div>
        <div class="hero-icon">🌦️</div>
      </section>

      <!-- CURRENT LIVE WEATHER HERO -->
      <div class="current-weather-hero">
        <div class="hero-main">
          <div class="weather-temp-block">
            <span class="main-icon">⛅</span>
            <div>
              <div class="temp-big">28°C</div>
              <div class="temp-sub">Partly Cloudy • Feels like 30°C</div>
            </div>
          </div>

          <div class="location-tag">
            <span>📍 Current Farm Location: <strong>Indore / Central Agro-Zone</strong></span>
            <span class="sync-time">● Live Synchronized</span>
          </div>
        </div>

        <div class="telemetry-grid">
          <div class="telem-item">
            <span class="telem-icon">💨</span>
            <span class="telem-val">8 km/h</span>
            <span class="telem-label">Wind (Gentle)</span>
          </div>
          <div class="telem-item">
            <span class="telem-icon">💧</span>
            <span class="telem-val">58%</span>
            <span class="telem-label">Air Humidity</span>
          </div>
          <div class="telem-item">
            <span class="telem-icon">🌧️</span>
            <span class="telem-val">10%</span>
            <span class="telem-label">Rain Chance</span>
          </div>
          <div class="telem-item">
            <span class="telem-icon">☀️</span>
            <span class="telem-val">6 (Mod)</span>
            <span class="telem-label">UV Index</span>
          </div>
        </div>
      </div>

      <!-- TODAY'S SPRAYING FEASIBILITY BANNER -->
      <div class="today-spray-banner banner-optimal">
        <div class="banner-badge">🟢 TODAY'S SPRAY ADVISORY: OPTIMAL WINDOW</div>
        <div class="banner-body">
          <p>
            <strong>Ideal Chemical & Foliar Spraying Conditions:</strong> Wind speed is under 10 km/h and no rain is predicted for the next 24 hours. 
            Best application window is between <strong>7:00 AM – 10:30 AM</strong> or <strong>4:30 PM – 6:30 PM</strong> to minimize evaporation.
          </p>
        </div>
      </div>

      <!-- 7-DAY FORECAST WITH SPRAY & IRRIGATION WINDOWS -->
      <div class="forecast-section">
        <h3>7-Day Agricultural Forecast & Operational Guidance:</h3>

        <div class="forecast-cards-grid">
          <div 
            class="day-card" 
            *ngFor="let day of forecast"
            [class.border-optimal]="day.sprayRating === 'OPTIMAL'"
            [class.border-moderate]="day.sprayRating === 'MODERATE'"
            [class.border-risk]="day.sprayRating === 'HIGH_RISK'"
          >
            <div class="day-head">
              <div>
                <strong>{{ day.dayName }}</strong>
                <span class="day-date">{{ day.date }}</span>
              </div>
              <span class="day-icon">{{ day.icon }}</span>
            </div>

            <div class="temp-row">
              <span class="max-temp">{{ day.tempMax }}°C</span>
              <span class="min-temp">{{ day.tempMin }}°C</span>
            </div>

            <div class="weather-metrics">
              <span>🌧️ {{ day.rainProb }}% Rain</span>
              <span>💨 {{ day.windSpeed }} km/h</span>
              <span>💧 {{ day.humidity }}%</span>
            </div>

            <!-- SPRAY STATUS BADGE -->
            <div class="spray-status-badge status-{{ day.sprayRating.toLowerCase() }}">
              <span *ngIf="day.sprayRating === 'OPTIMAL'">🟢 Safe to Spray</span>
              <span *ngIf="day.sprayRating === 'MODERATE'">🟡 Caution Spray</span>
              <span *ngIf="day.sprayRating === 'HIGH_RISK'">🔴 High Risk: DO NOT SPRAY</span>
            </div>

            <div class="spray-desc">
              {{ day.sprayAdvice }}
            </div>

            <div class="irrig-desc">
              🚰 <strong>Irrigation:</strong> {{ day.irrigationAdvice }}
            </div>
          </div>
        </div>
      </div>

      <!-- RAIN WARNING ADVISORY -->
      <div class="smart-tips-card">
        <h4>💡 Agronomist Rule of Thumb for Chemical Spraying:</h4>
        <ul>
          <li><strong>Rainfastness:</strong> Most fungicides and pesticides need <strong>at least 4 to 6 dry hours</strong> after foliar application to be absorbed by leaf stomata.</li>
          <li><strong>Wind Drift Danger:</strong> Never spray when wind exceeds 15 km/h to prevent dangerous drift onto neighboring fields.</li>
          <li><strong>Temperature Inversion:</strong> Avoid midday spraying above 32°C as droplet evaporation drastically lowers pesticide efficiency.</li>
        </ul>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .weather-page {
      max-width: 1250px;
      margin: 0 auto;
      padding: 32px 20px 80px;
      color: #eef5ef;
    }

    /* HERO */
    .hero {
      margin: 0 auto 24px;
      padding: 34px;
      border: 1px solid rgba(124, 255, 111, 0.14);
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(28, 40, 31, 0.96), rgba(15, 22, 18, 0.96));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
    .eyebrow {
      display: block;
      color: #8cff78;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .hero h1 { margin: 8px 0 10px; font-size: clamp(2rem, 3.8vw, 3rem); color: #f3fff8; }
    .hero p { margin: 0; color: #aeb9b1; font-size: 1rem; max-width: 700px; line-height: 1.6; }
    .hero-icon {
      width: 82px;
      height: 82px;
      flex: 0 0 82px;
      display: grid;
      place-items: center;
      border-radius: 22px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.2);
      font-size: 2.3rem;
    }

    .current-weather-hero {
      background: linear-gradient(135deg, rgba(20, 34, 29, 0.98), rgba(11, 23, 19, 0.98));
      border: 1px solid rgba(125, 255, 111, 0.2);
      color: white;
      border-radius: 24px;
      padding: 26px 30px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 22px;
      margin-bottom: 22px;
    }

    .hero-main { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .weather-temp-block { display: flex; align-items: center; gap: 18px; }
    .main-icon { font-size: 52px; }
    .temp-big { font-size: 46px; font-weight: 900; line-height: 1; color: #7dff6f; text-shadow: 0 0 20px rgba(125, 255, 111, 0.3); }
    .temp-sub { font-size: 13.5px; color: #c4d7cc; margin-top: 6px; }
    .location-tag { text-align: right; }
    .location-tag strong { color: #8cff78; }
    .sync-time { display: block; font-size: 11px; color: #7dff6f; margin-top: 4px; font-weight: 700; }

    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 16px;
      padding: 16px;
    }

    .telem-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .telem-icon { font-size: 22px; }
    .telem-val { font-size: 17px; font-weight: 800; margin-top: 4px; color: #f3fff8; }
    .telem-label { font-size: 11px; color: #829087; margin-top: 2px; }

    .today-spray-banner {
      border-radius: 20px;
      padding: 20px 24px;
      margin-bottom: 24px;
      background: rgba(125, 255, 111, 0.08);
      border: 1px solid rgba(125, 255, 111, 0.3);
      box-shadow: 0 0 25px rgba(125, 255, 111, 0.1);
    }

    .banner-optimal { color: #f3fff8; }
    .banner-badge { font-size: 12px; font-weight: 900; letter-spacing: 1px; color: #7dff6f; margin-bottom: 8px; }
    .banner-body p { margin: 0; font-size: 14px; line-height: 1.6; color: #c4d7cc; }

    .forecast-section h3 { font-size: 18px; font-weight: 800; color: #f3fff8; margin-bottom: 18px; }
    .forecast-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .day-card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
    }
    .day-card:hover {
      transform: translateY(-2px);
    }

    .border-optimal { border-color: rgba(125, 255, 111, 0.4); }
    .border-moderate { border-color: rgba(255, 209, 102, 0.4); }
    .border-risk { border-color: rgba(255, 107, 107, 0.4); background: #161213; }

    .day-head { display: flex; justify-content: space-between; align-items: center; }
    .day-head strong { font-size: 15px; color: #f3fff8; display: block; }
    .day-date { font-size: 11.5px; color: #829087; }
    .day-icon { font-size: 28px; }

    .temp-row { display: flex; gap: 8px; align-items: baseline; }
    .max-temp { font-size: 22px; font-weight: 900; color: #f3fff8; }
    .min-temp { font-size: 14px; color: #829087; }

    .weather-metrics {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: #aeb9b1;
      background: #0d130f;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid #26332b;
    }

    .spray-status-badge {
      font-size: 11.5px;
      font-weight: 800;
      padding: 5px 9px;
      border-radius: 10px;
      text-align: center;
    }

    .status-optimal { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
    .status-moderate { background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .status-high_risk { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }

    .spray-desc { font-size: 12px; color: #c4d7cc; line-height: 1.5; }
    .irrig-desc { font-size: 12px; color: #7dd3fc; background: #0c1720; border: 1px solid #1e3a5f; padding: 8px 10px; border-radius: 10px; line-height: 1.4; }

    .smart-tips-card {
      margin-top: 28px;
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 22px 26px;
    }

    .smart-tips-card h4 { margin: 0 0 12px; font-size: 14px; color: #8cff78; font-weight: 800; }
    .smart-tips-card ul { margin: 0; padding-left: 20px; font-size: 13px; color: #aeb9b1; line-height: 1.8; }
    @media (max-width: 650px) {
      .hero { padding: 22px 18px; }
      .hero-icon { display: none; }
      .telemetry-grid { grid-template-columns: 1fr 1fr; }
      .hero-main { flex-direction: column; align-items: flex-start; }
      .location-tag { text-align: left; }
    }
  `]
})
export class WeatherComponent implements OnInit {

  forecast: ForecastDay[] = [
    {
      dayName: 'Today (Tue)',
      date: 'Sep 10',
      condition: 'Partly Cloudy',
      icon: '⛅',
      tempMax: 28,
      tempMin: 20,
      rainProb: 10,
      windSpeed: 8,
      humidity: 58,
      sprayRating: 'OPTIMAL',
      sprayAdvice: 'Ideal morning spray window (7 AM - 10:30 AM). Low drift risk.',
      irrigationAdvice: 'Regular scheduled irrigation can proceed.'
    },
    {
      dayName: 'Wednesday',
      date: 'Sep 11',
      condition: 'Sunny & Clear',
      icon: '☀️',
      tempMax: 30,
      tempMin: 21,
      rainProb: 5,
      windSpeed: 9,
      humidity: 52,
      sprayRating: 'OPTIMAL',
      sprayAdvice: 'Excellent spray window. Apply planned foliar micro-nutrients.',
      irrigationAdvice: 'Apply light evening watering for vegetable crops.'
    },
    {
      dayName: 'Thursday',
      date: 'Sep 12',
      condition: 'Heavy Rain Alert',
      icon: '⛈️',
      tempMax: 26,
      tempMin: 19,
      rainProb: 85,
      windSpeed: 24,
      humidity: 88,
      sprayRating: 'HIGH_RISK',
      sprayAdvice: 'DO NOT SPRAY. High wash-off danger and heavy chemical drift.',
      irrigationAdvice: 'SKIP IRRIGATION. Natural rain will provide ample root moisture.'
    },
    {
      dayName: 'Friday',
      date: 'Sep 13',
      condition: 'Light Showers',
      icon: '🌦️',
      tempMax: 27,
      tempMin: 20,
      rainProb: 45,
      windSpeed: 14,
      humidity: 80,
      sprayRating: 'MODERATE',
      sprayAdvice: 'Spray only systemic fungicides if emergency disease flare up.',
      irrigationAdvice: 'Keep field drainage gates open to avoid waterlogging.'
    },
    {
      dayName: 'Saturday',
      date: 'Sep 14',
      condition: 'Clear Skies',
      icon: '🌤️',
      tempMax: 29,
      tempMin: 21,
      rainProb: 10,
      windSpeed: 7,
      humidity: 60,
      sprayRating: 'OPTIMAL',
      sprayAdvice: 'Post-rain spray window. Apply preventative Neem oil/fungicide.',
      irrigationAdvice: 'Soil holds adequate residual moisture.'
    },
    {
      dayName: 'Sunday',
      date: 'Sep 15',
      condition: 'Warm & Sunny',
      icon: '☀️',
      tempMax: 31,
      tempMin: 22,
      rainProb: 0,
      windSpeed: 6,
      humidity: 50,
      sprayRating: 'OPTIMAL',
      sprayAdvice: 'Safe all-day spray window. High absorption efficiency.',
      irrigationAdvice: 'Normal irrigation cycle.'
    },
    {
      dayName: 'Monday',
      date: 'Sep 16',
      condition: 'Overcast',
      icon: '☁️',
      tempMax: 29,
      tempMin: 21,
      rainProb: 20,
      windSpeed: 11,
      humidity: 65,
      sprayRating: 'OPTIMAL',
      sprayAdvice: 'Favorable spray conditions. Calm wind.',
      irrigationAdvice: 'Standard fertigation allowed.'
    }
  ];

  ngOnInit(): void {}
}
