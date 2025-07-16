import { Routes } from '@angular/router';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { TodaysTale } from './components/todays-tale/todays-tale';
import { GreatBookOfTales } from './components/great-book-of-tales/great-book-of-tales';

export const routes: Routes = [
    { path: '', component: SplashScreen },
    { path: 'todays-tale', component: TodaysTale },
    { path: 'great-book-of-tales', component: GreatBookOfTales },
    { path: '**', redirectTo: '' }
];
