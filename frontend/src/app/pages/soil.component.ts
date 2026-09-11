import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-soil',
  standalone: true,
  imports: [CommonModule, RouterLink],

  template: `
    <div class="page">

      <div class="container">

        <!-- HERO -->
        <section class="hero">
          <div>
            <span class="eyebrow">KRISHIAI • SUB-SURFACE TELEMETRY</span>
            <h1>Soil Health & Multi-Depth Telemetry</h1>
            <p>
              Get real-time sub-surface soil moisture, temperature at multiple depths, and global SoilGrids parameters for your farm.
            </p>
          </div>
          <div class="hero-icon">🧪</div>
        </section>

        <!-- LOCATION CARD -->
        <section class="location-card">

          <div class="location-title">
            <div>
              <h2>📍 Your Farm Location</h2>
              <p>
                Allow GPS access to analyze conditions at your actual geolocation.
              </p>
            </div>

            <button
              class="gps-btn"
              (click)="getLocation()"
              [disabled]="loading"
            >
              {{ loading ? 'Locating...' : '📍 Use My Location' }}
            </button>
          </div>

          <div
            class="coordinates"
            *ngIf="latitude !== null && longitude !== null"
          >
            <div class="coordinate-box">
              <span>Latitude</span>
              <strong>{{ latitude | number:'1.5-5' }}</strong>
            </div>

            <div class="coordinate-box">
              <span>Longitude</span>
              <strong>{{ longitude | number:'1.5-5' }}</strong>
            </div>

            <div class="coordinate-box">
              <span>Elevation</span>
              <strong>
                {{ data?.location?.elevation ?? '—' }}
                <small>m</small>
              </strong>
            </div>

            <div class="coordinate-box">
              <span>Timezone</span>
              <strong>
                {{ data?.location?.timezone ?? '—' }}
              </strong>
            </div>
          </div>

          <div
            class="location-placeholder"
            *ngIf="latitude === null"
          >
            <div class="big-pin">📍</div>
            <h3>Location Not Connected</h3>
            <p>
              Click <b>Use My Location</b> to sync real-time soil and weather telemetry.
            </p>
          </div>

        </section>

        <!-- ERROR -->
        <div class="error" *ngIf="error">
          <span>⚠️</span>
          <div>
            <strong>Unable to get soil data</strong>
            <p>{{ error }}</p>
          </div>
        </div>

        <!-- RESULTS -->
        <ng-container *ngIf="data">

          <!-- CURRENT CONDITIONS -->
          <section class="section">

            <div class="section-heading">
              <div>
                <h2>🌦️ Live Atmospheric & Surface Telemetry</h2>
                <p>
                  Synchronized atmospheric values returned for your coordinates.
                </p>
              </div>

              <button
                class="refresh"
                (click)="refresh()"
                [disabled]="loading"
              >
                ↻ Refresh Live
              </button>
            </div>

            <div class="cards">
              <div class="data-card">
                <div class="card-icon">🌡️</div>
                <div>
                  <span>Air Temperature</span>
                  <strong>{{ weather('temperature') }}°C</strong>
                </div>
              </div>

              <div class="data-card">
                <div class="card-icon">💧</div>
                <div>
                  <span>Humidity</span>
                  <strong>{{ weather('relative_humidity') }}%</strong>
                </div>
              </div>

              <div class="data-card">
                <div class="card-icon">🌧️</div>
                <div>
                  <span>Precipitation</span>
                  <strong>{{ weather('precipitation') }} mm</strong>
                </div>
              </div>

              <div class="data-card">
                <div class="card-icon">💨</div>
                <div>
                  <span>Wind Velocity</span>
                  <strong>{{ weather('wind_speed') }} km/h</strong>
                </div>
              </div>
            </div>

          </section>

          <!-- SOIL MOISTURE AT DEPTHS -->
          <section class="section">

            <div class="section-heading">
              <div>
                <h2>🌱 Volumetric Soil Moisture by Stratum</h2>
                <p>
                  Root-zone moisture gradient from surface soil to deep aquifer layers.
                </p>
              </div>
            </div>

            <div class="soil-grid">
              <div class="soil-card">
                <div class="soil-depth">0 – 7 cm (Surface)</div>
                <span>Topsoil Moisture</span>
                <strong>{{ moisturePercent('soil_moisture_0_to_7cm') }}<small>%</small></strong>
                <div class="bar">
                  <div [style.width]="moistureWidth(soil('soil_moisture_0_to_7cm'))"></div>
                </div>
              </div>

              <div class="soil-card">
                <div class="soil-depth">7 – 28 cm (Root Zone)</div>
                <span>Root Zone Moisture</span>
                <strong>{{ moisturePercent('soil_moisture_7_to_28cm') }}<small>%</small></strong>
                <div class="bar">
                  <div [style.width]="moistureWidth(soil('soil_moisture_7_to_28cm'))"></div>
                </div>
              </div>

              <div class="soil-card">
                <div class="soil-depth">28 – 100 cm (Subsoil)</div>
                <span>Subsoil Moisture</span>
                <strong>{{ moisturePercent('soil_moisture_28_to_100cm') }}<small>%</small></strong>
                <div class="bar">
                  <div [style.width]="moistureWidth(soil('soil_moisture_28_to_100cm'))"></div>
                </div>
              </div>
            </div>

          </section>

          <!-- MAPPED SOIL -->
          <section class="section">

            <div class="section-heading">
              <div>
                <h2>🧪 Mapped Soil Properties (SoilGrids Global)</h2>
                <p>
                  Geographic texture class, pH, and organic carbon benchmarks.
                </p>
              </div>
            </div>

            <div class="mapped-card">
              <div class="mapped-status">
                <span>🌍</span>
                <div>
                  <strong>SoilGrids 250m Global Map</strong>
                  <p>
                    Mapped properties (pH, clay, sand, organic carbon) calibrated for precision nutrient management.
                  </p>
                </div>
              </div>

              <div class="property-grid">
                <div>
                  <span>Soil pH</span>
                  <strong>{{ mapped('ph') || '6.7' }}</strong>
                </div>

                <div>
                  <span>Clay Content</span>
                  <strong>{{ mapped('clay') || '28%' }}</strong>
                </div>

                <div>
                  <span>Sand Content</span>
                  <strong>{{ mapped('sand') || '42%' }}</strong>
                </div>

                <div>
                  <span>Silt Content</span>
                  <strong>{{ mapped('silt') || '30%' }}</strong>
                </div>

                <div>
                  <span>Organic Carbon</span>
                  <strong>{{ mapped('organic_carbon') || '0.74%' }}</strong>
                </div>
              </div>
            </div>

          </section>

          <!-- FARM INSIGHT -->
          <section class="insight">
            <div class="insight-icon">🌾</div>
            <div>
              <h2>Farm Agronomic Insight</h2>
              <p>
                Your soil moisture and temperature are calculated from continuous geographic telemetry. Root zone moisture above 35% ensures low evapotranspiration stress.
              </p>
              <p class="small">
                Cross-reference with our <a routerLink="/fertilizer" style="color: #7dff6f;">Fertilizer Advisor</a> to determine exact NPK bag application.
              </p>
            </div>
          </section>

        </ng-container>

      </div>

    </div>
  `,

  styles: [`
    * { box-sizing: border-box; }

    .page {
      min-height: calc(100vh - 70px);
      padding: 32px 20px 80px;
      color: #eef5ef;
    }

    .container {
      width: 100%;
      max-width: 1250px;
      margin: 0 auto;
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

    .hero h1 {
      margin: 8px 0 10px;
      font-size: clamp(2rem, 3.8vw, 3rem);
      color: #f3fff8;
    }

    .hero p {
      margin: 0;
      color: #aeb9b1;
      font-size: 1rem;
      max-width: 700px;
      line-height: 1.6;
    }

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

    .location-card,
    .section,
    .insight {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
    }

    .location-card {
      padding: 26px;
      margin-bottom: 24px;
    }

    .location-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .location-title h2,
    .section-heading h2,
    .insight h2 {
      margin: 0;
      font-size: 20px;
      color: #f3fff8;
    }

    .location-title p,
    .section-heading p {
      margin: 6px 0 0;
      color: #8c9e94;
      font-size: 13.5px;
    }

    .gps-btn,
    .refresh {
      border: none;
      cursor: pointer;
      font-weight: 800;
      border-radius: 12px;
      transition: all .2s;
    }

    .gps-btn {
      padding: 13px 22px;
      background: #7dff6f;
      color: #071007;
      white-space: nowrap;
    }

    .gps-btn:hover {
      background: #9aff8f;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(125, 255, 111, 0.25);
    }

    .gps-btn:disabled,
    .refresh:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .coordinates {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-top: 22px;
    }

    .coordinate-box {
      padding: 16px;
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 14px;
    }

    .coordinate-box span,
    .data-card span,
    .soil-card span,
    .property-grid span {
      display: block;
      color: #829087;
      font-size: 12px;
      margin-bottom: 6px;
    }

    .coordinate-box strong {
      color: #7dff6f;
      font-size: 16px;
      word-break: break-word;
    }

    .coordinate-box small,
    .data-card small,
    .soil-card small {
      font-size: 13px;
      font-weight: 600;
      color: #8c9e94;
    }

    .location-placeholder {
      text-align: center;
      padding: 35px 20px 15px;
      color: #8c9e94;
    }

    .big-pin {
      font-size: 42px;
      margin-bottom: 10px;
    }

    .location-placeholder h3 {
      margin: 0 0 7px;
      color: #f3fff8;
    }

    .error {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 16px 20px;
      margin-bottom: 24px;
      border-radius: 14px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    .section {
      padding: 26px;
      margin-bottom: 24px;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .refresh {
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      color: #7dff6f;
      padding: 10px 18px;
    }
    .refresh:hover {
      background: #7dff6f;
      color: #071007;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .data-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 18px;
      border: 1px solid #26332b;
      border-radius: 16px;
      background: #0d130f;
    }

    .data-card strong {
      color: #f3fff8;
      font-size: 24px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      font-size: 24px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.18);
      flex-shrink: 0;
    }

    .soil-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .soil-card {
      padding: 20px;
      border: 1px solid #26332b;
      border-radius: 16px;
      background: #0d130f;
    }

    .soil-depth {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.25);
      color: #7dff6f;
      font-size: 11.5px;
      font-weight: 800;
      margin-bottom: 14px;
    }

    .soil-card strong {
      display: block;
      color: #f3fff8;
      font-size: 28px;
      margin-bottom: 12px;
    }

    .bar {
      height: 8px;
      border-radius: 10px;
      background: #182720;
      overflow: hidden;
    }

    .bar div {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #1bc77e, #50f5aa);
      transition: width .4s ease;
    }

    .mapped-card {
      padding: 22px;
      border-radius: 16px;
      background: #0d130f;
      border: 1px solid #26332b;
    }

    .mapped-status {
      display: flex;
      gap: 14px;
      padding-bottom: 18px;
      border-bottom: 1px solid #26332b;
    }

    .mapped-status > span {
      font-size: 30px;
    }

    .mapped-status strong {
      color: #f3fff8;
      font-size: 15px;
    }

    .mapped-status p {
      margin: 4px 0 0;
      color: #8c9e94;
      font-size: 13px;
      line-height: 1.5;
    }

    .property-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-top: 18px;
    }

    .property-grid > div {
      padding: 14px;
      background: #121815;
      border: 1px solid #26332b;
      border-radius: 12px;
      text-align: center;
    }

    .property-grid strong {
      color: #7dff6f;
      font-size: 18px;
    }

    .insight {
      display: flex;
      gap: 20px;
      padding: 26px;
    }

    .insight-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.2);
      border-radius: 16px;
      font-size: 28px;
      flex-shrink: 0;
    }

    .insight p {
      color: #c4d7cc;
      line-height: 1.6;
      margin: 8px 0 0;
      font-size: 14px;
    }

    .insight .small {
      font-size: 12.5px;
      color: #8c9e94;
      margin-top: 6px;
    }

    @media (max-width: 900px) {

      .coordinates,
      .cards,
      .soil-grid,
      .property-grid {
        grid-template-columns: 1fr;
      }

      .location-card,
      .section {
        padding: 20px;
      }
    }

  `]
})
export class SoilComponent {

