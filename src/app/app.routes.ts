import { Routes } from '@angular/router';
import { RouteNamesEnum } from '@core/enums/routes/routes-names.enum';

export const routes: Routes = [
  {
    path: RouteNamesEnum.ASSISTANT,
    loadComponent: () =>
      import('./modules/assistant/assistant.component').then((module) => module.AssistantComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RouteNamesEnum.ASSISTANT,
  },
  {
    path: '**',
    redirectTo: RouteNamesEnum.ASSISTANT,
  },
];
