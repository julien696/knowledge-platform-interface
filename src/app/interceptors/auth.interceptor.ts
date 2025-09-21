import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    
    const token = authService.getToken();

    if (token && authService.isAuthenticated() && req.url.includes('/api/')) {
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

        return next(authRequest);
    }

    return next(req);
};
