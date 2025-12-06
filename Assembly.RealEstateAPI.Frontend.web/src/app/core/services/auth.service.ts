import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Credentials } from '../models/auth/credentials';
import { Observable, defer, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    userId: number | null;
    email: string | null;
    role: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly apiUrl = 'http://localhost:5109/api/Authentication';

    private authState = signal<AuthState>({
        token: localStorage.getItem('authToken'),
        isAuthenticated: !!localStorage.getItem('authToken'),
        userId: this.parseTokenClaim('Id'),
        email: this.parseTokenClaim('Email'),
        role: this.parseTokenClaim('Role')
    });

    loading = signal(false);
    error = signal<string | null>(null);

    readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
    readonly token = computed(() => this.authState().token);
    readonly currentUser = computed(() => ({
        id: this.authState().userId,
        email: this.authState().email,
        role: this.authState().role
    }));

    readonly isAgent = computed(() => {
        const role = this.authState().role;
        return ['Agent', 'Manager', 'Broker', 'Admin'].includes(role || '');
    });

    readonly isStaff = computed(() => this.authState().role === 'Staff');
    readonly isUser = computed(() => this.authState().role === 'User');

    loginEmployee(credentials: Credentials): Observable<void>{
        return defer(() => {
            this.loading.set(true);
            this.error.set(null);
            return this.http.post<string>(
                `${this.apiUrl}/AuthenticationEmployee`,
                credentials,
                {responseType: 'text' as 'json'}
            ).pipe(
                tap(token => {
                    if(token) {
                        this.setAuthToken(token);
                        this.router.navigate(['/dashboard']);
                    }
                }),
                map(() => void 0),
                catchError(err => {
                    this.error.set(err?.message || 'Login failed');
                    return throwError(() => err);
                }),
                finalize(() => this.loading.set(false))
            );
        });
    }

    loginUser(credentials: Credentials): Observable<void>{
        return defer (() => {
            this.loading.set(true);
            this.error.set(null);
            return this.http.post<string>(
                `${this.apiUrl}/AuthenticationUser`,
                credentials,
                {responseType: 'text' as 'json'}
            ).pipe(
                tap(token => {
                    if(token) {
                        this.setAuthToken(token);
                        this.router.navigate(['/']);
                    }
                }),
                map(() => void 0),
                catchError(err => {
                    this.error.set(err?.message || 'Login failed');
                    return throwError(() => err);
                }),
                finalize(() => this.loading.set(false))
            );
        });
    }

    logout(): void{
        localStorage.removeItem('authToken');
        this.authState.set({
            token: null,
            isAuthenticated: false,
            userId: null,
            email: null,
            role: null
        });
        this.router.navigate(['/login']);
    }

    private setAuthToken(token: string): void{
        localStorage.setItem('authToken', token);
        this.authState.set({
            token,
            isAuthenticated: true,
            userId: this.parseTokenClaim('Id', token),
            email: this.parseTokenClaim('Email', token),
            role: this.parseTokenClaim('Role', token)
        });
    }

    private parseTokenClaim(claim: string, token?: string): any{
        const tokenToUse = token || localStorage.getItem('authToken');
        if (!tokenToUse)
            return null;

        try{
            const payload = JSON.parse(atob(tokenToUse.split('.')[1]));
            return payload[claim] || null;
        } catch{
            return null;
        }
    }
 }