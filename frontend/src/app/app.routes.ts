import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard.component').then(m => m.DashboardComponent)
  },

  {
    path: 'crop',
    loadComponent: () =>
      import('./pages/crop.component').then(m => m.CropComponent)
  },

  {
    path: 'soil',
    loadComponent: () =>
      import('./pages/soil.component').then(m => m.SoilComponent)
  },

  {
    path: 'disease',
    loadComponent: () =>
      import('./pages/disease.component').then(m => m.DiseaseComponent)
  },

  {
    path: 'disaster',
    loadComponent: () =>
      import('./pages/disaster/disaster').then(m => m.Disaster)
  },

  {
    path: 'assistant',
    loadComponent: () =>
      import('./pages/assistant.component').then(m => m.AssistantComponent)
  },

  {
    path: 'fertilizer',
    loadComponent: () =>
      import('./pages/fertilizer.component').then(m => m.FertilizerComponent)
  },

  {
    path: 'yield',
    loadComponent: () =>
      import('./pages/yield.component').then(m => m.YieldComponent)
  },

  {
    path: 'weather',
    loadComponent: () =>
      import('./pages/weather.component').then(m => m.WeatherComponent)
  },

  {
    path: 'mandi',
    loadComponent: () =>
      import('./pages/mandi.component').then(m => m.MandiComponent)
  },

  {
    path: 'health-card',
    loadComponent: () =>
      import('./pages/health-card.component').then(m => m.HealthCardComponent)
  },

  {
    path: 'knowledge',
    loadComponent: () =>
      import('./pages/knowledge.component').then(m => m.KnowledgeComponent)
  },

  {
    path: '**',
    redirectTo: ''
  }
];