import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent() {
            return import('./landing-page/landing-page').then(m => m.LandingPage);
        },
    },
    // Add the two new routes below
    {
        path: 'ios-guide',
        loadComponent() {
            return import('./ios-guide/ios-guide').then(m => m.IosGuide);
        },
    },
    {
        path: 'android-guide',
        loadComponent() {
            return import('./android-guide/android-guide').then(m => m.AndroidGuide);
        },
    }
];