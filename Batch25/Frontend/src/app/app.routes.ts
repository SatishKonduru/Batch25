import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { adminGuard } from './guards/admin.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home', //localhost:4200/home
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'profile',
        component: UserProfileComponent
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [adminGuard]
    },
    {
        path: 'reset-password/:token',
        component: PasswordResetComponent
    },

    
    {
        path: '**',
        component: PageNotFoundComponent
     },
   
];
