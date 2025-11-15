import { HttpClient } from '@angular/core/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const toekn = localStorage.getItem('authToken');

    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }

    return next(req);
}
