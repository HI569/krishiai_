import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],

  template: `
    <section class="page">

      <!-- HEADER -->
      <div class="page-head">

        <div>
          <div class="eyebrow">MY FARM</div>

          <h1>My Farm Dashboard</h1>

          <p>
            Live farm conditions based on your current GPS location.
          </p>
        </div>

        <button
          class="location-btn"
          type="button"
          (click)="getLocation()"
          [disabled]="loading"
        >
          📍
          {{ loading ? 'Getting live data...' : 'Refresh My Location' }}
        </button>

      </div>


      <!-- ERROR -->
      <div class="error" *ngIf="error">
        <strong>⚠ Unable to get live farm data</strong>
        <span>{{ error }}</span>
      </div>


      <!-- LOCATION -->
      <div class="card location-card">

        <div class="card-title">

          <div>
            <span>📍 Your Farm Location</span>

            <small *ngIf="lastUpdated">
              Live data • Updated {{ lastUpdated | date:'mediumTime' }}
            </small>
          </div>

          <span
            class="live"
            *ngIf="farmData"
          >
            <i></i> LIVE
          </span>

        </div>


        <div class="location-grid">

          <div class="info-box">
            <small>Latitude</small>

            <strong>
              {{ latitude !== null ? latitude.toFixed(5) : '—' }}
            </strong>
          </div>


          <div class="info-box">
            <small>Longitude</small>

            <strong>
              {{ longitude !== null ? longitude.toFixed(5) : '—' }}
            </strong>
          </div>


          <div class="info-box">
            <small>Elevation</small>

            <strong>
              {{ elevation !== null ? elevation + ' m' : '—' }}
            </strong>
          </div>


          <div class="info-box">
            <small>Timezone</small>

            <strong>
              {{ timezone || '—' }}
            </strong>
          </div>

        </div>

      </div>


      <!-- WEATHER -->
      <div class="section-heading">
        <div>
          <div class="eyebrow">REAL-TIME CONDITIONS</div>
          <h2>Weather at Your Farm</h2>
        </div>

        <span class="source">
          🌐 Live geographic data
        </span>
      </div>


      <div class="stats-grid">

        <div class="stat-card">

          <div class="stat-icon">🌡️</div>

          <div>
            <small>Temperature</small>

            <strong>
              {{ temperature !== null ? temperature + ' °C' : '—' }}
            </strong>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">💧</div>

          <div>
            <small>Humidity</small>

            <strong>
              {{ humidity !== null ? humidity + ' %' : '—' }}
            </strong>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">🌧️</div>

          <div>
            <small>Rainfall</small>

            <strong>
              {{ rainfall !== null ? rainfall + ' mm' : '—' }}
            </strong>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">💨</div>

          <div>
            <small>Wind Speed</small>

            <strong>
              {{ windSpeed !== null ? windSpeed + ' km/h' : '—' }}
            </strong>
          </div>

        </div>

      </div>


      <!-- SOIL -->
      <div class="section-heading">

        <div>
          <div class="eyebrow">SOIL HEALTH</div>
          <h2>Live Soil Conditions</h2>
        </div>

        <a routerLink="/soil">
          Open Soil Health →
        </a>

      </div>


      <div class="soil-grid">

        <div class="soil-card">

          <div class="soil-top">
            <span>🌱</span>

            <div>
              <small>Surface Soil Moisture</small>

              <strong>
                {{ soilMoisture !== null
                    ? soilMoisture + ' %'
                    : '—' }}
              </strong>
            </div>
          </div>

          <div class="progress">
            <span
              [style.width.%]="soilMoisture || 0"
            ></span>
          </div>

          <p>
            Live moisture reading from the geographic soil/weather
            data source.
          </p>

        </div>


        <div class="soil-card">

          <div class="soil-top">
            <span>🌡️</span>

            <div>
              <small>Soil Temperature</small>

              <strong>
                {{ soilTemperature !== null
                    ? soilTemperature + ' °C'
                    : '—' }}
              </strong>
            </div>
          </div>

          <div class="soil-depths">

            <div>
              <small>0 cm</small>
              <b>{{ soilTemp0 !== null ? soilTemp0 + '°C' : '—' }}</b>
            </div>

            <div>
              <small>6 cm</small>
              <b>{{ soilTemp6 !== null ? soilTemp6 + '°C' : '—' }}</b>
            </div>

            <div>
              <small>18 cm</small>
              <b>{{ soilTemp18 !== null ? soilTemp18 + '°C' : '—' }}</b>
            </div>

            <div>
              <small>54 cm</small>
              <b>{{ soilTemp54 !== null ? soilTemp54 + '°C' : '—' }}</b>
            </div>

          </div>

        </div>


        <div class="soil-card">

          <div class="soil-top">
            <span>🧪</span>

            <div>
              <small>Mapped Soil Properties</small>

              <strong>
                {{ mappedSoilAvailable
                  ? 'Available'
                  : 'Not connected' }}
              </strong>
            </div>
          </div>

          <p>
            {{
              mappedSoilMessage ||
              'Soil pH, sand, silt, clay and organic carbon require a connected soil-mapping data source.'
            }}
          </p>

          <a routerLink="/soil">
            View detailed soil analysis →
          </a>

        </div>

      </div>


      <!-- ACTIONS -->
      <div class="section-heading">

        <div>
          <div class="eyebrow">FARM INTELLIGENCE</div>
          <h2>What do you want to do?</h2>
        </div>

      </div>


      <div class="action-grid">

        <!-- CROP -->
        <a
          routerLink="/crop"
          class="action-card"
        >

          <div class="action-icon">🌾</div>

          <div>
            <h3>Find My Crop</h3>

            <p>
              Use your farm conditions to find suitable crops.
            </p>
          </div>

          <span>→</span>

        </a>


        <!-- SOIL -->
        <a
          routerLink="/soil"
          class="action-card"
        >

          <div class="action-icon">🌱</div>

          <div>
            <h3>Check Soil Health</h3>

            <p>
              Analyse live soil and environmental conditions.
            </p>
          </div>

          <span>→</span>

        </a>


        <!-- PLANT -->
        <a
          routerLink="/disease"
          class="action-card"
        >

          <div class="action-icon">🍃</div>

          <div>
            <h3>Check Plant</h3>

            <p>
              Upload a plant photo for disease analysis.
            </p>
          </div>

          <span>→</span>

        </a>


        <!-- AI -->
        <a
          routerLink="/assistant"
          class="action-card"
        >

          <div class="action-icon">🤖</div>

          <div>
            <h3>Ask AI</h3>

            <p>
              Ask questions about your farm and crops.
            </p>
          </div>

          <span>→</span>

        </a>

      </div>


      <!-- DATA STATUS -->
      <div
        class="data-status"
        *ngIf="farmData"
      >

        <div>
          <span class="green-dot"></span>

          <strong>
            Live farm data connected
          </strong>
        </div>

        <small>
          Location:
          {{ latitude?.toFixed(5) }},
          {{ longitude?.toFixed(5) }}
        </small>

      </div>


      <!-- EMPTY STATE -->
      <div
        class="empty-state"
        *ngIf="!farmData && !loading && !error"
      >

        <div class="empty-icon">📍</div>

        <h2>Connect your farm</h2>

        <p>
          Allow location access to load real-time weather
          and soil conditions for your farm.
        </p>

        <button
          class="location-btn large"
          type="button"
          (click)="getLocation()"
        >
          📍 Use My Current Location
        </button>

      </div>

    </section>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .page {
      min-height: calc(100vh - 80px);
      padding: 48px 5%;
      background: #f4f8f4;
      color: #073b2a;
    }

    .page-head {
      max-width: 1180px;
      margin: 0 auto 28px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
    }

    .eyebrow {
      color: #07834f;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.6px;
      margin-bottom: 8px;
    }

    h1 {
      margin: 0;
      font-size: 38px;
      line-height: 1.15;
      color: #063d2c;
    }

    .page-head p {
      margin: 10px 0 0;
      color: #61756d;
      font-size: 16px;
    }

    .location-btn {
      border: 0;
      border-radius: 12px;
      background: #07834f;
      color: white;
      padding: 14px 22px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(7, 131, 79, .18);
    }

    .location-btn:hover {
      background: #066b42;
    }

    .location-btn:disabled {
      opacity: .65;
      cursor: not-allowed;
    }

    .large {
      padding: 15px 28px;
    }

    .error {
      max-width: 1180px;
      margin: 0 auto 22px;
      padding: 17px 20px;
      border: 1px solid #ffc9c2;
      border-radius: 14px;
      background: #fff4f2;
      color: #a52b20;

      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .card {
      max-width: 1180px;
      margin: 0 auto 28px;
      background: white;
      border: 1px solid #e0e9e4;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 10px 35px rgba(20, 65, 45, .06);
    }

    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 22px;
    }

    .card-title > div {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .card-title > div > span,
    .card-title > span:first-child {
      font-size: 20px;
      font-weight: 800;
    }

    .card-title small {
      color: #70827b;
      font-size: 13px;
      font-weight: 500;
    }

    .card-title a,
    .section-heading a,
    .soil-card a {
      color: #07834f;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
    }

    .live {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #07834f;
      font-size: 12px;
      font-weight: 800;
    }

    .live i,
    .green-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #19a765;
      display: inline-block;
    }

    .location-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .info-box {
      background: #f6faf7;
      border: 1px solid #e0eae4;
      border-radius: 14px;
      padding: 18px;
    }

    .info-box small,
    .stat-card small,
    .soil-top small {
      display: block;
      color: #70827b;
      margin-bottom: 7px;
      font-size: 13px;
    }

    .info-box strong {
      font-size: 18px;
      color: #073b2a;
      word-break: break-word;
    }

    .section-heading {
      max-width: 1180px;
      margin: 38px auto 18px;

      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 20px;
    }

    .section-heading h2 {
      margin: 0;
      font-size: 25px;
      color: #073b2a;
    }

    .source {
      color: #70827b;
      font-size: 13px;
    }

    .stats-grid {
      max-width: 1180px;
      margin: 0 auto;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e0e9e4;
      border-radius: 17px;
      padding: 22px;

      display: flex;
      align-items: center;
      gap: 16px;

      box-shadow: 0 8px 25px rgba(20, 65, 45, .04);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 13px;
      background: #edf7f1;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 23px;
    }

    .stat-card strong {
      font-size: 24px;
      color: #073b2a;
    }

    .soil-grid {
      max-width: 1180px;
      margin: 0 auto;

      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 17px;
    }

    .soil-card {
      background: white;
      border: 1px solid #e0e9e4;
      border-radius: 17px;
      padding: 23px;

      box-shadow: 0 8px 25px rgba(20, 65, 45, .04);
    }

    .soil-top {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 18px;
    }

    .soil-top > span {
      font-size: 30px;
    }

    .soil-top strong {
      font-size: 24px;
      color: #073b2a;
    }

    .progress {
      width: 100%;
      height: 9px;
      border-radius: 20px;
      background: #e8efeb;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .progress span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: #07834f;
      transition: width .5s ease;
    }

    .soil-card p {
      color: #687b73;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }

    .soil-depths {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }

    .soil-depths div {
      padding: 10px 5px;
      text-align: center;
      border-radius: 9px;
      background: #f5f9f6;
    }

    .soil-depths small {
      display: block;
      color: #788b83;
      font-size: 11px;
      margin-bottom: 5px;
    }

    .soil-depths b {
      font-size: 13px;
    }

    .action-grid {
      max-width: 1180px;
      margin: 0 auto;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .action-card {
      min-height: 170px;
      background: white;
      border: 1px solid #e0e9e4;
      border-radius: 17px;
      padding: 22px;

      text-decoration: none;
      color: inherit;

      display: flex;
      flex-direction: column;
      gap: 14px;

      box-shadow: 0 8px 25px rgba(20, 65, 45, .04);
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .action-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(20, 65, 45, .10);
    }

    .action-icon {
      font-size: 29px;
    }

    .action-card h3 {
      margin: 0 0 7px;
      color: #073b2a;
      font-size: 18px;
    }

    .action-card p {
      margin: 0;
      color: #70827b;
      line-height: 1.5;
      font-size: 13px;
    }

    .action-card > span {
      margin-top: auto;
      color: #07834f;
      font-weight: 800;
      font-size: 18px;
    }

    .data-status {
      max-width: 1180px;
      margin: 25px auto 0;
      padding: 15px 18px;
      border: 1px solid #d7eadf;
      border-radius: 12px;
      background: #f1f9f4;

      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      color: #236247;
    }

    .data-status div {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .data-status small {
      color: #688078;
    }

    .empty-state {
      max-width: 700px;
      margin: 60px auto;
      padding: 50px 30px;
      background: white;
      border: 1px solid #e0e9e4;
      border-radius: 22px;
      text-align: center;
      box-shadow: 0 10px 35px rgba(20, 65, 45, .06);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }

    .empty-state h2 {
      margin: 0 0 10px;
      color: #073b2a;
    }

    .empty-state p {
      max-width: 500px;
      margin: 0 auto 24px;
      color: #70827b;
      line-height: 1.6;
    }

    @media (max-width: 950px) {

      .location-grid,
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .soil-grid {
        grid-template-columns: 1fr;
      }

      .action-grid {
        grid-template-columns: repeat(2, 1fr);
      }

    }

    @media (max-width: 650px) {

      .page {
        padding: 30px 18px;
      }

      .page-head {
        flex-direction: column;
        align-items: flex-start;
      }

      h1 {
        font-size: 31px;
      }

      .location-grid,
      .stats-grid,
      .action-grid {
        grid-template-columns: 1fr;
      }

      .section-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .data-status {
        flex-direction: column;
        align-items: flex-start;
      }

    }

  `]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private farmService = inject(FarmService);

  latitude: number | null = null;
  longitude: number | null = null;

  elevation: number | null = null;
  timezone = '';

  temperature: number | null = null;
  humidity: number | null = null;
  rainfall: number | null = null;
  windSpeed: number | null = null;

  soilMoisture: number | null = null;

  soilTemperature: number | null = null;
  soilTemp0: number | null = null;
  soilTemp6: number | null = null;
  soilTemp18: number | null = null;
  soilTemp54: number | null = null;

  mappedSoilAvailable = false;
  mappedSoilMessage = '';

  farmData: any = null;

  loading = false;
  error = '';

  lastUpdated: Date | null = null;

  private refreshTimer: any;


  ngOnInit(): void {

    this.getLocation();

  }


  ngOnDestroy(): void {

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

  }


  getLocation(): void {

    this.error = '';

    if (!navigator.geolocation) {

      this.error =
        'Geolocation is not supported by this browser.';

      return;

    }

    this.loading = true;

    navigator.geolocation.getCurrentPosition(

      position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.latitude = lat;
        this.longitude = lon;

        this.loadFarmData(lat, lon);

        /*
         * Refresh the live data every 15 minutes.
         */
        if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {

          if (
            this.latitude !== null &&
            this.longitude !== null
          ) {

            this.loadFarmData(
              this.latitude,
              this.longitude
            );

          }

        }, 15 * 60 * 1000);

      },

      error => {

        this.loading = false;

        if (error.code === 1) {

          this.error =
            'Location permission was denied. Please allow location access in your browser.';

        } else {

          this.error =
            'Could not determine your current location.';

        }

      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }

    );

  }


  loadFarmData(
    lat: number,
    lon: number
  ): void {

    this.loading = true;
    this.error = '';

    this.farmService
      .analyzeSoil(lat, lon)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Live farm data:',
            response
          );

          this.loading = false;

          if (!response) {

            this.error =
              'The backend returned no farm data.';

            return;

          }

          this.farmData = response;

          this.readResponse(response);

          this.lastUpdated = new Date();

        },

        error: (err: any) => {

          console.error(
            'Farm data error:',
            err
          );

          this.loading = false;

          this.error =
            'Could not connect to the KrishiAI backend. Make sure FastAPI is running on port 8000.';

        }

      });

  }


  private readResponse(response: any): void {

    const location =
      response.location || {};

    const current =
      response.current || {};

    const soil =
      response.soil || {};

    const mapped =
      response.mapped_soil || {};


    /*
     * LOCATION
     */

    this.latitude =
      this.toNumber(
        location.latitude,
        this.latitude
      );

    this.longitude =
      this.toNumber(
        location.longitude,
        this.longitude
      );

    this.elevation =
      this.toNumber(
        location.elevation,
        null
      );

    this.timezone =
      location.timezone || '—';


    /*
     * WEATHER
     */

    this.temperature =
      this.toNumber(
        current.temperature_2m,
        null
      );

    this.humidity =
      this.toNumber(
        current.relative_humidity_2m,
        null
      );

    this.rainfall =
      this.toNumber(
        current.rain,
        0
      );

    this.windSpeed =
      this.toNumber(
        current.wind_speed_10m,
        null
      );


    /*
     * SOIL MOISTURE
     *
     * API returns a value between
     * 0 and 1.
     *
     * Convert to percentage.
     */

    const moisture =
      this.toNumber(
        soil.soil_moisture_0_to_1cm,
        null
      );

    this.soilMoisture =
      moisture !== null
        ? Number((moisture * 100).toFixed(1))
        : null;


    /*
     * SOIL TEMPERATURE
     */

    this.soilTemperature =
      this.toNumber(
        soil.soil_temperature_0cm,
        null
      );

    this.soilTemp0 =
      this.toNumber(
        soil.soil_temperature_0cm,
        null
      );

    this.soilTemp6 =
      this.toNumber(
        soil.soil_temperature_6cm,
        null
      );

    this.soilTemp18 =
      this.toNumber(
        soil.soil_temperature_18cm,
        null
      );

    this.soilTemp54 =
      this.toNumber(
        soil.soil_temperature_54cm,
        null
      );


    /*
     * MAPPED SOIL
     */

    this.mappedSoilAvailable =
      mapped.status === 'success' ||
      mapped.status === 'available';

    this.mappedSoilMessage =
      mapped.message || '';

  }


  private toNumber(
    value: any,
    fallback: number | null
  ): number | null {

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : fallback;

  }

}