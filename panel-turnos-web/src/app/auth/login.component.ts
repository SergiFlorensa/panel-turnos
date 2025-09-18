import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error = '';
  success = ''; // 👈 añadimos esta propiedad

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    console.log('Intentando login con:', email, password);

    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        console.log('Login OK, token:', res.access_token);

        this.success = '✅ Inicio de sesión correcto';
        this.error = '';

        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error desde backend:', err);
        this.error = '❌ Credenciales inválidas';
        this.success = '';
      },
    });
  }
}
