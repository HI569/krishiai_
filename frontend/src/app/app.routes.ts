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
    path: 'assistant',
    loadComponent: () =>
      import('./pages/assistant.component').then(m => m.AssistantComponent)
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