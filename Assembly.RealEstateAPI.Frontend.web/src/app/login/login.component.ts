import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })

export class LoginComponent{
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
      }

    this.loading.set(true);
    this.error.set(null);

    this.auth.loginEmployee(this.form.value).subscribe({
      next: () => {this.loading.set(false);},
      error: (err) => {
        this.error.set((err as any)?.message ?? 'Login failed');
        this.loading.set(false);
        }
       });
    }
  }