  private farmService = inject(FarmService);

  latitude: number | null = null;
  longitude: number | null = null;

  loading = false;
  error = '';

  data: any = null;


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

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.loadSoilData(
          this.latitude,
          this.longitude
        );
      },

      error => {

        this.loading = false;

        switch (error.code) {

          case error.PERMISSION_DENIED:
            this.error =
              'Location permission was denied. Please allow location access in your browser.';
            break;

          case error.POSITION_UNAVAILABLE:
            this.error =
              'Your location could not be determined.';
            break;

          case error.TIMEOUT:
            this.error =
              'Location request timed out. Please try again.';
            break;

          default:
            this.error =
              'Unable to determine your location.';
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }


  loadSoilData(
    lat: number,
    lon: number
  ): void {

    this.loading = true;
    this.error = '';

this.farmService.analyzeSoil(lat, lon)
      .subscribe({

        next: response => {

          this.loading = false;

          if (!response) {
            this.error =
              'The backend returned no data.';
            return;
          }

          this.data = response;

          console.log(
            'Live soil/weather response:',
            response
          );
        },

        error: err => {

          this.loading = false;

          console.error(
            'Soil API error:',
            err
          );

          this.error =
            err?.error?.detail || 'Unable to synchronize soil telemetry. Please tap Refresh Live.';
        }
      });
  }


  refresh(): void {

    if (
      this.latitude === null ||
      this.longitude === null
    ) {
      this.getLocation();
      return;
    }

    this.loadSoilData(
      this.latitude,
      this.longitude
    );
  }


  current(key: string): any {

    return this.data?.current?.[key] ?? null;
  }


  soil(key: string): any {

    return this.data?.soil?.[key] ?? null;
  }


  mapped(key: string): string {

    const value =
      this.data?.mapped_soil?.[key];

    if (
      value === null ||
      value === undefined
    ) {
      return 'Not available';
    }

    return String(value);
  }


  moisturePercent(key: string): string {

    const value = this.soil(key);

    if (
      value === null ||
      value === undefined
    ) {
      return '—';
    }

    return (Number(value) * 100).toFixed(1);
  }


  moistureWidth(key: string): string {

    const value = this.soil(key);

    if (
      value === null ||
      value === undefined
    ) {
      return '0%';
    }

    const percentage =
      Math.min(
        Math.max(Number(value) * 100, 0),
        100
      );

    return `${percentage}%`;
  }


  temperatureWidth(value: any): string {

    if (
      value === null ||
      value === undefined
    ) {
      return '0%';
    }

    const temperature =
      Number(value);

    const percentage =
      Math.min(
        Math.max(
          ((temperature + 10) / 60) * 100,
          0
        ),
        100
      );

    return `${percentage}%`;
  }
}
