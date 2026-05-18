import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-form.component.html'
})
export class AdminFormComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  adminForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { name, email, password } = this.adminForm.value;

    this.adminService.createAdmin({ name, email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('✅ Administrateur créé avec succès !');
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Erreur lors de la création');
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  get name() { return this.adminForm.get('name'); }
  get email() { return this.adminForm.get('email'); }
  get password() { return this.adminForm.get('password'); }
  get confirmPassword() { return this.adminForm.get('confirmPassword'); }
}