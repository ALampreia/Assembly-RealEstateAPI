import { Injectable, inject, signal} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User} from '../models/shared/user';
import {CreateUser} from '../models/shared/create-user';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5109/api/user';
    
    users = signal<User[]>([]);
    selectedUser = signal< User | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    async loadAll():Promise<void>{
        this.loading.set(true);
        this.error.set(null);
        try{
            const data = await this.http.get<User[]>(this.apiUrl).toPromise();
            this.users.set(data || []);
        } catch (error: any){
            this.error.set(error.message || 'Failed to load users');
        } finally {
            this.loading.set(false);
        }
    }

    async loadById(id: number): Promise<void>{
        this.loading.set(true);
        this.error.set(null);
        try{
            const data = await this.http.get<User>(`${this.apiUrl}/${id}`).toPromise();
            this.selectedUser.set(data|| null);
        } catch (error: any){
            this.error.set(error.message || 'Failed to load user');
        } finally {
            this.loading.set(false);
        }
    }

    async loadByEmail(email: string): Promise<void>{
        this.loading.set(true);
        this.error.set(null);
        try{
            const data = await this.http.get<User>(`${this.apiUrl}/GetByEmail?email=${email}`).toPromise();
            this.selectedUser.set(data|| null);
        } catch (error: any){
            this.error.set(error.message || 'Failed to load user');
        } finally {
            this.loading.set(false);
        }
    }

    async Create(user: CreateUser): Promise<User | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const created = await this.http.post<User>(this.apiUrl, user).toPromise();
            if (created) {
                this.users.update(list => ...[list, created]);
            }
            return created || null;
        } catch (error: any){
            this.error.set(error.message || 'Failed to create user');
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async update(id: number, user: User): Promise<User | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const updated = await this.http.put<User>(`${this.apiUrl}/${id}, user`).toPromise();
            if(updated){
                this.users.update(list =>
                    list.map( u => u.id ? updated : u)
                );
            }
            return updated || null;
        } catch (error: any){
            this.error.set(error.message || 'Failed to update user');
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async delete(id: number): Promise<boolean>{
        this.loading.set(true);
        this.error.set(null);
    }try {
        await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
        this.users.update(list => list.filter(u => u.id !== id));
        return true;
    } catch (error: any){
        this.error.set(error.message || 'Failed to delete user');
        return false;
    }finally{
        this.loading.set(false);
    }
}