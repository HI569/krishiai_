import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-soil',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page">

      <div class="container">

        <!-- HEADER -->
        <section class="hero">
          <div class="hero-icon">🌱</div>

          <div>
            <h1>Check Soil</h1>

            <p>
              Get live soil and weather conditions using your
              current geographical location.
            </p>
          </div>
        </section>


        <!-- LOCATION CARD -->
        <section class="location-card">

          <div class="location-title">
            <div>
              <h2>📍 Your Farm Location</h2>

              <p>
                Allow GPS access to analyse conditions at your
                actual location.
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

            <h3>Location not selected</h3>

            <p>
              Click <b>Use My Location</b> to begin the analysis.
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
                <h2>🌦️ Live Conditions</h2>

                <p>
                  Current conditions returned for your coordinates.
                </p>
              </div>

              <button
                class="refresh"
                (click)="refresh()"
                [disabled]="loading"
              >
                ↻ Refresh
              </button>
            </div>


            <div class="cards">

              <div class="data-card">

                <div class="card-icon temperature">
                  🌡️
                </div>

                <div>
                  <span>Temperature</span>

                  <strong>
                    {{ current('temperature_2m') ?? '—' }}
                    <small>°C</small>
                  </strong>
                </div>

              </div>


              <div class="data-card">

                <div class="card-icon humidity">
                  💧
                </div>

                <div>
                  <span>Humidity</span>

                  <strong>
                    {{ current('relative_humidity_2m') ?? '—' }}
                    <small>%</small>
                  </strong>
                </div>

              </div>


              <div class="data-card">

                <div class="card-icon rain">
                  🌧️
                </div>

                <div>
                  <span>Rain</span>

                  <strong>
                    {{ current('rain') ?? '—' }}
                    <small>mm</small>
                  </strong>
                </div>

              </div>


              <div class="data-card">

                <div class="card-icon wind">
                  💨
                </div>

                <div>
                  <span>Wind Speed</span>

                  <strong>
                    {{ current('wind_speed_10m') ?? '—' }}
                    <small>km/h</small>
                  </strong>
                </div>

              </div>

            </div>

          </section>


          <!-- SOIL CONDITIONS -->
          <section class="section">

            <div class="section-heading">
              <div>
                <h2>🌱 Soil Conditions</h2>

                <p>
                  Modelled soil temperature and moisture at
                  different depths.
                </p>
              </div>
            </div>


            <div class="soil-grid">

              <div class="soil-card">

                <div class="soil-depth">
                  Surface
                </div>

                <span>Temperature</span>

                <strong>
                  {{ soil('soil_temperature_0cm') ?? '—' }}
                  <small>°C</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      temperatureWidth(
                        soil('soil_temperature_0cm')
                      )
                    "
                  ></div>
                </div>

              </div>


              <div class="soil-card">

                <div class="soil-depth">
                  0–1 cm
                </div>

                <span>Moisture</span>

                <strong>
                  {{ moisturePercent('soil_moisture_0_to_1cm') }}
                  <small>%</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      moistureWidth(
                        soil('soil_moisture_0_to_1cm')
                      )
                    "
                  ></div>
                </div>

              </div>


              <div class="soil-card">

                <div class="soil-depth">
                  1–3 cm
                </div>

                <span>Moisture</span>

                <strong>
                  {{ moisturePercent('soil_moisture_1_to_3cm') }}
                  <small>%</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      moistureWidth(
                        soil('soil_moisture_1_to_3cm')
                      )
                    "
                  ></div>
                </div>

              </div>


              <div class="soil-card">

                <div class="soil-depth">
                  3–9 cm
                </div>

                <span>Moisture</span>

                <strong>
                  {{ moisturePercent('soil_moisture_3_to_9cm') }}
                  <small>%</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      moistureWidth(
                        soil('soil_moisture_3_to_9cm')
                      )
                    "
                  ></div>
                </div>

              </div>


              <div class="soil-card">

                <div class="soil-depth">
                  9–27 cm
                </div>

                <span>Moisture</span>

                <strong>
                  {{ moisturePercent('soil_moisture_9_to_27cm') }}
                  <small>%</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      moistureWidth(
                        soil('soil_moisture_9_to_27cm')
                      )
                    "
                  ></div>
                </div>

              </div>


              <div class="soil-card">

                <div class="soil-depth">
                  27–81 cm
                </div>

                <span>Moisture</span>

                <strong>
                  {{ moisturePercent('soil_moisture_27_to_81cm') }}
                  <small>%</small>
                </strong>

                <div class="bar">
                  <div
                    [style.width]="
                      moistureWidth(
                        soil('soil_moisture_27_to_81cm')
                      )
                    "
                  ></div>
                </div>

              </div>

            </div>

          </section>


          <!-- MAPPED SOIL -->
          <section class="section">

            <div class="section-heading">
              <div>
                <h2>🧪 Mapped Soil Properties</h2>

                <p>
                  Geographical soil information for this location.
                </p>
              </div>
            </div>


            <div class="mapped-card">

              <div class="mapped-status">
                <span>🌍</span>

                <div>
                  <strong>
                    SoilGrids integration
                  </strong>

                  <p>
                    Mapped soil properties such as pH, clay,
                    sand and organic carbon will be retrieved
                    from the global soil dataset when connected.
                  </p>
                </div>
              </div>


              <div class="property-grid">

                <div>
                  <span>Soil pH</span>
                  <strong>
                    {{ mapped('ph') }}
                  </strong>
                </div>

                <div>
                  <span>Clay</span>
                  <strong>
                    {{ mapped('clay') }}
                  </strong>
                </div>

                <div>
                  <span>Sand</span>
                  <strong>
                    {{ mapped('sand') }}
                  </strong>
                </div>

                <div>
                  <span>Silt</span>
                  <strong>
                    {{ mapped('silt') }}
                  </strong>
                </div>

                <div>
                  <span>Organic Carbon</span>
                  <strong>
                    {{ mapped('organic_carbon') }}
                  </strong>
                </div>

              </div>

            </div>

          </section>


          <!-- FARM INSIGHT -->
          <section class="insight">

            <div class="insight-icon">
              🌾
            </div>

            <div>
              <h2>Farm Insight</h2>

              <p>
                Your soil moisture and weather conditions are
                calculated from the geographical coordinates
                provided by your device.
              </p>

              <p class="small">
                Use this information together with field
                observations or laboratory soil testing before
                making important fertilizer or irrigation decisions.
              </p>
            </div>

          </section>

        </ng-container>

      </div>

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .page {
      min-height: calc(100vh - 70px);
      background: #f5f8f5;
      padding: 40px 24px 70px;
    }

    .container {
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
    }

    .hero {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 28px;
    }

    .hero-icon {
      width: 62px;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: #e3f4e9;
      font-size: 30px;
      flex-shrink: 0;
    }

    h1 {
      margin: 0;
      color: #123c2d;
      font-size: 36px;
      line-height: 1.2;
    }

    .hero p {
      margin: 8px 0 0;
      color: #66766f;
      font-size: 16px;
    }

    .location-card,
    .section,
    .insight {
      background: white;
      border: 1px solid #e3ebe6;
      border-radius: 18px;
      box-shadow: 0 8px 28px rgba(24, 55, 39, 0.06);
    }

    .location-card {
      padding: 28px;
      margin-bottom: 30px;
    }

    .location-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .location-title h2,
    .section-heading h2,
    .insight h2 {
      margin: 0;
      color: #153d2e;
    }

    .location-title p,
    .section-heading p {
      margin: 7px 0 0;
      color: #718078;
      font-size: 14px;
    }

    .gps-btn,
    .refresh {
      border: none;
      cursor: pointer;
      font-weight: 600;
      border-radius: 10px;
      transition: .2s;
    }

    .gps-btn {
      padding: 13px 20px;
      background: #087f4e;
      color: white;
      white-space: nowrap;
    }

    .gps-btn:hover {
      background: #066b42;
    }

    .gps-btn:disabled,
    .refresh:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .coordinates {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-top: 25px;
    }

    .coordinate-box {
      padding: 17px;
      background: #f7faf8;
      border: 1px solid #e5ede8;
      border-radius: 12px;
    }

    .coordinate-box span,
    .data-card span,
    .soil-card span,
    .property-grid span {
      display: block;
      color: #748179;
      font-size: 13px;
      margin-bottom: 7px;
    }

    .coordinate-box strong {
      color: #173f31;
      font-size: 15px;
      word-break: break-word;
    }

    .coordinate-box small,
    .data-card small,
    .soil-card small {
      font-size: 13px;
      font-weight: 500;
    }

    .location-placeholder {
      text-align: center;
      padding: 40px 20px 15px;
      color: #718078;
    }

    .big-pin {
      font-size: 42px;
      margin-bottom: 10px;
    }

    .location-placeholder h3 {
      margin: 0 0 7px;
      color: #29473b;
    }

    .location-placeholder p {
      margin: 0;
    }

    .error {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 17px;
      margin-bottom: 28px;
      border-radius: 12px;
      background: #fff3f1;
      border: 1px solid #ffd8d2;
      color: #a33b2f;
    }

    .error p {
      margin: 5px 0 0;
    }

    .section {
      padding: 28px;
      margin-bottom: 30px;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 22px;
    }

    .refresh {
      background: #eef7f1;
      color: #087f4e;
      padding: 10px 16px;
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
      padding: 20px;
      border: 1px solid #e4ebe7;
      border-radius: 14px;
      background: #fbfcfb;
    }

    .data-card strong {
      color: #173f31;
      font-size: 25px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 23px;
      background: #eaf5ee;
      flex-shrink: 0;
    }

    .soil-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .soil-card {
      padding: 20px;
      border: 1px solid #e4ebe7;
      border-radius: 14px;
      background: #fbfcfb;
    }

    .soil-depth {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 20px;
      background: #e5f4ea;
      color: #087f4e;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .soil-card strong {
      display: block;
      color: #173f31;
      font-size: 26px;
      margin-bottom: 14px;
    }

    .bar {
      height: 7px;
      border-radius: 10px;
      background: #e8eee9;
      overflow: hidden;
    }

    .bar div {
      height: 100%;
      border-radius: inherit;
      background: #087f4e;
      transition: width .4s ease;
    }

    .mapped-card {
      padding: 22px;
      border-radius: 14px;
      background: #f8faf8;
      border: 1px solid #e4ebe7;
    }

    .mapped-status {
      display: flex;
      gap: 14px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e1e9e4;
    }

    .mapped-status > span {
      font-size: 28px;
    }

    .mapped-status strong {
      color: #25483a;
    }

    .mapped-status p {
      margin: 6px 0 0;
      color: #697970;
      font-size: 14px;
      line-height: 1.5;
    }

    .property-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .property-grid > div {
      padding: 15px;
      background: white;
      border: 1px solid #e4ebe7;
      border-radius: 10px;
    }

    .property-grid strong {
      color: #173f31;
      font-size: 18px;
    }

    .insight {
      display: flex;
      gap: 18px;
      padding: 25px;
    }

    .insight-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e4f5ea;
      border-radius: 13px;
      font-size: 25px;
      flex-shrink: 0;
    }

    .insight p {
      color: #53665d;
      line-height: 1.6;
      margin: 8px 0 0;
    }

    .insight .small {
      font-size: 13px;
      color: #7a8881;
    }

    @media (max-width: 900px) {

      .coordinates {
        grid-template-columns: repeat(2, 1fr);
      }

      .cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .soil-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .property-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {

      .page {
        padding: 25px 15px 50px;
      }

      .hero {
        align-items: flex-start;
      }

      h1 {
        font-size: 29px;
      }

      .location-title,
      .section-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .gps-btn {
        width: 100%;
      }

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
            'Could not connect to the KrishiAI backend. Make sure FastAPI is running on port 8000.';
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