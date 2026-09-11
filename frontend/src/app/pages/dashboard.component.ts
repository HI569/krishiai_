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
    <section class="dashboard">

      <!-- ========================================= -->
      <!-- TOP HEADER -->
      <!-- ========================================= -->

      <header class="dashboard-header">

        <div class="welcome">
          <div class="mini-label">SMART FARMING INTELLIGENCE</div>

          <h1>
            My Farm
            <span>Dashboard</span>
          </h1>

          <p>
            Real-time insights for your farm, powered by KrishiAI.
          </p>
        </div>

        <button
          class="refresh-btn"
          type="button"
          (click)="getLocation()"
          [disabled]="loading"
        >
          <span class="refresh-icon">⌖</span>

          <span>
            {{ loading ? 'Updating...' : 'Refresh Location' }}
          </span>
        </button>

      </header>


      <!-- ========================================= -->
      <!-- LOCATION HERO -->
      <!-- ========================================= -->

      <div class="location-hero">

        <div class="location-main">

          <div class="location-icon">
            📍
          </div>

          <div>

            <div class="location-label">
              YOUR FARM LOCATION
            </div>

            <h2>
              {{
                locationName
                  ? locationName
                  : 'Detecting your location...'
              }}
            </h2>

            <p *ngIf="locationName">
              <span *ngIf="locationState">
                {{ locationState }}
              </span>

              <span *ngIf="locationState && locationCountry">
                ·
              </span>

              {{ locationCountry }}
            </p>

            <p
              class="coordinates"
              *ngIf="latitude !== null && longitude !== null"
            >
              {{ latitude.toFixed(5) }},
              {{ longitude.toFixed(5) }}
            </p>

          </div>

        </div>


        <div class="live-status">

          <span class="pulse"></span>

          <div>
            <strong>LIVE</strong>

            <small>
              {{
                lastUpdated
                  ? ('Updated ' + (lastUpdated | date:'shortTime'))
                  : 'Waiting for data'
              }}
            </small>
          </div>

        </div>

      </div>


      <!-- ========================================= -->
      <!-- ERROR -->
      <!-- ========================================= -->

      <div
        class="error-box"
        *ngIf="error"
      >
        <div class="error-icon">
          !
        </div>

        <div>
          <strong>Unable to load farm data</strong>
          <p>{{ error }}</p>
        </div>
      </div>


      <!-- ========================================= -->
      <!-- PRIMARY METRICS -->
      <!-- ========================================= -->

      <div class="section-title">

        <div>
          <span>LIVE CONDITIONS</span>
          <h2>Farm Overview</h2>
        </div>

        <div class="section-source">
          ● Live data
        </div>

      </div>


      <div class="metrics-grid">

        <!-- WEATHER -->

        <div class="metric-card weather-card">

          <div class="metric-header">

            <div class="metric-icon weather-icon">
              ☀
            </div>

            <span class="metric-tag">
              WEATHER
            </span>

          </div>

          <div class="metric-value">
            {{
              temperature !== null
                ? temperature + '°C'
                : '—'
            }}
          </div>

          <div class="metric-name">
            Temperature
          </div>

          <div class="metric-extra">
            Humidity
            <strong>
              {{
                humidity !== null
                  ? humidity + '%'
                  : '—'
              }}
            </strong>
          </div>

        </div>


        <!-- RAIN -->

        <div class="metric-card rain-card">

          <div class="metric-header">

            <div class="metric-icon">
              🌧
            </div>

            <span class="metric-tag">
              RAINFALL
            </span>

          </div>

          <div class="metric-value">
            {{
              rainfall !== null
                ? rainfall + ' mm'
                : '—'
            }}
          </div>

          <div class="metric-name">
            Current Rain
          </div>

          <div class="metric-extra">
            Wind
            <strong>
              {{
                windSpeed !== null
                  ? windSpeed + ' km/h'
                  : '—'
              }}
            </strong>
          </div>

        </div>


        <!-- SOIL MOISTURE -->

        <div class="metric-card soil-card">

          <div class="metric-header">

            <div class="metric-icon">
              💧
            </div>

            <span class="metric-tag">
              SOIL
            </span>

          </div>

          <div class="metric-value">
            {{
              soilMoisture !== null
                ? soilMoisture + '%'
                : '—'
            }}
          </div>

          <div class="metric-name">
            Soil Moisture
          </div>

          <div class="metric-progress">

            <span
              [style.width.%]="soilMoisture || 0"
            ></span>

          </div>

        </div>


        <!-- DISASTER RISK -->

        <div class="metric-card risk-card">

          <div class="metric-header">

            <div class="metric-icon">
              ⚠
            </div>

            <span class="metric-tag">
              EARLY WARNING
            </span>

          </div>

          <div
            class="metric-value"
            [class.risk-high]="disasterRisk !== null && disasterRisk >= 70"
            [class.risk-medium]="
              disasterRisk !== null &&
              disasterRisk >= 40 &&
              disasterRisk < 70
            "
          >
            {{
              disasterRisk !== null
                ? disasterRisk + '/100'
                : '—'
            }}
          </div>

          <div class="metric-name">
            {{ disasterLabel }}
          </div>

          <div class="risk-bar">

            <span
              [style.width.%]="disasterRisk || 0"
            ></span>

          </div>

        </div>

      </div>


      <!-- ========================================= -->
      <!-- MAIN GRID -->
      <!-- ========================================= -->

      <div class="main-grid">


        <!-- ======================================= -->
        <!-- SOIL PANEL -->
        <!-- ======================================= -->

        <div class="panel soil-panel">

          <div class="panel-header">

            <div>
              <span class="panel-label">
                SOIL INTELLIGENCE
              </span>

              <h2>
                Soil Conditions
              </h2>
            </div>

            <a routerLink="/soil">
              View Details →
            </a>

          </div>


          <div class="soil-overview">

            <div class="soil-circle">

              <div class="soil-circle-inner">

                <strong>
                  {{
                    soilMoisture !== null
                      ? soilMoisture + '%'
                      : '—'
                  }}
                </strong>

                <small>
                  Moisture
                </small>

              </div>

            </div>


            <div class="soil-info">

              <div class="soil-row">

                <span>
                  🌡 Soil Temperature
                </span>

                <strong>
                  {{
                    soilTemperature !== null
                      ? soilTemperature + '°C'
                      : '—'
                  }}
                </strong>

              </div>


              <div class="soil-row">

                <span>
                  0 cm
                </span>

                <strong>
                  {{
                    soilTemp0 !== null
                      ? soilTemp0 + '°C'
                      : '—'
                  }}
                </strong>

              </div>


              <div class="soil-row">

                <span>
                  6 cm
                </span>

                <strong>
                  {{
                    soilTemp6 !== null
                      ? soilTemp6 + '°C'
                      : '—'
                  }}
                </strong>

              </div>


              <div class="soil-row">

                <span>
                  18 cm
                </span>

                <strong>
                  {{
                    soilTemp18 !== null
                      ? soilTemp18 + '°C'
                      : '—'
                  }}
                </strong>

              </div>

            </div>

          </div>


          <div class="mapped-status">

            <div class="status-dot"></div>

            <div>

              <strong>
                Mapped Soil Data
              </strong>

              <span>
                {{
                  mappedSoilAvailable
                    ? 'Connected'
                    : 'Not connected'
                }}
              </span>

            </div>

          </div>

        </div>


        <!-- ======================================= -->
        <!-- WEATHER PANEL -->
        <!-- ======================================= -->

        <div class="panel weather-panel">

          <div class="panel-header">

            <div>
              <span class="panel-label">
                WEATHER
              </span>

              <h2>
                Farm Weather
              </h2>
            </div>

            <span class="weather-location">
              📍 {{ locationName || 'Your Farm' }}
            </span>

          </div>


          <div class="weather-main">

            <div class="weather-symbol">
              ☀️
            </div>

            <div>

              <div class="big-temperature">
                {{
                  temperature !== null
                    ? temperature + '°'
                    : '—'
                }}
              </div>

              <div class="weather-description">
                Current Conditions
              </div>

            </div>

          </div>


          <div class="weather-details">

            <div>
              <span>💧</span>

              <small>Humidity</small>

              <strong>
                {{
                  humidity !== null
                    ? humidity + '%'
                    : '—'
                }}
              </strong>
            </div>


            <div>
              <span>🌧</span>

              <small>Rain</small>

              <strong>
                {{
                  rainfall !== null
                    ? rainfall + ' mm'
                    : '—'
                }}
              </strong>
            </div>


            <div>
              <span>💨</span>

              <small>Wind</small>

              <strong>
                {{
                  windSpeed !== null
                    ? windSpeed + ' km/h'
                    : '—'
                }}
              </strong>
            </div>

          </div>

        </div>


        <!-- ======================================= -->
        <!-- FARM STATUS -->
        <!-- ======================================= -->

        <div class="panel farm-status-panel">

          <div class="panel-header">

            <div>
              <span class="panel-label">
                FARM STATUS
              </span>

              <h2>
                Your Farm
              </h2>
            </div>

            <div class="optimal-badge">
              <span></span>
              Connected
            </div>

          </div>


          <div class="farm-location-large">

            <div class="farm-pin">
              📍
            </div>

            <div>

              <strong>
                {{
                  locationName || 'Detecting...'
                }}
              </strong>

              <span>
                {{
                  locationState || 'India'
                }}
              </span>

            </div>

          </div>


          <div class="farm-data-list">

            <div>
              <span>Latitude</span>

              <strong>
                {{
                  latitude !== null
                    ? latitude.toFixed(4)
                    : '—'
                }}
              </strong>
            </div>

            <div>
              <span>Longitude</span>

              <strong>
                {{
                  longitude !== null
                    ? longitude.toFixed(4)
                    : '—'
                }}
              </strong>
            </div>

            <div>
              <span>Elevation</span>

              <strong>
                {{
                  elevation !== null
                    ? elevation + ' m'
                    : '—'
                }}
              </strong>
            </div>

          </div>

        </div>


        <!-- ======================================= -->
        <!-- AI PANEL -->
        <!-- ======================================= -->

        <div class="panel ai-panel">

          <div class="panel-header">

            <div>
              <span class="panel-label">
                KRISHIAI
              </span>

              <h2>
                AI Farming Assistant
              </h2>
            </div>

            <div class="ai-status">
              <span></span>
              AI Ready
            </div>

          </div>


          <div class="ai-message">

            <div class="ai-avatar">
              ✦
            </div>

            <div>

              <strong>
                KrishiAI
              </strong>

              <p>
                Need help with your crop, soil,
                plant health or farming decisions?
              </p>

            </div>

          </div>


          <a
            routerLink="/assistant"
            class="ai-button"
          >
            Ask KrishiAI
            <span>→</span>
          </a>

        </div>

      </div>


      <!-- ========================================= -->
      <!-- QUICK ACTIONS -->
      <!-- ========================================= -->

      <div class="section-title actions-title">

        <div>
          <span>FARM INTELLIGENCE</span>

          <h2>
            Quick Actions
          </h2>
        </div>

      </div>


      <div class="actions-grid">


        <a
          routerLink="/crop"
          class="action-card"
        >

          <div class="action-symbol crop-symbol">
            🌾
          </div>

          <div class="action-content">

            <span>
              CROP
            </span>

            <h3>
              Find My Crop
            </h3>

            <p>
              Discover suitable crops based
              on your farm conditions.
            </p>

          </div>

          <div class="action-arrow">
            →
          </div>

        </a>


        <a
          routerLink="/soil"
          class="action-card"
        >

          <div class="action-symbol soil-symbol">
            🧪
          </div>

          <div class="action-content">

            <span>
              SOIL
            </span>

            <h3>
              Soil Health
            </h3>

            <p>
              Analyse soil and environmental
              conditions.
            </p>

          </div>

          <div class="action-arrow">
            →
          </div>

        </a>


        <a
          routerLink="/disease"
          class="action-card"
        >

          <div class="action-symbol plant-symbol">
            🍃
          </div>

          <div class="action-content">

            <span>
              PLANT HEALTH
            </span>

            <h3>
              Check Plant
            </h3>

            <p>
              Upload a plant image to detect
              possible diseases.
            </p>

          </div>

          <div class="action-arrow">
            →
          </div>

        </a>


        <a
          routerLink="/disaster"
          class="action-card"
        >

          <div class="action-symbol warning-symbol">
            ⚠️
          </div>

          <div class="action-content">

            <span>
              EARLY WARNING
            </span>

            <h3>
              Disaster Risk
            </h3>

            <p>
              Check weather-based agricultural
              risk conditions.
            </p>

          </div>

          <div class="action-arrow">
            →
          </div>

        </a>

      </div>


      <!-- ========================================= -->
      <!-- FOOTER STATUS -->
      <!-- ========================================= -->

      <div class="connection-footer">

        <div class="connection-left">

          <span class="connection-pulse"></span>

          <div>

            <strong>
              KrishiAI Live Farm Intelligence
            </strong>

            <small>
              Weather and soil data connected
            </small>

          </div>

        </div>


        <div class="connection-coordinates">

          {{
            locationName
              ? locationName + ', ' + locationState
              : 'Location pending'
          }}

        </div>

      </div>


      <!-- ========================================= -->
      <!-- EMPTY STATE -->
      <!-- ========================================= -->

      <div
        class="empty-state"
        *ngIf="!farmData && !loading && !error"
      >

        <div class="empty-icon">
          📍
        </div>

        <h2>
          Connect Your Farm
        </h2>

        <p>
          Allow location access to connect KrishiAI
          with your current farm conditions.
        </p>

        <button
          class="refresh-btn"
          type="button"
          (click)="getLocation()"
        >
          📍 Use My Current Location
        </button>

      </div>

    </section>
  `,

  styles: [`

    /* =====================================================
       GLOBAL
       ===================================================== */

    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }


    .dashboard {
      min-height: calc(100vh - 70px);
      padding: 34px 4%;
      color: #e8f7ef;

      background:
        radial-gradient(
          circle at 15% 0%,
          rgba(0, 255, 148, .08),
          transparent 32%
        ),
        radial-gradient(
          circle at 90% 30%,
          rgba(0, 190, 120, .06),
          transparent 30%
        ),
        #08120f;
    }


    /* =====================================================
       HEADER
       ===================================================== */

    .dashboard-header {
      max-width: 1320px;
      margin: 0 auto 26px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 24px;
    }


    .mini-label,
    .panel-label,
    .section-title > div > span,
    .location-label {
      color: #36e89a;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }


    .welcome h1 {
      margin: 7px 0 0;

      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -.8px;

      color: #f3fff8;
    }


    .welcome h1 span {
      color: #36e89a;
    }


    .welcome p {
      margin: 10px 0 0;

      color: #7e938a;
      font-size: 14px;
    }


    .refresh-btn {
      border: 1px solid rgba(54, 232, 154, .35);
      border-radius: 12px;

      background:
        linear-gradient(
          135deg,
          rgba(27, 211, 132, .18),
          rgba(27, 211, 132, .08)
        );

      color: #a9f7d0;

      padding: 12px 17px;

      display: inline-flex;
      align-items: center;
      gap: 9px;

      font-size: 13px;
      font-weight: 700;

      cursor: pointer;

      transition:
        transform .2s ease,
        background .2s ease,
        border-color .2s ease;
    }


    .refresh-btn:hover {
      transform: translateY(-2px);

      background:
        rgba(54, 232, 154, .16);

      border-color: rgba(54, 232, 154, .7);
    }


    .refresh-btn:disabled {
      opacity: .55;
      cursor: wait;
    }


    .refresh-icon {
      font-size: 19px;
    }


    /* =====================================================
       LOCATION HERO
       ===================================================== */

    .location-hero {
      max-width: 1320px;
      margin: 0 auto 28px;

      padding: 23px 25px;

      border: 1px solid rgba(255,255,255,.07);
      border-radius: 18px;

      background:
        linear-gradient(
          135deg,
          rgba(21, 39, 33, .96),
          rgba(10, 23, 18, .96)
        );

      box-shadow:
        0 20px 55px rgba(0,0,0,.24),
        inset 0 1px 0 rgba(255,255,255,.025);

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;
    }


    .location-main {
      display: flex;
      align-items: center;
      gap: 17px;
    }


    .location-icon {
      width: 55px;
      height: 55px;

      border-radius: 15px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 25px;

      background:
        rgba(54,232,154,.1);

      border: 1px solid rgba(54,232,154,.22);

      box-shadow:
        0 0 25px rgba(54,232,154,.08);
    }


    .location-main h2 {
      margin: 4px 0 2px;

      font-size: 22px;
      color: #f1fff7;
    }


    .location-main p {
      margin: 0;

      color: #7f958b;
      font-size: 13px;
    }


    .location-main .coordinates {
      margin-top: 5px;

      color: #557169;
      font-size: 11px;
      font-family: monospace;
    }


    .live-status {
      display: flex;
      align-items: center;
      gap: 9px;
    }


    .live-status strong {
      display: block;

      color: #38e99a;
      font-size: 11px;
      letter-spacing: 1px;
    }


    .live-status small {
      display: block;

      margin-top: 3px;

      color: #657b72;
      font-size: 10px;
    }


    .pulse,
    .connection-pulse,
    .status-dot,
    .ai-status span,
    .optimal-badge span {
      width: 8px;
      height: 8px;

      border-radius: 50%;

      background: #35e999;

      box-shadow:
        0 0 0 4px rgba(53,233,153,.09),
        0 0 14px rgba(53,233,153,.6);
    }


    .pulse {
      animation: pulse 1.8s infinite;
    }


    @keyframes pulse {

      0% {
        box-shadow:
          0 0 0 0 rgba(53,233,153,.35);
      }

      70% {
        box-shadow:
          0 0 0 8px rgba(53,233,153,0);
      }

      100% {
        box-shadow:
          0 0 0 0 rgba(53,233,153,0);
      }

    }


    /* =====================================================
       ERROR
       ===================================================== */

    .error-box {
      max-width: 1320px;
      margin: 0 auto 22px;

      padding: 15px;

      display: flex;
      align-items: center;
      gap: 12px;

      border: 1px solid rgba(255,90,90,.25);
      border-radius: 14px;

      background: rgba(255,70,70,.07);
    }


    .error-icon {
      width: 30px;
      height: 30px;

      border-radius: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      background: rgba(255,80,80,.14);
      color: #ff7777;
      font-weight: 800;
    }


    .error-box strong {
      color: #ff8d8d;
      font-size: 13px;
    }


    .error-box p {
      margin: 3px 0 0;

      color: #a98686;
      font-size: 12px;
    }


    /* =====================================================
       SECTION TITLES
       ===================================================== */

    .section-title {
      max-width: 1320px;
      margin: 0 auto 15px;

      display: flex;
      align-items: end;
      justify-content: space-between;
    }


    .section-title h2 {
      margin: 5px 0 0;

      color: #eafaf2;
      font-size: 22px;
    }


    .section-source {
      color: #42d990;
      font-size: 11px;
      font-weight: 700;
    }


    /* =====================================================
       METRICS
       ===================================================== */

    .metrics-grid {
      max-width: 1320px;
      margin: 0 auto 30px;

      display: grid;

      grid-template-columns:
        repeat(4, minmax(0, 1fr));

      gap: 14px;
    }


    .metric-card {
      min-height: 178px;

      padding: 19px;

      border-radius: 17px;

      border: 1px solid rgba(255,255,255,.07);

      background:
        linear-gradient(
          145deg,
          rgba(20, 34, 29, .95),
          rgba(11, 23, 19, .96)
        );

      box-shadow:
        0 15px 35px rgba(0,0,0,.18);

      transition:
        transform .2s ease,
        border-color .2s ease;
    }


    .metric-card:hover {
      transform: translateY(-3px);

      border-color:
        rgba(54,232,154,.2);
    }


    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }


    .metric-icon {
      width: 42px;
      height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 12px;

      background: rgba(54,232,154,.08);

      font-size: 21px;
    }


    .metric-tag {
      color: #5e756b;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.1px;
    }


    .metric-value {
      margin-top: 20px;

      color: #effff6;

      font-size: 31px;
      line-height: 1;

      font-weight: 800;
      letter-spacing: -.8px;
    }


    .metric-name {
      margin-top: 6px;

      color: #71867d;
      font-size: 12px;
    }


    .metric-extra {
      margin-top: 17px;

      color: #61766d;
      font-size: 11px;

      display: flex;
      justify-content: space-between;
    }


    .metric-extra strong {
      color: #a4c5b5;
    }


    .metric-progress,
    .risk-bar {
      height: 5px;

      margin-top: 16px;

      border-radius: 20px;

      background: #182720;

      overflow: hidden;
    }


    .metric-progress span {
      display: block;
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          #1bc77e,
          #50f5aa
        );

      transition: width .6s ease;
    }


    .risk-bar span {
      display: block;
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          #32d88e,
          #f4c95d,
          #ff6868
        );

      transition: width .6s ease;
    }


    .risk-high {
      color: #ff7777 !important;
    }


    .risk-medium {
      color: #f1cc62 !important;
    }


    /* =====================================================
       MAIN GRID
       ===================================================== */

    .main-grid {
      max-width: 1320px;
      margin: 0 auto;

      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 15px;
    }


    .panel {
      min-width: 0;

      padding: 22px;

      border-radius: 18px;

      border: 1px solid rgba(255,255,255,.07);

      background:
        linear-gradient(
          145deg,
          rgba(19, 33, 28, .96),
          rgba(9, 21, 17, .98)
        );

      box-shadow:
        0 18px 40px rgba(0,0,0,.18);
    }


    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 15px;
    }


    .panel-header h2 {
      margin: 5px 0 0;

      color: #effff6;

      font-size: 19px;
    }


    .panel-header a {
      color: #36e89a;

      text-decoration: none;

      font-size: 11px;
      font-weight: 700;
    }


    /* =====================================================
       SOIL
       ===================================================== */

    .soil-overview {
      margin-top: 25px;

      display: flex;
      align-items: center;

      gap: 30px;
    }


    .soil-circle {
      width: 145px;
      height: 145px;

      flex-shrink: 0;

      border-radius: 50%;

      padding: 11px;

      background:
        conic-gradient(
          #32e99a
          calc(var(--soil-progress, 70) * 1%),
          #1d2b25 0
        );

      display: flex;
      align-items: center;
      justify-content: center;

      box-shadow:
        0 0 30px rgba(50,233,154,.08);
    }


    .soil-circle-inner {
      width: 100%;
      height: 100%;

      border-radius: 50%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background: #101d18;
    }


    .soil-circle-inner strong {
      color: #effff6;

      font-size: 27px;
    }


    .soil-circle-inner small {
      margin-top: 3px;

      color: #62b68e;

      font-size: 10px;
    }


    .soil-info {
      width: 100%;
    }


    .soil-row {
      padding: 10px 0;

      display: flex;
      justify-content: space-between;

      border-bottom: 1px solid rgba(255,255,255,.05);

      color: #72877e;

      font-size: 11px;
    }


    .soil-row strong {
      color: #c5ddd1;
    }


    .mapped-status {
      margin-top: 22px;

      padding: 11px 13px;

      border-radius: 11px;

      background: rgba(255,255,255,.025);

      display: flex;
      align-items: center;
      gap: 10px;
    }


    .mapped-status strong,
    .mapped-status span {
      display: block;
    }


    .mapped-status strong {
      color: #b8d8ca;
      font-size: 11px;
    }


    .mapped-status span {
      margin-top: 2px;

      color: #637970;
      font-size: 10px;
    }


    /* =====================================================
       WEATHER
       ===================================================== */

    .weather-location {
      color: #758a81;
      font-size: 10px;
    }


    .weather-main {
      margin-top: 27px;

      display: flex;
      align-items: center;

      gap: 20px;
    }


    .weather-symbol {
      width: 85px;
      height: 85px;

      border-radius: 20px;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        linear-gradient(
          145deg,
          rgba(251,191,71,.12),
          rgba(54,232,154,.05)
        );

      font-size: 42px;
    }


    .big-temperature {
      color: #f1fff7;

      font-size: 48px;
      font-weight: 800;
      line-height: 1;
    }


    .weather-description {
      margin-top: 6px;

      color: #71867d;
      font-size: 11px;
    }


    .weather-details {
      margin-top: 28px;

      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 10px;
    }


    .weather-details > div {
      padding: 12px;

      border-radius: 11px;

      background: rgba(255,255,255,.025);
    }


    .weather-details span {
      display: block;

      margin-bottom: 8px;

      font-size: 16px;
    }


    .weather-details small {
      display: block;

      color: #61766d;
      font-size: 9px;
    }


    .weather-details strong {
      display: block;

      margin-top: 4px;

      color: #c6dfd3;
      font-size: 13px;
    }


    /* =====================================================
       FARM STATUS
       ===================================================== */

    .optimal-badge {
      padding: 6px 9px;

      border-radius: 20px;

      color: #55e8a2;

      background: rgba(54,232,154,.07);

      font-size: 9px;
      font-weight: 700;

      display: flex;
      align-items: center;
      gap: 7px;
    }


    .optimal-badge span {
      width: 6px;
      height: 6px;
    }


    .farm-location-large {
      margin-top: 25px;

      padding: 18px;

      border-radius: 14px;

      background:
        radial-gradient(
          circle at 15% 50%,
          rgba(54,232,154,.08),
          transparent 40%
        ),
        rgba(255,255,255,.025);

      display: flex;
      align-items: center;

      gap: 14px;
    }


    .farm-pin {
      width: 48px;
      height: 48px;

      border-radius: 13px;

      display: flex;
      align-items: center;
      justify-content: center;

      background: rgba(54,232,154,.09);

      font-size: 22px;
    }


    .farm-location-large strong,
    .farm-location-large span {
      display: block;
    }


    .farm-location-large strong {
      color: #effff6;
      font-size: 17px;
    }


    .farm-location-large span {
      margin-top: 4px;

      color: #6f877d;
      font-size: 11px;
    }


    .farm-data-list {
      margin-top: 14px;

      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 8px;
    }


    .farm-data-list div {
      padding: 11px;

      border-radius: 10px;

      background: rgba(255,255,255,.022);
    }


    .farm-data-list span,
    .farm-data-list strong {
      display: block;
    }


    .farm-data-list span {
      color: #60756c;
      font-size: 9px;
    }


    .farm-data-list strong {
      margin-top: 5px;

      color: #bad6c9;
      font-size: 11px;
    }


    /* =====================================================
       AI
       ===================================================== */

    .ai-status {
      display: flex;
      align-items: center;

      gap: 7px;

      color: #51e99f;
      font-size: 9px;
      font-weight: 700;
    }


    .ai-status span {
      width: 6px;
      height: 6px;
    }


    .ai-message {
      margin-top: 25px;

      padding: 16px;

      border-radius: 14px;

      background:
        linear-gradient(
          135deg,
          rgba(40,214,137,.07),
          rgba(255,255,255,.02)
        );

      display: flex;
      gap: 12px;
    }


    .ai-avatar {
      width: 39px;
      height: 39px;

      flex-shrink: 0;

      border-radius: 11px;

      display: flex;
      align-items: center;
      justify-content: center;

      background: rgba(54,232,154,.12);

      color: #38e99a;

      font-size: 20px;
    }


    .ai-message strong {
      color: #dff8eb;
      font-size: 12px;
    }


    .ai-message p {
      margin: 5px 0 0;

      color: #71877d;

      font-size: 11px;
      line-height: 1.55;
    }


    .ai-button {
      margin-top: 13px;

      padding: 12px 14px;

      border: 1px solid rgba(54,232,154,.2);
      border-radius: 11px;

      color: #65eda9;

      background: rgba(54,232,154,.06);

      text-decoration: none;

      font-size: 11px;
      font-weight: 700;

      display: flex;
      justify-content: space-between;

      transition: .2s ease;
    }


    .ai-button:hover {
      background: rgba(54,232,154,.12);
      border-color: rgba(54,232,154,.4);
    }


    /* =====================================================
       ACTIONS
       ===================================================== */

    .actions-title {
      margin-top: 34px;
    }


    .actions-grid {
      max-width: 1320px;
      margin: 0 auto;

      display: grid;

      grid-template-columns:
        repeat(4, minmax(0, 1fr));

      gap: 13px;
    }


    .action-card {
      position: relative;

      min-height: 170px;

      padding: 19px;

      border-radius: 16px;

      border: 1px solid rgba(255,255,255,.07);

      background:
        linear-gradient(
          145deg,
          rgba(19,33,28,.95),
          rgba(10,21,18,.98)
        );

      color: inherit;
      text-decoration: none;

      overflow: hidden;

      transition:
        transform .22s ease,
        border-color .22s ease,
        box-shadow .22s ease;
    }


    .action-card::after {
      content: '';

      position: absolute;

      width: 100px;
      height: 100px;

      right: -45px;
      bottom: -45px;

      border-radius: 50%;

      background: rgba(54,232,154,.05);
    }


    .action-card:hover {
      transform: translateY(-4px);

      border-color:
        rgba(54,232,154,.25);

      box-shadow:
        0 15px 35px rgba(0,0,0,.2);
    }


    .action-symbol {
      width: 45px;
      height: 45px;

      border-radius: 13px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 22px;

      background: rgba(54,232,154,.08);
    }


    .action-content {
      margin-top: 19px;
    }


    .action-content > span {
      color: #4b7563;

      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.2px;
    }


    .action-content h3 {
      margin: 5px 0 6px;

      color: #eafff3;

      font-size: 16px;
    }


    .action-content p {
      margin: 0;

      color: #687e74;

      font-size: 10px;
      line-height: 1.55;
    }


    .action-arrow {
      position: absolute;

      right: 17px;
      bottom: 16px;

      color: #3de89a;

      font-size: 18px;
      font-weight: 700;
    }


    /* =====================================================
       FOOTER
       ===================================================== */

    .connection-footer {
      max-width: 1320px;

      margin: 25px auto 0;

      padding: 13px 16px;

      border: 1px solid rgba(255,255,255,.055);
      border-radius: 12px;

      background: rgba(255,255,255,.018);

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 15px;
    }


    .connection-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }


    .connection-left strong,
    .connection-left small {
      display: block;
    }


    .connection-left strong {
      color: #a8c8ba;
      font-size: 10px;
    }


    .connection-left small {
      margin-top: 3px;

      color: #50665d;
      font-size: 9px;
    }


    .connection-coordinates {
      color: #4e6a5d;

      font-size: 9px;
      font-family: monospace;
    }


    /* =====================================================
       EMPTY STATE
       ===================================================== */

    .empty-state {
      max-width: 600px;

      margin: 70px auto;

      padding: 45px 30px;

      border-radius: 20px;

      text-align: center;

      border: 1px solid rgba(255,255,255,.07);

      background:
        rgba(15,29,24,.95);
    }


    .empty-icon {
      font-size: 45px;
      margin-bottom: 10px;
    }


    .empty-state h2 {
      margin: 0;

      color: #eafff3;
    }


    .empty-state p {
      margin: 10px auto 23px;

      max-width: 430px;

      color: #70867c;

      font-size: 12px;
      line-height: 1.6;
    }


    /* =====================================================
       TABLET
       ===================================================== */

    @media (max-width: 1050px) {

      .metrics-grid {
        grid-template-columns:
          repeat(2, 1fr);
      }


      .actions-grid {
        grid-template-columns:
          repeat(2, 1fr);
      }

    }


    /* =====================================================
       MOBILE
       ===================================================== */

    @media (max-width: 760px) {

      .dashboard {
        padding: 25px 15px;
      }


      .dashboard-header {
        align-items: flex-start;
        flex-direction: column;
      }


      .refresh-btn {
        width: 100%;
        justify-content: center;
      }


      .location-hero {
        align-items: flex-start;
        flex-direction: column;
      }


      .live-status {
        padding-left: 4px;
      }


      .metrics-grid,
      .main-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }


      .soil-overview {
        flex-direction: column;
        align-items: flex-start;
      }


      .soil-circle {
        margin: 0 auto;
      }


      .weather-main {
        justify-content: center;
      }


      .connection-footer {
        align-items: flex-start;
        flex-direction: column;
      }


      .connection-coordinates {
        word-break: break-word;
      }

    }


    @media (max-width: 430px) {

      .location-main {
        align-items: flex-start;
      }


      .location-icon {
        width: 45px;
        height: 45px;
      }


      .location-main h2 {
        font-size: 18px;
      }


      .farm-data-list,
      .weather-details {
        grid-template-columns: 1fr;
      }


      .metric-value {
        font-size: 27px;
      }

    }

  `]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private farmService = inject(FarmService);

  latitude: number | null = null;
  longitude: number | null = null;

  locationName = '';
  locationState = '';
  locationCountry = 'India';

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

  mappedSoilAvailable = false;
  mappedSoilMessage = '';

  disasterRisk: number | null = null;
  disasterLabel = 'Waiting for risk data';

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

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;


        this.latitude = lat;
        this.longitude = lon;


        this.getLocationName(lat, lon);

        this.loadFarmData(lat, lon);

        this.loadDisasterRisk(lat, lon);


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

            this.loadDisasterRisk(
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


  private getLocationName(
    lat: number,
    lon: number
  ): void {

    this.locationName = '';
    this.locationState = '';
    this.locationCountry = 'India';


    this.farmService
      .location(lat, lon)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Detected location:',
            response
          );


          this.locationName =
            response?.city || '';

          this.locationState =
            response?.state || '';

          this.locationCountry =
            response?.country || 'India';

        },


        error: (err: any) => {

          console.error(
            'Location name lookup failed:',
            err
          );

        }

      });

  }


  private loadFarmData(
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
            'Could not connect to the KrishiAI backend. Make sure FastAPI is running on port 8001.';

        }

      });

  }


  private loadDisasterRisk(
    lat: number,
    lon: number
  ): void {

    this.farmService
      .disaster(lat, lon)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Disaster risk:',
            response
          );


          const overall =
            Number(
              response?.overall
            );


          this.disasterRisk =
            Number.isFinite(overall)
              ? Math.round(overall)
              : null;


          this.disasterLabel =
            this.getRiskLabel(
              this.disasterRisk
            );

        },


        error: (err: any) => {

          console.warn(
            'Disaster risk unavailable:',
            err
          );

          this.disasterRisk = null;

          this.disasterLabel =
            'Risk data unavailable';

        }

      });

  }


  private getRiskLabel(
    risk: number | null
  ): string {

    if (risk === null) {
      return 'Waiting for risk data';
    }


    if (risk >= 70) {
      return 'High Risk';
    }


    if (risk >= 40) {
      return 'Moderate Risk';
    }


    return 'Low Risk';

  }


  private readResponse(
    response: any
  ): void {

    const location =
      response?.location || {};

    const current =
      response?.current || {};

    const soil =
      response?.soil || {};

    const mapped =
      response?.mapped_soil || {};


    /* LOCATION */

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


    /* WEATHER */

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


    /* SOIL MOISTURE */

    const moisture =
      this.toNumber(
        soil.soil_moisture_0_to_1cm,
        null
      );


    this.soilMoisture =
      moisture !== null
        ? Number(
            (moisture * 100).toFixed(1)
          )
        : null;


    /* SOIL TEMPERATURE */

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


    /* MAPPED SOIL */

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

    const number =
      Number(value);


    return Number.isFinite(number)
      ? number
      : fallback;

  }

}