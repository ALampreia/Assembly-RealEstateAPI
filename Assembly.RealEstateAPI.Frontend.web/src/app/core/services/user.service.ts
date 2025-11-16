import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Credentials } from './models/auth/credentials';
import { CreateAccount } from '../models/auth/create-account';
import { Account } from '../models/auth/account';
import { UpdateAccount } from '../models/auth/update-account';

interface AuthState{
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
    private readonly apiUrl = 'http://localhost:5109/api';

    private authState = signal<AuthState>({
        token: localstorage.getItem('authToken'),
        isAuthenticated: !!localStorage.getItem('authToken'),
        userId: this.parseTokenClaim('Id'),
        email: this.parseTokenClaim('Email'),
        role: this.parseTokenClaim('Role')
    });

    loading = signal(false);
    error = signal<string | null>(null);

    readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
    readonly token = computed(() => this.authState().token);
    readonly currentUser = computed(() =>({
        id: this.authState().userId,
        email: this.authState().email,
        role: this.authState().role
    }));

    readonly isAgent = computed(() => {
        const role = this.authState().role;
        return ['Agent', 'Manager', 'Broker', 'Admin'].includes(role || '');
    });

    readonly isStaff = computed(() => this.authState().role === 'Staff');
    readonly iUser = computed(() => this.authState().role === 'User');

    async
}