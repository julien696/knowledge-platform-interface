import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('knowledge_platform_token');

    if (token && req.url.includes('/api/')) {
        // Vérifier si le token n'est pas expiré
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp >= currentTime) {
                const authRequest = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`)
                });
                return next(authRequest);
            }
        } catch (error) {
            // Token invalide, on continue sans l'ajouter
        }
    }

    return next(req);
};
