import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
  tips?: string[];
}

interface GuideChapter {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: GuideSection[];
}

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="guide-page">
      <!-- AMBIENT GLOWS -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>


      <!-- HEADER -->
      <header class="guide-header">

        <div class="header-content">

          <div class="brand-line">
            <span class="book-icon">📖</span>

            <div>
              <div class="eyebrow">KRISHIAI KNOWLEDGE CENTER</div>
              <h1>Guide Book</h1>
            </div>
          </div>

          <p class="subtitle">
            Your interactive farming knowledge library — search, explore and learn chapter by chapter.
          </p>

          <!-- SEARCH -->
          <div class="search-box">

            <span class="search-icon">⌕</span>

            <input
              type="text"
              [(ngModel)]="searchText"
              (input)="search()"
              placeholder="Search crops, soil, diseases, irrigation, fertilizer..."
            />

            <button
              *ngIf="searchText"
              class="clear-btn"
              type="button"
              (click)="clearSearch()"
            >
              ×
            </button>

          </div>

          <div class="search-hint" *ngIf="!searchText">
            Try searching:
            <button type="button" (click)="quickSearch('rice')">Rice</button>
            <button type="button" (click)="quickSearch('soil pH')">Soil pH</button>
            <button type="button" (click)="quickSearch('nitrogen')">Nitrogen</button>
            <button type="button" (click)="quickSearch('irrigation')">Irrigation</button>
            <button type="button" (click)="quickSearch('disease')">Disease</button>
          </div>

        </div>

      </header>


      <!-- SEARCH RESULTS -->
      <section class="results-section" *ngIf="searchText">

        <div class="content-width">

          <div class="results-heading">
            <div>
              <span class="small-label">SEARCH</span>
              <h2>
                {{ searchResults.length }}
                result{{ searchResults.length === 1 ? '' : 's' }} found
              </h2>
            </div>

            <button class="back-btn" type="button" (click)="clearSearch()">
              ← All chapters
            </button>
          </div>


          <div class="no-results" *ngIf="searchResults.length === 0">

            <div class="no-result-icon">🔎</div>

            <h3>No matching information found</h3>

            <p>
              Try another keyword such as crop name, soil, fertilizer,
              irrigation, pest or disease.
            </p>

          </div>


          <div class="result-grid" *ngIf="searchResults.length">

            <button
              class="result-card"
              type="button"
              *ngFor="let result of searchResults"
              (click)="openSearchResult(result)"
            >

              <div class="result-icon">
                {{ result.section.icon }}
              </div>

              <div class="result-body">

                <span class="result-category">
                  {{ result.chapter.icon }}
                  {{ result.chapter.title }}
                </span>

                <h3>{{ result.section.title }}</h3>

                <p>
                  {{ result.section.content[0] }}
                </p>

                <span class="read-link">
                  Read chapter →
                </span>

              </div>

            </button>

          </div>

        </div>

      </section>


      <!-- MAIN LIBRARY -->
      <main class="content-width library" *ngIf="!searchText && !selectedChapter">

        <div class="section-heading">

          <div>
            <span class="small-label">EXPLORE KNOWLEDGE</span>
            <h2>Farming Chapters</h2>
          </div>

          <span class="chapter-count">
            {{ chapters.length }} chapters
          </span>

        </div>


        <div class="chapter-grid">

          <button
            class="chapter-card"
            type="button"
            *ngFor="let chapter of chapters"
            (click)="openChapter(chapter)"
          >

            <div
              class="chapter-number"
            >
              {{ getChapterNumber(chapter) }}
            </div>

            <div class="chapter-icon">
              {{ chapter.icon }}
            </div>

            <div class="chapter-content">

              <h3>{{ chapter.title }}</h3>

              <p>{{ chapter.description }}</p>

              <div class="chapter-footer">

                <span>
                  {{ chapter.sections.length }} sections
                </span>

                <span class="arrow">
                  →
                </span>

              </div>

            </div>

          </button>

        </div>


        <!-- FEATURED -->
        <section class="featured">

          <div class="featured-icon">🌾</div>

          <div>
            <span class="small-label">START HERE</span>
            <h2>New to farming?</h2>
            <p>
              Begin with Soil Management to understand soil type,
              pH, nutrients and the foundation of healthy crop production.
            </p>
          </div>

          <button
            type="button"
            (click)="openChapter(chapters[1])"
          >
            Explore Soil →
          </button>

        </section>

      </main>


      <!-- CHAPTER VIEW -->
      <main class="chapter-view" *ngIf="selectedChapter">

        <div class="content-width">

          <!-- BACK -->
          <button
            class="chapter-back"
            type="button"
            (click)="closeChapter()"
          >
            ← Back to Guide Book
          </button>


          <!-- CHAPTER HERO -->
          <section class="chapter-hero">

            <div class="chapter-hero-icon">
              {{ selectedChapter.icon }}
            </div>

            <div>
              <span class="small-label">CHAPTER</span>

              <h1>
                {{ selectedChapter.title }}
              </h1>

              <p>
                {{ selectedChapter.description }}
              </p>
            </div>

          </section>


          <!-- CHAPTER NAVIGATION -->
          <div class="section-navigation">

            <span class="nav-title">CONTENTS</span>

            <button
              type="button"
              *ngFor="let section of selectedChapter.sections"
              (click)="scrollToSection(section.id)"
            >
              {{ section.icon }} {{ section.title }}
            </button>

          </div>


          <!-- SECTIONS -->
          <article class="chapter-content-area">

            <section
              class="guide-section"
              *ngFor="let section of selectedChapter.sections"
              [id]="section.id"
            >

              <div class="section-title">

                <span class="section-icon">
                  {{ section.icon }}
                </span>

                <div>
                  <span class="section-number">
                    {{ getSectionNumber(selectedChapter, section) }}
                  </span>

                  <h2>{{ section.title }}</h2>
                </div>

              </div>


              <div class="section-text">

                <p *ngFor="let paragraph of section.content">
                  {{ paragraph }}
                </p>

              </div>


              <div class="tips-box" *ngIf="section.tips?.length">

                <div class="tips-title">
                  💡 Practical tips
                </div>

                <ul>
                  <li *ngFor="let tip of section.tips">
                    {{ tip }}
                  </li>
                </ul>

              </div>

            </section>

          </article>


          <!-- END CHAPTER -->
          <section class="chapter-end">

            <div>📚</div>

            <h2>End of chapter</h2>

            <p>
              Continue exploring the KrishiAI Guide Book for more farming knowledge.
            </p>

            <button type="button" (click)="closeChapter()">
              ← Browse all chapters
            </button>

          </section>

        </div>

      </main>


      <!-- FOOTER -->
      <footer class="guide-footer">

        <div class="content-width">

          <div>
            <strong>📖 KrishiAI Guide Book</strong>
            <span>
              Agricultural knowledge organized for easier learning.
            </span>
          </div>

          <span>
            Information should be adapted to local conditions and official agricultural advisories.
          </span>

        </div>

      </footer>

    </div>
  `,

    styles: [`
    * {
      box-sizing: border-box;
    }

    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }

    .guide-page {
      min-height: calc(100vh - 70px);
      background: #08120f;
      color: #f3f9f4;
      position: relative;
      overflow: hidden;
      font-family: inherit;
    }

    .content-width {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
    }

    /* AMBIENT GLOWS */
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }
    .orb-1 {
      width: 450px;
      height: 450px;
      top: -120px;
      right: -80px;
      background: radial-gradient(circle, rgba(0, 255, 148, 0.12), transparent 70%);
    }
    .orb-2 {
      width: 360px;
      height: 360px;
      bottom: 60px;
      left: -100px;
      background: radial-gradient(circle, rgba(125, 255, 111, 0.08), transparent 70%);
    }

    /* =========================
       HEADER
    ========================= */
    .guide-header {
      background: linear-gradient(180deg, #0d1612 0%, #08120f 100%);
      border-bottom: 1px solid #1c2720;
      color: #f3f9f4;
      padding: 50px 0 54px;
      position: relative;
      z-index: 1;
    }

    .header-content {
      width: min(980px, calc(100% - 48px));
      margin: auto;
      text-align: center;
    }

    .brand-line {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
    }

    .book-icon {
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      font-size: 32px;
      box-shadow: 0 10px 25px rgba(0, 255, 148, 0.18);
    }

    .eyebrow {
      color: #8cff78;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 4px;
      text-align: left;
    }

    .guide-header h1 {
      margin: 0;
      font-size: clamp(2.2rem, 4.5vw, 3.2rem);
      font-weight: 850;
      line-height: 1.15;
      background: linear-gradient(135deg, #7dff6f 0%, #36e89a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .subtitle {
      margin: 12px auto 26px;
      max-width: 650px;
      font-size: 1.05rem;
      line-height: 1.6;
      color: #b7c8bc;
    }

    /* SEARCH */
    .search-box {
      width: min(760px, 100%);
      height: 62px;
      margin: auto;
      display: flex;
      align-items: center;
      background: #121815;
      border: 1px solid #303d34;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
      padding: 0 18px;
      transition: all 0.2s;
    }
    .search-box:focus-within {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }

    .search-icon {
      color: #7dff6f;
      font-size: 26px;
      line-height: 1;
      margin-right: 12px;
    }

    .search-box input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      font-size: 1rem;
      color: #f1f7f2;
      background: transparent;
      font-weight: 600;
    }

    .search-box input::placeholder {
      color: #6a7e72;
    }

    .clear-btn {
      border: none;
      background: #1c2720;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      color: #7dff6f;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-hint {
      margin-top: 14px;
      font-size: 0.8rem;
      color: #8fa395;
    }

    .search-hint button {
      border: 1px solid #28372d;
      background: #0f1612;
      color: #8cff78;
      border-radius: 20px;
      padding: 5px 12px;
      margin-left: 6px;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .search-hint button:hover {
      background: rgba(125, 255, 111, 0.12);
      border-color: #7dff6f;
    }

    /* =========================
       LIBRARY
    ========================= */
    .library {
      padding: 50px 0 80px;
      position: relative;
      z-index: 1;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 24px;
    }

    .small-label {
      display: block;
      color: #8cff78;
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      font-weight: 800;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .section-heading h2 {
      margin: 0;
      font-size: 1.8rem;
      color: #ffffff;
      font-weight: 850;
    }

    .chapter-count {
      color: #798f80;
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* CHAPTER CARDS */
    .chapter-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .chapter-card {
      position: relative;
      text-align: left;
      border: 1px solid #253129;
      background: #121815;
      border-radius: 22px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
    }

    .chapter-card:hover {
      transform: translateY(-4px);
      border-color: rgba(125, 255, 111, 0.4);
      box-shadow: 0 16px 40px rgba(0, 255, 148, 0.15);
      background: #151d18;
    }

    .chapter-number {
      position: absolute;
      top: 18px;
      right: 18px;
      font-size: 0.7rem;
      font-weight: 850;
      color: #7dff6f;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.25);
      padding: 3px 10px;
      border-radius: 12px;
    }

    .chapter-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 16px;
    }

    .chapter-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chapter-content h3 {
      margin: 0 0 8px;
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .chapter-content p {
      margin: 0;
      color: #92a397;
      font-size: 0.88rem;
      line-height: 1.55;
      flex: 1;
    }

    .chapter-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid #1f2b23;
      color: #798f80;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .arrow {
      font-size: 18px;
      color: #7dff6f;
      transition: transform 0.2s;
    }

    .chapter-card:hover .arrow {
      transform: translateX(4px);
    }

    /* FEATURED CARD */
    .featured {
      margin-top: 36px;
      background: linear-gradient(145deg, #152219, #0f1612);
      border: 1px solid rgba(125, 255, 111, 0.3);
      border-radius: 22px;
      padding: 28px 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
    }

    .featured-icon {
      width: 64px;
      height: 64px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.3);
      border-radius: 18px;
      font-size: 32px;
    }

    .featured h2 {
      margin: 0 0 6px;
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 850;
    }

    .featured p {
      margin: 0;
      color: #b7c8bc;
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .featured button {
      margin-left: auto;
      flex: 0 0 auto;
      border: none;
      border-radius: 12px;
      background: #7dff6f;
      color: #07120a;
      padding: 14px 22px;
      font-weight: 850;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(125, 255, 111, 0.25);
      transition: all 0.2s;
    }

    .featured button:hover {
      background: #8eff80;
      transform: translateY(-2px);
    }

    /* =========================
       SEARCH RESULTS
    ========================= */
    .results-section {
      padding: 45px 0 75px;
      position: relative;
      z-index: 1;
    }

    .results-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 25px;
    }

    .results-heading h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.8rem;
      font-weight: 850;
    }

    .back-btn {
      border: 1px solid #28372d;
      background: #121815;
      color: #7dff6f;
      border-radius: 12px;
      padding: 10px 18px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 750;
      transition: all 0.2s;
    }
    .back-btn:hover {
      background: #18221b;
      border-color: #7dff6f;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
    }
    .no-result-icon {
      font-size: 44px;
      margin-bottom: 12px;
    }
    .no-results h3 {
      color: #ffffff;
      margin: 0 0 8px;
      font-size: 1.3rem;
    }
    .no-results p {
      color: #92a397;
      margin: 0;
      font-size: 0.9rem;
    }

    .result-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    .result-card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 22px;
      display: flex;
      gap: 16px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .result-card:hover {
      border-color: #7dff6f;
      background: #151d18;
      transform: translateY(-2px);
    }
    .result-icon {
      font-size: 32px;
      flex: 0 0 auto;
    }
    .result-body {
      flex: 1;
    }
    .result-category {
      font-size: 0.72rem;
      font-weight: 800;
      color: #8cff78;
      display: block;
      margin-bottom: 4px;
    }
    .result-body h3 {
      margin: 0 0 8px;
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 750;
    }
    .result-body p {
      margin: 0 0 12px;
      color: #92a397;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .read-link {
      color: #7dff6f;
      font-size: 0.8rem;
      font-weight: 800;
    }

    /* =========================
       CHAPTER READER VIEW
    ========================= */
    .chapter-view {
      padding: 40px 0 80px;
      position: relative;
      z-index: 1;
    }

    .chapter-back {
      background: #121815;
      border: 1px solid #28372d;
      color: #7dff6f;
      border-radius: 12px;
      padding: 10px 20px;
      font-size: 0.88rem;
      font-weight: 750;
      cursor: pointer;
      margin-bottom: 24px;
      transition: all 0.2s;
    }
    .chapter-back:hover {
      background: #18221b;
      border-color: #7dff6f;
    }

    .chapter-hero {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    }

    .chapter-hero-icon {
      width: 82px;
      height: 82px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 22px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      font-size: 42px;
    }

    .chapter-hero h1 {
      margin: 2px 0 8px;
      color: #ffffff;
      font-size: 2.2rem;
      font-weight: 850;
    }

    .chapter-hero p {
      margin: 0;
      color: #b7c8bc;
      line-height: 1.6;
      font-size: 0.98rem;
    }

    /* SECTION NAVIGATION STICKY */
    .section-navigation {
      position: sticky;
      top: 70px;
      z-index: 10;
      margin: 18px 0;
      padding: 14px;
      display: flex;
      gap: 8px;
      align-items: center;
      overflow-x: auto;
      background: rgba(8, 18, 15, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #212d25;
      border-radius: 14px;
    }

    .nav-title {
      flex: 0 0 auto;
      color: #8cff78;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      font-weight: 850;
      margin-right: 6px;
    }

    .section-navigation button {
      flex: 0 0 auto;
      border: 1px solid #28372d;
      background: #121815;
      color: #b7c8bc;
      border-radius: 20px;
      padding: 7px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .section-navigation button:hover {
      background: rgba(125, 255, 111, 0.12);
      border-color: #7dff6f;
      color: #7dff6f;
    }

    /* CHAPTER CONTENT AREA */
    .chapter-content-area {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
    }

    .guide-section {
      padding: 38px 42px;
      border-bottom: 1px solid #1c2720;
      scroll-margin-top: 130px;
    }

    .guide-section:last-child {
      border-bottom: none;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
    }

    .section-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .section-number {
      font-size: 0.72rem;
      font-weight: 850;
      letter-spacing: 0.1em;
      color: #8cff78;
      display: block;
    }

    .section-title h2 {
      margin: 2px 0 0;
      font-size: 1.4rem;
      color: #ffffff;
      font-weight: 800;
    }

    .section-text p {
      color: #b7c8bc;
      font-size: 0.95rem;
      line-height: 1.68;
      margin: 0 0 14px;
    }

    .tips-box {
      margin-top: 20px;
      background: #0d1410;
      border: 1px solid rgba(125, 255, 111, 0.3);
      border-radius: 14px;
      padding: 18px 22px;
    }

    .tips-title {
      color: #7dff6f;
      font-size: 0.85rem;
      font-weight: 850;
      margin-bottom: 10px;
    }

    .tips-box ul {
      margin: 0;
      padding-left: 20px;
      color: #d8e8dd;
    }

    .tips-box li {
      margin: 6px 0;
      font-size: 0.88rem;
      line-height: 1.55;
    }

    /* CHAPTER END */
    .chapter-end {
      margin-top: 28px;
      padding: 44px 24px;
      text-align: center;
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
    }

    .chapter-end > div {
      font-size: 38px;
    }

    .chapter-end h2 {
      margin: 10px 0 6px;
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 800;
    }

    .chapter-end p {
      color: #92a397;
      font-size: 0.9rem;
      margin: 0 0 18px;
    }

    .chapter-end button {
      border: none;
      border-radius: 12px;
      padding: 13px 24px;
      background: #7dff6f;
      color: #07120a;
      font-weight: 850;
      font-size: 0.92rem;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(125, 255, 111, 0.25);
      transition: all 0.2s;
    }
    .chapter-end button:hover {
      background: #8eff80;
      transform: translateY(-2px);
    }

    /* FOOTER */
    .guide-footer {
      border-top: 1px solid #1c2720;
      background: #08120f;
      padding: 28px 0;
    }

    .guide-footer .content-width {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      color: #728578;
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .guide-footer strong {
      display: block;
      color: #b7c8bc;
      margin-bottom: 2px;
      font-size: 0.85rem;
    }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .chapter-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .result-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 650px) {
      .chapter-grid {
        grid-template-columns: 1fr;
      }
      .featured {
        flex-direction: column;
        align-items: flex-start;
      }
      .featured button {
        margin-left: 0;
      }
      .chapter-hero {
        flex-direction: column;
        align-items: flex-start;
      }
      .guide-section {
        padding: 28px 20px;
      }
      .guide-footer .content-width {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class KnowledgeComponent {

  searchText = '';

  selectedChapter: GuideChapter | null = null;

  searchResults: {
    chapter: GuideChapter;
    section: GuideSection;
  }[] = [];


  chapters: GuideChapter[] = [

    /* =========================
       CHAPTER 1
    ========================= */

    {
      id: 'crop-production',
      title: 'Crop Production',
      icon: '🌾',
      description:
        'Understand crop selection, climate, soil, planting, nutrition, irrigation, protection and harvesting.',

      sections: [

        {
          id: 'crop-overview',
          title: 'Crop Planning',
          icon: '📋',
          content: [
            'Crop planning means selecting crops and production practices according to climate, soil, available water, season, farm resources and market considerations.',
            'Good planning starts with understanding the farm conditions before selecting seed or beginning field preparation.',
            'Farmers should consider the crop duration, expected water requirement, nutrient requirement, local pest and disease pressure and suitable sowing season.'
          ],
          tips: [
            'Select crops that are suitable for the local climate and soil.',
            'Plan crop rotation where practical.',
            'Use reliable agricultural advisories for local sowing and management decisions.'
          ]
        },

        {
          id: 'crop-climate',
          title: 'Climate Requirements',
          icon: '🌤️',
          content: [
            'Temperature, rainfall, humidity, sunlight and length of the growing season influence crop growth and yield.',
            'Different crops have different optimum temperature ranges for germination, vegetative growth, flowering and grain or fruit development.',
            'Extreme heat, frost, drought, excessive rainfall or prolonged wetness can affect crop establishment and productivity.'
          ]
        },

        {
          id: 'crop-soil',
          title: 'Soil Requirements',
          icon: '🌱',
          content: [
            'Soil provides physical support, water, air and nutrients required for plant growth.',
            'Important soil properties include texture, structure, organic matter, pH, drainage and nutrient availability.',
            'The most suitable soil depends on the crop. Soil testing can help determine nutrient and amendment requirements.'
          ],
          tips: [
            'Test soil before making major fertilizer decisions.',
            'Maintain organic matter through suitable organic inputs and crop residues.',
            'Avoid unnecessary fertilizer application.'
          ]
        },

        {
          id: 'crop-seed',
          title: 'Seed Selection',
          icon: '🌰',
          content: [
            'Quality seed is an important foundation for successful crop establishment.',
            'Seed selection should consider crop variety, local adaptation, seed quality, maturity period, disease resistance and intended market.',
            'Use seed from reliable sources and follow recommended seed treatment practices for the crop.'
          ]
        },

        {
          id: 'crop-sowing',
          title: 'Sowing & Planting',
          icon: '🚜',
          content: [
            'Sowing time, planting depth, spacing and plant population influence crop establishment and competition for resources.',
            'The correct planting method depends on the crop and production system.',
            'Sowing too early, too late or at unsuitable depth can reduce germination and establishment.'
          ]
        },

        {
          id: 'crop-nutrition',
          title: 'Nutrient Management',
          icon: '🧪',
          content: [
            'Plants require macronutrients such as nitrogen, phosphorus and potassium as well as secondary and micronutrients.',
            'Nutrient management should consider soil test results, crop requirement, previous crop and expected yield.',
            'Integrated nutrient management combines appropriate mineral fertilizers with organic sources and other suitable nutrient-management practices.'
          ],
          tips: [
            'Do not assume that more fertilizer always means more yield.',
            'Apply nutrients at appropriate crop stages.',
            'Use soil testing to guide fertilizer decisions.'
          ]
        },

        {
          id: 'crop-irrigation',
          title: 'Irrigation',
          icon: '💧',
          content: [
            'Water is required for germination, nutrient movement, photosynthesis and crop development.',
            'Irrigation scheduling should consider crop growth stage, soil condition, weather and available water.',
            'Drip and sprinkler systems can improve water management in suitable crops and situations.'
          ]
        },

        {
          id: 'crop-weed',
          title: 'Weed Management',
          icon: '🌿',
          content: [
            'Weeds compete with crops for water, nutrients, light and space and may interfere with harvesting.',
            'Weed management can involve preventive, cultural, mechanical, biological and chemical approaches.',
            'The most suitable method depends on the crop, weed species, crop stage and farming system.'
          ]
        },

        {
          id: 'crop-pest',
          title: 'Pest Management',
          icon: '🐛',
          content: [
            'Crop pests include insects and other organisms that can damage plants or reduce crop quality.',
            'Integrated Pest Management combines monitoring, prevention, cultural practices, biological control and other suitable measures.',
            'Correct identification of the pest is important before choosing a management approach.'
          ]
        },

        {
          id: 'crop-disease',
          title: 'Disease Management',
          icon: '🦠',
          content: [
            'Plant diseases may be caused by fungi, bacteria, viruses, nematodes and other agents.',
            'Disease management includes prevention, healthy planting material, sanitation, resistant varieties where available and appropriate management practices.',
            'Accurate diagnosis is important because different diseases can produce similar symptoms.'
          ]
        },

        {
          id: 'crop-harvest',
          title: 'Harvesting & Post-Harvest',
          icon: '🌾',
          content: [
            'Harvesting at the appropriate maturity stage helps protect yield and quality.',
            'Post-harvest handling includes cleaning, grading, drying, storage, transportation and processing where applicable.',
            'Poor moisture management and unsuitable storage conditions can lead to quality deterioration and losses.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 2
    ========================= */

    {
      id: 'soil-management',
      title: 'Soil Management',
      icon: '🌱',
      description:
        'Learn soil types, pH, fertility, nutrients, organic matter, testing and soil conservation.',

      sections: [

        {
          id: 'soil-basics',
          title: 'Understanding Soil',
          icon: '🌍',
          content: [
            'Soil is a natural medium that supports plant roots and supplies water, air and nutrients.',
            'Soil properties influence root growth, drainage, nutrient availability and crop performance.',
            'Important properties include texture, structure, organic matter, pH, salinity and nutrient status.'
          ]
        },

        {
          id: 'soil-types',
          title: 'Soil Types',
          icon: '🪨',
          content: [
            'Soil texture describes the relative proportion of sand, silt and clay particles.',
            'Sandy soils generally drain quickly, while clay-rich soils can hold more water but may have drainage and aeration limitations.',
            'Loam soils contain a balanced mixture of particle sizes and can provide favourable conditions for many crops, although suitability always depends on the specific crop and local conditions.'
          ]
        },

        {
          id: 'soil-ph',
          title: 'Soil pH',
          icon: '⚗️',
          content: [
            'Soil pH indicates the acidity or alkalinity of soil and strongly affects nutrient availability.',
            'Different crops have different preferred pH ranges.',
            'Soil testing is the appropriate way to determine the actual pH of a field before deciding on corrective amendments.'
          ],
          tips: [
            'Do not estimate soil pH only from crop appearance.',
            'Use a proper soil test.',
            'Apply amendments according to soil-test recommendations.'
          ]
        },

        {
          id: 'soil-npk',
          title: 'NPK',
          icon: '🧪',
          content: [
            'Nitrogen, phosphorus and potassium are the three primary plant nutrients commonly represented as N, P and K.',
            'Nitrogen is closely associated with vegetative growth and chlorophyll formation.',
            'Phosphorus has important roles in energy transfer, roots and reproductive development.',
            'Potassium contributes to many physiological processes and helps plants manage water and stress.'
          ]
        },

        {
          id: 'soil-organic',
          title: 'Organic Matter',
          icon: '🍂',
          content: [
            'Soil organic matter contributes to soil structure, water-holding capacity, nutrient cycling and biological activity.',
            'Organic matter can be maintained through suitable crop residues, compost, manures and other locally appropriate practices.',
            'Management should consider nutrient content and quality of organic materials as well as the crop requirement.'
          ]
        },

        {
          id: 'soil-testing',
          title: 'Soil Testing',
          icon: '🔬',
          content: [
            'Soil testing provides information about selected chemical and physical properties of soil.',
            'A representative soil sample is important because poor sampling can produce misleading results.',
            'Results can be used with local recommendations to guide nutrient and soil-management decisions.'
          ]
        },

        {
          id: 'soil-conservation',
          title: 'Soil Conservation',
          icon: '🛡️',
          content: [
            'Soil conservation aims to reduce erosion, maintain soil structure and protect long-term productivity.',
            'Practices can include suitable crop rotations, residue management, contour-based measures, vegetation cover and water-management practices.',
            'The appropriate conservation approach depends on slope, rainfall, soil type and farming system.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 3
    ========================= */

    {
      id: 'water-irrigation',
      title: 'Water & Irrigation',
      icon: '💧',
      description:
        'Understand irrigation methods, water management, scheduling, drainage and water conservation.',

      sections: [

        {
          id: 'water-basics',
          title: 'Water Requirement',
          icon: '💦',
          content: [
            'Crop water requirement varies with crop type, growth stage, climate, soil and production system.',
            'Water demand is generally affected by temperature, wind, humidity, sunlight and crop canopy.',
            'Efficient water management aims to supply enough water without unnecessary losses.'
          ]
        },

        {
          id: 'irrigation-methods',
          title: 'Irrigation Methods',
          icon: '🚿',
          content: [
            'Common irrigation methods include surface irrigation, sprinkler irrigation and drip irrigation.',
            'The appropriate method depends on crop, soil, topography, water availability, farm resources and economics.',
            'System design and operation should be appropriate for the crop and field conditions.'
          ]
        },

        {
          id: 'drip-irrigation',
          title: 'Drip Irrigation',
          icon: '💧',
          content: [
            'Drip irrigation delivers water near the plant root zone through emitters.',
            'It can support precise water application and is commonly used in crops where localized irrigation is suitable.',
            'Proper filtration, system maintenance and appropriate scheduling are important for reliable operation.'
          ]
        },

        {
          id: 'sprinkler-irrigation',
          title: 'Sprinkler Irrigation',
          icon: '🌧️',
          content: [
            'Sprinkler systems apply water in the form of droplets over the field or crop area.',
            'They can be useful where field conditions and crop requirements make sprinkler irrigation suitable.',
            'Wind and system pressure can influence application uniformity.'
          ]
        },

        {
          id: 'water-conservation',
          title: 'Water Conservation',
          icon: '♻️',
          content: [
            'Water conservation involves reducing unnecessary losses and improving the efficiency of water use.',
            'Practices may include appropriate irrigation scheduling, mulching, rainwater harvesting, efficient irrigation systems and improved soil management.',
            'Local water availability and crop requirements should guide decisions.'
          ]
        },

        {
          id: 'drainage',
          title: 'Drainage',
          icon: '🌊',
          content: [
            'Excess water can reduce soil aeration and damage roots in crops that are sensitive to waterlogging.',
            'Drainage management aims to remove excess water and maintain suitable root-zone conditions.',
            'The appropriate drainage approach depends on soil, topography, rainfall and field conditions.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 4
    ========================= */

    {
      id: 'fertilizer-nutrition',
      title: 'Fertilizer & Plant Nutrition',
      icon: '🧪',
      description:
        'Learn about NPK, micronutrients, organic fertilizers, nutrient deficiencies and responsible fertilizer use.',

      sections: [

        {
          id: 'plant-nutrients',
          title: 'Essential Nutrients',
          icon: '🌿',
          content: [
            'Plants require several essential nutrients for normal growth and development.',
            'These include macronutrients required in relatively larger quantities and micronutrients required in smaller quantities.',
            'Nutrient requirements differ among crops and can also vary with soil conditions and yield targets.'
          ]
        },

        {
          id: 'nitrogen',
          title: 'Nitrogen',
          icon: 'N',
          content: [
            'Nitrogen is an important component of chlorophyll, proteins and other plant compounds.',
            'Nitrogen deficiency commonly affects plant growth and leaf colour, but symptoms can vary among crops and conditions.',
            'Excessive nitrogen can also create problems, so application should be guided by crop requirements and soil information.'
          ]
        },

        {
          id: 'phosphorus',
          title: 'Phosphorus',
          icon: 'P',
          content: [
            'Phosphorus participates in energy-transfer processes and has important roles in root development and reproductive growth.',
            'Availability of phosphorus is influenced by soil properties, including pH and chemical interactions in soil.',
            'Application should follow crop and soil recommendations.'
          ]
        },

        {
          id: 'potassium',
          title: 'Potassium',
          icon: 'K',
          content: [
            'Potassium supports many plant physiological processes, including water regulation and enzyme activity.',
            'Potassium nutrition can influence crop quality and plant response to environmental stress.',
            'Deficiency symptoms vary between crops and should be confirmed using appropriate diagnosis.'
          ]
        },

        {
          id: 'micronutrients',
          title: 'Micronutrients',
          icon: '🔬',
          content: [
            'Micronutrients such as zinc, iron, boron, manganese, copper and molybdenum are required in smaller amounts but remain essential.',
            'Deficiency and toxicity are different problems, so micronutrients should not be applied unnecessarily.',
            'Soil and plant testing can help identify nutrient problems.'
          ]
        },

        {
          id: 'organic-fertilizers',
          title: 'Organic Fertilizers',
          icon: '🍃',
          content: [
            'Organic nutrient sources include materials such as compost and manures.',
            'Their nutrient content can vary, so their use should consider material quality, application rate and crop requirement.',
            'Organic inputs can also contribute to soil organic matter.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 5
    ========================= */

    {
      id: 'pests-diseases',
      title: 'Pests & Diseases',
      icon: '🐛',
      description:
        'Learn how to understand, identify and manage common crop pests and plant diseases.',

      sections: [

        {
          id: 'plant-health',
          title: 'Plant Health',
          icon: '🌿',
          content: [
            'Healthy crops are generally better able to withstand environmental and biological stresses.',
            'Good seed quality, appropriate nutrition, water management, sanitation and suitable crop practices contribute to plant health.',
            'Regular field observation is important for detecting problems early.'
          ]
        },

        {
          id: 'disease-identification',
          title: 'Disease Identification',
          icon: '🔍',
          content: [
            'Disease diagnosis should consider symptoms, plant part affected, disease progression, environmental conditions and the crop growth stage.',
            'Leaf spots, wilting, yellowing, rotting, lesions and abnormal growth can have multiple possible causes.',
            'When the cause is uncertain, photographs, field history and expert or laboratory diagnosis can improve identification.'
          ]
        },

        {
          id: 'fungal-diseases',
          title: 'Fungal Diseases',
          icon: '🍄',
          content: [
            'Fungal and fungus-like pathogens cause many important crop diseases.',
            'Management can include resistant varieties, sanitation, appropriate spacing, irrigation management and suitable plant-protection measures.',
            'Correct identification is necessary before choosing a treatment.'
          ]
        },

        {
          id: 'bacterial-viral',
          title: 'Bacterial & Viral Diseases',
          icon: '🦠',
          content: [
            'Bacterial and viral diseases can cause leaf spots, wilting, mosaic patterns, distortion and other symptoms.',
            'Some viral diseases are associated with insect vectors, making vector management and prevention important.',
            'Diseased planting material can also contribute to spread.'
          ]
        },

        {
          id: 'insect-pests',
          title: 'Insect Pests',
          icon: '🐞',
          content: [
            'Insects may damage leaves, stems, roots, flowers, fruits or seeds.',
            'Field scouting helps determine pest presence and severity.',
            'Integrated Pest Management encourages prevention, monitoring and appropriate control methods rather than relying automatically on pesticides.'
          ]
        },

        {
          id: 'integrated-pest-management',
          title: 'Integrated Pest Management',
          icon: '🛡️',
          content: [
            'Integrated Pest Management combines compatible approaches to keep pest populations at manageable levels.',
            'Approaches may include cultural practices, resistant varieties, biological control, mechanical methods, monitoring and appropriately selected plant-protection products.',
            'Pesticide decisions should follow the crop label, local recommendations and applicable safety requirements.'
          ],
          tips: [
            'Identify the pest before selecting a control.',
            'Inspect plants regularly.',
            'Follow the product label and local agricultural recommendations when using pesticides.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 6
    ========================= */

    {
      id: 'weather-seasons',
      title: 'Weather & Seasons',
      icon: '🌦️',
      description:
        'Understand agricultural seasons, weather factors and how climate affects crop production.',

      sections: [

        {
          id: 'agricultural-weather',
          title: 'Weather & Agriculture',
          icon: '🌤️',
          content: [
            'Weather influences sowing, germination, crop growth, flowering, disease development, irrigation demand and harvesting.',
            'Farm decisions should consider current and forecast weather along with crop growth stage.',
            'Weather advisories can help farmers prepare for rainfall, heat, cold, wind and other conditions.'
          ]
        },

        {
          id: 'kharif',
          title: 'Kharif Season',
          icon: '🌧️',
          content: [
            'Kharif crops are generally associated with the monsoon season in India.',
            'Crop choice and sowing time vary by region and local rainfall pattern.',
            'Rice, maize, cotton and several pulses and oilseeds are examples of crops commonly associated with kharif production, although regional practices differ.'
          ]
        },

        {
          id: 'rabi',
          title: 'Rabi Season',
          icon: '❄️',
          content: [
            'Rabi crops are generally grown during the cooler season after the monsoon period.',
            'Wheat, mustard, chickpea and several other crops are commonly associated with rabi production.',
            'Actual sowing windows depend on region, crop variety, temperature and local recommendations.'
          ]
        },

        {
          id: 'zaid',
          title: 'Zaid Season',
          icon: '☀️',
          content: [
            'Zaid refers broadly to crops grown during the period between the major kharif and rabi seasons in many parts of India.',
            'Availability of irrigation and suitable temperature are important for many zaid crops.',
            'Crop choices vary by region.'
          ]
        },

        {
          id: 'climate-stress',
          title: 'Climate Stress',
          icon: '🌡️',
          content: [
            'Heat, drought, excessive rainfall, flooding, frost and strong winds can affect crop productivity.',
            'Risk management may involve suitable varieties, adjusted planting dates, water management, soil conservation and crop diversification.',
            'Local weather and agricultural advisories should be considered for time-sensitive decisions.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 7
    ========================= */

    {
      id: 'farming-practices',
      title: 'Farming Practices',
      icon: '🚜',
      description:
        'Learn practical concepts from land preparation and sowing to harvesting and storage.',

      sections: [

        {
          id: 'land-preparation',
          title: 'Land Preparation',
          icon: '🚜',
          content: [
            'Land preparation aims to create suitable conditions for seed placement, root development and crop establishment.',
            'The intensity and type of tillage should depend on soil condition, crop and production system.',
            'Unnecessary soil disturbance can increase costs and may contribute to erosion under some conditions.'
          ]
        },

        {
          id: 'seed-treatment',
          title: 'Seed Treatment',
          icon: '🌰',
          content: [
            'Seed treatment can help protect seed and young seedlings from certain seed-borne or soil-associated problems.',
            'Treatment methods vary by crop, seed condition and target problem.',
            'Only recommended products and methods should be used.'
          ]
        },

        {
          id: 'crop-rotation',
          title: 'Crop Rotation',
          icon: '🔄',
          content: [
            'Crop rotation means growing different crops sequentially on the same land.',
            'Well-planned rotations can improve resource use and may help manage some weeds, pests and diseases.',
            'Rotations should consider local climate, soil, market and farm resources.'
          ]
        },

        {
          id: 'weed-management-practices',
          title: 'Weed Management',
          icon: '🌿',
          content: [
            'Effective weed management begins with preventing weed establishment and monitoring fields.',
            'Cultural, mechanical, biological and chemical methods can be combined where appropriate.',
            'Timing is important because weeds can compete strongly with crops during critical growth stages.'
          ]
        },

        {
          id: 'harvesting',
          title: 'Harvesting',
          icon: '🌾',
          content: [
            'Harvesting at suitable maturity helps protect crop yield and quality.',
            'Harvest methods differ among cereals, pulses, oilseeds, fruits, vegetables and other crops.',
            'Harvesting under unsuitable moisture or weather conditions can increase losses.'
          ]
        },

        {
          id: 'storage',
          title: 'Storage',
          icon: '📦',
          content: [
            'Good storage protects agricultural produce from moisture, insects, rodents, microorganisms and physical damage.',
            'Drying to a suitable moisture level before storage is important for many crops.',
            'Storage conditions should be appropriate for the particular commodity.'
          ]
        }

      ]
    },


    /* =========================
       CHAPTER 8
    ========================= */

    {
      id: 'farm-management',
      title: 'Farm Management',
      icon: '💰',
      description:
        'Understand basic farm planning, costs, yield, post-harvest handling and market considerations.',

      sections: [

        {
          id: 'farm-planning',
          title: 'Farm Planning',
          icon: '📋',
          content: [
            'Farm planning involves deciding what to produce, how to produce it and how available land, labour, water and capital will be used.',
            'Planning should consider production costs, expected yield, market demand, risk and available resources.',
            'Keeping records helps farmers compare performance across seasons.'
          ]
        },

        {
          id: 'farm-cost',
          title: 'Production Cost',
          icon: '💰',
          content: [
            'Farm costs can include seed, fertilizer, plant protection, irrigation, labour, machinery, land preparation, harvesting, transportation and other expenses.',
            'Recording expenses by crop helps evaluate profitability and identify areas where efficiency can be improved.'
          ]
        },

        {
          id: 'yield',
          title: 'Yield',
          icon: '📊',
          content: [
            'Yield is the amount of agricultural produce obtained from a given area.',
            'Yield is affected by genetics, climate, soil, water, nutrition, pest and disease management and crop practices.',
            'Higher yield alone does not necessarily mean higher profitability because production costs also matter.'
          ]
        },

        {
          id: 'post-harvest',
          title: 'Post-Harvest Management',
          icon: '📦',
          content: [
            'Post-harvest management includes cleaning, grading, drying, storage, packaging, transportation and processing.',
            'Reducing physical and biological losses can improve the value of agricultural produce.',
            'Commodity-specific storage and handling requirements should be followed.'
          ]
        },

        {
          id: 'marketing',
          title: 'Agricultural Marketing',
          icon: '🏪',
          content: [
            'Agricultural marketing includes activities involved in moving produce from the farm to buyers and markets.',
            'Quality, grading, timing, transportation, storage and market information can influence returns.',
            'Farmers should use reliable local market and government information when making selling decisions.'
          ]
        }

      ]
    }

  ];


  /* =========================
     METHODS
  ========================= */

  search(): void {

    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      this.searchResults = [];
      return;
    }

    const results: {
      chapter: GuideChapter;
      section: GuideSection;
    }[] = [];

    for (const chapter of this.chapters) {

      for (const section of chapter.sections) {

        const searchableText = [
          chapter.title,
          chapter.description,
          section.title,
          ...section.content,
          ...(section.tips ?? [])
        ]
          .join(' ')
          .toLowerCase();

        if (searchableText.includes(query)) {

          results.push({
            chapter,
            section
          });

        }

      }

    }

    this.searchResults = results;

  }


  quickSearch(text: string): void {
    this.searchText = text;
    this.search();
  }


  clearSearch(): void {
    this.searchText = '';
    this.searchResults = [];
  }


  openChapter(chapter: GuideChapter): void {

    this.selectedChapter = chapter;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  closeChapter(): void {

    this.selectedChapter = null;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  openSearchResult(
    result: {
      chapter: GuideChapter;
      section: GuideSection;
    }
  ): void {

    this.searchText = '';
    this.searchResults = [];

    this.selectedChapter = result.chapter;

    setTimeout(() => {

      this.scrollToSection(result.section.id);

    }, 100);

  }


  scrollToSection(id: string): void {

    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }


  getChapterNumber(chapter: GuideChapter): string {

    const index = this.chapters.indexOf(chapter) + 1;

    return String(index).padStart(2, '0');

  }


  getSectionNumber(
    chapter: GuideChapter,
    section: GuideSection
  ): string {

    const index = chapter.sections.indexOf(section) + 1;

    return `SECTION ${index}`;

  }

}