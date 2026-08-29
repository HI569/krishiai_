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
      min-height: 100vh;
      background: #f6f8f5;
      color: #17352a;
    }

    .content-width {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
    }


    /* =========================
       HEADER
    ========================= */

    .guide-header {
      background: linear-gradient(
        135deg,
        #073b2a 0%,
        #0a533b 55%,
        #0c6846 100%
      );

      color: white;
      padding: 54px 0 58px;
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
      gap: 15px;
      margin-bottom: 14px;
    }

    .book-icon {
      width: 56px;
      height: 56px;
      display: grid;
      place-items: center;
      border-radius: 16px;
      background: rgba(255,255,255,.13);
      font-size: 29px;
    }

    .eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      opacity: .72;
      text-align: left;
    }

    .guide-header h1 {
      margin: 2px 0 0;
      font-size: clamp(36px, 5vw, 52px);
      line-height: 1.05;
      letter-spacing: -1.5px;
    }

    .subtitle {
      max-width: 680px;
      margin: 20px auto 30px;
      font-size: 16px;
      line-height: 1.65;
      color: rgba(255,255,255,.82);
    }


    /* SEARCH */

    .search-box {
      width: min(760px, 100%);
      height: 62px;
      margin: auto;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 15px;
      box-shadow: 0 16px 40px rgba(0,0,0,.18);
      padding: 0 18px;
    }

    .search-icon {
      color: #537167;
      font-size: 30px;
      line-height: 1;
      margin-right: 12px;
      transform: rotate(-15deg);
    }

    .search-box input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      font-size: 16px;
      color: #183a2f;
      background: transparent;
    }

    .search-box input::placeholder {
      color: #91a29b;
    }

    .clear-btn {
      border: none;
      background: #edf3ef;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      color: #456158;
    }

    .search-hint {
      margin-top: 14px;
      font-size: 12px;
      color: rgba(255,255,255,.7);
    }

    .search-hint button {
      border: none;
      background: rgba(255,255,255,.1);
      color: white;
      border-radius: 20px;
      padding: 6px 11px;
      margin-left: 5px;
      cursor: pointer;
    }

    .search-hint button:hover {
      background: rgba(255,255,255,.18);
    }


    /* =========================
       LIBRARY
    ========================= */

    .library {
      padding: 52px 0 80px;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 24px;
    }

    .small-label {
      display: block;
      color: #668077;
      font-size: 10px;
      letter-spacing: 1.7px;
      font-weight: 800;
      margin-bottom: 7px;
    }

    .section-heading h2 {
      margin: 0;
      font-size: 29px;
      color: #123d2f;
    }

    .chapter-count {
      color: #678078;
      font-size: 13px;
    }


    /* CHAPTER CARDS */

    .chapter-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .chapter-card {
      position: relative;
      text-align: left;
      border: 1px solid #e1e9e4;
      background: white;
      border-radius: 18px;
      padding: 25px;
      min-height: 230px;
      cursor: pointer;
      transition:
        transform .18s ease,
        box-shadow .18s ease,
        border-color .18s ease;
      overflow: hidden;
    }

    .chapter-card:hover {
      transform: translateY(-4px);
      border-color: #a9c8b9;
      box-shadow: 0 15px 35px rgba(20,60,45,.09);
    }

    .chapter-number {
      position: absolute;
      top: 17px;
      right: 20px;
      font-size: 12px;
      color: #b3c2bc;
      font-weight: 700;
    }

    .chapter-icon {
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      border-radius: 15px;
      background: #edf6f0;
      font-size: 27px;
      margin-bottom: 18px;
    }

    .chapter-content h3 {
      margin: 0 0 9px;
      color: #123c2e;
      font-size: 19px;
    }

    .chapter-content p {
      margin: 0;
      color: #6a7d75;
      font-size: 13px;
      line-height: 1.55;
      min-height: 42px;
    }

    .chapter-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 22px;
      color: #789087;
      font-size: 12px;
      font-weight: 600;
    }

    .arrow {
      font-size: 20px;
      color: #087f4e;
    }


    /* FEATURED */

    .featured {
      margin-top: 32px;
      background: #eaf4ee;
      border: 1px solid #d5e8dc;
      border-radius: 20px;
      padding: 27px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .featured-icon {
      width: 58px;
      height: 58px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      background: white;
      border-radius: 16px;
      font-size: 27px;
    }

    .featured h2 {
      margin: 0 0 5px;
      color: #164635;
      font-size: 20px;
    }

    .featured p {
      margin: 0;
      color: #60776d;
      font-size: 13px;
      line-height: 1.5;
    }

    .featured button {
      margin-left: auto;
      flex: 0 0 auto;
      border: none;
      border-radius: 10px;
      background: #087f4e;
      color: white;
      padding: 12px 17px;
      font-weight: 700;
      cursor: pointer;
    }


    /* =========================
       SEARCH RESULTS
    ========================= */

    .results-section {
      padding: 45px 0 75px;
    }

    .results-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 25px;
    }

    .results-heading h2 {
      margin: 0;
      color: #143e30;
      font-size: 28px;
    }

    .back-btn {
      border: 1px solid #d8e4de;
      background: white;
      color: #315c4c;
      border-radius: 10px;
      padding: 10px 15px;
      cursor: pointer;
    }

    .result-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .result-card {
      display: flex;
      gap: 16px;
      text-align: left;
      border: 1px solid #e0e8e3;
      background: white;
      border-radius: 15px;
      padding: 19px;
      cursor: pointer;
      transition: .18s ease;
    }

    .result-card:hover {
      border-color: #a7c7b7;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,.06);
    }

    .result-icon {
      width: 45px;
      height: 45px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      background: #edf6f0;
      border-radius: 12px;
      font-size: 22px;
    }

    .result-category {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7b9087;
      font-weight: 800;
    }

    .result-body h3 {
      margin: 5px 0;
      color: #163f31;
      font-size: 17px;
    }

    .result-body p {
      margin: 0;
      color: #6b7d76;
      font-size: 12px;
      line-height: 1.5;
    }

    .read-link {
      display: inline-block;
      margin-top: 10px;
      color: #087f4e;
      font-size: 12px;
      font-weight: 700;
    }

    .no-results {
      background: white;
      border: 1px solid #e3eae6;
      border-radius: 18px;
      text-align: center;
      padding: 70px 20px;
    }

    .no-result-icon {
      font-size: 42px;
      margin-bottom: 10px;
    }

    .no-results h3 {
      margin: 0 0 8px;
      color: #193f32;
    }

    .no-results p {
      margin: 0;
      color: #72847c;
    }


    /* =========================
       CHAPTER VIEW
    ========================= */

    .chapter-view {
      padding: 35px 0 80px;
    }

    .chapter-back {
      border: none;
      background: transparent;
      color: #39705a;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 0;
      cursor: pointer;
      margin-bottom: 22px;
    }

    .chapter-hero {
      display: flex;
      align-items: center;
      gap: 22px;
      background: white;
      border: 1px solid #e0e8e3;
      border-radius: 20px;
      padding: 30px;
    }

    .chapter-hero-icon {
      width: 78px;
      height: 78px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 20px;
      background: #eaf5ee;
      font-size: 38px;
    }

    .chapter-hero h1 {
      margin: 0 0 7px;
      color: #123d2f;
      font-size: 34px;
    }

    .chapter-hero p {
      margin: 0;
      color: #697d74;
      line-height: 1.55;
    }


    /* NAVIGATION */

    .section-navigation {
      position: sticky;
      top: 0;
      z-index: 10;
      margin: 18px 0;
      padding: 13px;
      display: flex;
      gap: 7px;
      align-items: center;
      overflow-x: auto;
      background: rgba(246,248,245,.94);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e3eae5;
    }

    .nav-title {
      flex: 0 0 auto;
      color: #789087;
      font-size: 10px;
      letter-spacing: 1px;
      font-weight: 800;
      margin-right: 6px;
    }

    .section-navigation button {
      flex: 0 0 auto;
      border: 1px solid #dbe6e0;
      background: white;
      color: #47645a;
      border-radius: 20px;
      padding: 8px 12px;
      font-size: 11px;
      cursor: pointer;
    }

    .section-navigation button:hover {
      background: #eaf5ee;
      border-color: #b9d4c4;
      color: #176143;
    }


    /* CONTENT */

    .chapter-content-area {
      background: white;
      border: 1px solid #e0e8e3;
      border-radius: 20px;
      overflow: hidden;
    }

    .guide-section {
      padding: 36px 40px;
      border-bottom: 1px solid #e8eee9;
      scroll-margin-top: 75px;
    }

    .guide-section:last-child {
      border-bottom: none;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .section-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      background: #eef6f1;
      border-radius: 13px;
      font-size: 23px;
    }

    .section-number {
      color: #7b9087;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .section-title h2 {
      margin: 2px 0 0;
      color: #153f31;
      font-size: 23px;
    }

    .section-text p {
      margin: 0 0 14px;
      color: #526961;
      line-height: 1.75;
      font-size: 14px;
    }

    .section-text p:last-child {
      margin-bottom: 0;
    }


    /* TIPS */

    .tips-box {
      margin-top: 23px;
      background: #f2f8f4;
      border-left: 4px solid #087f4e;
      border-radius: 8px;
      padding: 16px 19px;
    }

    .tips-title {
      font-size: 12px;
      font-weight: 800;
      color: #176143;
      margin-bottom: 8px;
    }

    .tips-box ul {
      margin: 0;
      padding-left: 20px;
      color: #557067;
    }

    .tips-box li {
      margin: 5px 0;
      font-size: 13px;
      line-height: 1.5;
    }


    /* END */

    .chapter-end {
      margin-top: 25px;
      padding: 40px 20px;
      text-align: center;
      background: #edf6f0;
      border-radius: 18px;
    }

    .chapter-end > div {
      font-size: 32px;
    }

    .chapter-end h2 {
      margin: 8px 0 6px;
      color: #194736;
    }

    .chapter-end p {
      color: #667b72;
      font-size: 13px;
    }

    .chapter-end button {
      margin-top: 10px;
      border: none;
      border-radius: 10px;
      padding: 11px 17px;
      background: #087f4e;
      color: white;
      font-weight: 700;
      cursor: pointer;
    }


    /* FOOTER */

    .guide-footer {
      border-top: 1px solid #dfe8e2;
      background: white;
      padding: 24px 0;
    }

    .guide-footer .content-width {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      color: #7b8d86;
      font-size: 11px;
      line-height: 1.5;
    }

    .guide-footer strong {
      display: block;
      color: #315749;
      margin-bottom: 3px;
    }


    /* =========================
       RESPONSIVE
    ========================= */

    @media (max-width: 900px) {

      .chapter-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .result-grid {
        grid-template-columns: 1fr;
      }

    }

    @media (max-width: 650px) {

      .content-width,
      .header-content {
        width: min(100% - 30px, 1180px);
      }

      .guide-header {
        padding: 35px 0 40px;
      }

      .chapter-grid {
        grid-template-columns: 1fr;
      }

      .section-heading {
        align-items: start;
        flex-direction: column;
        gap: 8px;
      }

      .featured {
        align-items: flex-start;
        flex-direction: column;
      }

      .featured button {
        margin-left: 0;
      }

      .chapter-hero {
        align-items: flex-start;
        flex-direction: column;
      }

      .guide-section {
        padding: 28px 22px;
      }

      .chapter-hero h1 {
        font-size: 28px;
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