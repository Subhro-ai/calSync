import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent() {
            return import('./landing-page/landing-page').then(m => m.LandingPage);
        },
    }
];
