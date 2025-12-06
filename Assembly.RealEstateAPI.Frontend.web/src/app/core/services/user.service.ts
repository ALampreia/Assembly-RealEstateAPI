import { Injectable, inject, signal} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User} from '../models/shared/user';
import { CreateUser } from '../models/shared/create-user';
import { Observable, defer, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';

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

    loadAll():Observable<void>{
      return defer(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.get<User[]>(this.apiUrl)
        .pipe(
          tap(data => this.users.set(data ?? [])),
          map(() => void 0),
          catchError( error => {
            this.error.set((error as any)?.message ?? 'Failed to load users');
            return throwError(() => error);
            }),
          finalize(() => this.loading.set(false))
          );
        });
    }

    loadById(id: number): Observable<void>{
        return defer(() => {
          this.loading.set(true);
          this.error.set(null);
          return this.http.get<User>(`${this.apiUrl}/${id}`)
          .pipe(
            tap(this.selectedUser.set(data ?? null)),
            map(() => void 0),
            catchError( error => {
              this.error.set((error as any)?.message ?? 'Failed to load user');
              return throwError(() => error);
            }),
          finalize(() => this.loading.set(false))
          );
        });
    }

    loadByEmail(email: string): Observable<void>{
      return defer(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.get<User>(`${this.apiUrl}/GetByEmail?email=${email}`)
        .pipe(
          tap(this.selectedUser.set(data ?? null)),
          map(() => void 0),
          catchError( error => {
            this.error.set((error as any)?.message ?? 'Failed to load user');
            return throwError(() => error);
            }),
          finalize(() => this.loading.set(false))
          );
        });
    }

    create(user: CreateUser): Observable<User | null> {
        return defer(() =>{
        this.loading.set(true);
        this.error.set(null);
        return this.http.post<User>(this.apiUrl, user)
        .pipe(
          tap(created => {
            if(created)
            this.users.update(list => [...list, created]);
            }),
          map(created => created ?? null),
          catchError(error => {
            this.error.set((error as any)?.message?? 'Failed to create user');
            return throwError(() => error);
            }),
          finalize(() => this.loading.set(false))
        );
      });
    }

    update(id: number, user: User): Observable<User | null> {
        return defer(() => {
          this.loading.set(true);
          this.error.set(null);
          return this.http.put<User>(`${this.apiUrl}/${id}, user`)
          .pipe(
            tap(updated => {
              if(updated) {
                this.users.update(list => list.map( u => (u.id === id ? updated : u)));
                if(this.selectedUser() && this.selectedUser()!.id === id){
                  this.selectedUser.set(updated);
                  }
                }
              }),
                map(updated => updated ?? null),
                catchError(error => {
                  this.error.set((error as any)?.message ?? 'Failed to update user');
                  return throwError(() => error);
              }),
              finalize(() =>this.loading.set(false))
              );
            });
    }

    delete(id: number): Observable<boolean>{
      return defer(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
        .pipe(
          tap(() => {
            this.users.update(list => list.filter(u => u.id !== id));
            if(this.selectedUser() && this.selectedUser()!.id === id){
              this.selectedUser.set(null);
            }
          }),
        map(() => true),
        catchError(error => {
          this.error.set((error as any)?.message ?? 'Failed to delete user');
          return throwError(() => error);
          }),
        finalize(() => this.loading.set(false))
        );
      });
    }
