import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LandingService,
  type ContactFormData,
} from '../../../core/services/landing/landing.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hero-gradient min-h-screen">
      <!-- Header -->
      <header
        class="relative overflow-hidden border-b border-border bg-surface/90 backdrop-blur-sm"
      >
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div class="flex animate-fade-in items-center space-x-3">
              <img src="/assets/images/logo.png" alt="UniON" class="animate-float h-10 w-auto" />
              <h1 class="text-2xl font-bold text-primary-600">UniON</h1>
            </div>
            <div class="flex animate-slide-in space-x-4">
              <button
                (click)="navigateToLogin()"
                class="rounded-lg border border-primary-200 bg-surface px-4 py-2 text-sm font-medium text-primary-600 transition-all duration-300 hover:border-primary-300 hover:bg-primary-50 hover:shadow-soft"
              >
                Iniciar Sesión
              </button>
              <button
                (click)="navigateToRegister()"
                class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-surface transition-all duration-300 hover:bg-primary-700 hover:shadow-hover"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="bg-grid relative overflow-hidden py-20 sm:py-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="animate-slide-in text-center">
            <h1 class="text-4xl font-bold tracking-tight text-text-base sm:text-6xl">
              Conecta, Colabora y
              <span class="animate-pulse-slow text-primary-600">Crea</span> con la
              <span class="text-secondary-600">Comunidad Universitaria</span>
            </h1>
            <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-muted">
              UniON es la plataforma que democratiza la colaboración académica global, conectando
              estudiantes y egresados verificados para crear proyectos innovadores que transforman
              ideas en acción concreta.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <button
                (click)="navigateToRegister()"
                class="group rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-surface shadow-soft transition-all duration-300 hover:scale-105 hover:bg-primary-700 hover:shadow-hover"
              >
                <span class="group-hover:animate-pulse">Comenzar Ahora</span>
              </button>
              <button
                (click)="scrollToFeatures()"
                class="group text-base font-semibold leading-6 text-text-base transition-colors duration-300 hover:text-primary-600"
              >
                Conocer más
                <span
                  aria-hidden="true"
                  class="inline-block transition-transform group-hover:translate-x-1"
                  >→</span
                >
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="bg-surface py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-text-base sm:text-4xl">
              Una plataforma diseñada para la colaboración académica
            </h2>
            <p class="mt-6 text-lg leading-8 text-text-muted">
              Descubre las herramientas que hacen de UniON el lugar ideal para el networking
              académico y la innovación interuniversitaria.
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div
                class="feature-card flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft hover:shadow-hover"
              >
                <dt
                  class="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-base"
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-soft"
                  >
                    <svg
                      class="h-6 w-6 text-surface"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </div>
                  Comunidad Verificada
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                  <p class="flex-auto">
                    Acceso exclusivo para estudiantes y egresados con credenciales universitarias
                    verificadas, garantizando un entorno académico confiable y de calidad.
                  </p>
                </dd>
              </div>
              <div
                class="feature-card flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft hover:shadow-hover"
              >
                <dt
                  class="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-base"
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-600 shadow-soft"
                  >
                    <svg
                      class="h-6 w-6 text-surface"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  Proyectos Colaborativos
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                  <p class="flex-auto">
                    Crea y participa en proyectos multidisciplinarios verificados por instituciones,
                    transformando ideas académicas en iniciativas concretas de impacto real.
                  </p>
                </dd>
              </div>
              <div
                class="feature-card flex flex-col rounded-xl border border-border bg-surface p-6 shadow-soft hover:shadow-hover"
              >
                <dt
                  class="flex items-center gap-x-3 text-base font-semibold leading-7 text-text-base"
                >
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600 shadow-soft"
                  >
                    <svg
                      class="h-6 w-6 text-surface"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z"
                      />
                    </svg>
                  </div>
                  Red Global Universitaria
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-text-muted">
                  <p class="flex-auto">
                    Conecta con estudiantes y profesionales de universidades de todo el mundo,
                    expandiendo tu red de contactos académicos y profesionales de manera
                    significativa.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="bg-primary-900 py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0">
            <h2 class="text-3xl font-bold tracking-tight text-surface sm:text-4xl">
              Más que una red social académica
            </h2>
            <p class="mt-6 text-lg leading-8 text-primary-200">
              UniON va más allá del networking tradicional, sirviendo como catalizador para la
              innovación interuniversitaria y el desarrollo profesional.
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div
                class="flex flex-col rounded-xl border border-primary-700 bg-primary-800/50 p-6 transition-all duration-300 hover:bg-primary-800/70"
              >
                <dt class="mb-4 text-lg font-semibold leading-7 text-surface">
                  🎓 Para Estudiantes y Egresados
                </dt>
                <dd class="flex flex-auto flex-col text-base leading-7 text-primary-200">
                  <div class="grid grid-cols-1 gap-2">
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Participa en foros académicos especializados
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Colabora en proyectos de investigación verificados
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Accede a oportunidades de intercambio y becas
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Construye un portafolio académico sólido
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Conecta con profesionales de tu área de interés
                    </p>
                  </div>
                </dd>
              </div>
              <div
                class="flex flex-col rounded-xl border border-primary-700 bg-primary-800/50 p-6 transition-all duration-300 hover:bg-primary-800/70"
              >
                <dt class="mb-4 text-lg font-semibold leading-7 text-surface">
                  🏛️ Para Instituciones
                </dt>
                <dd class="flex flex-auto flex-col text-base leading-7 text-primary-200">
                  <div class="grid grid-cols-1 gap-2">
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Supervisa y verifica proyectos estudiantiles
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Organiza eventos y webinars institucionales
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Publica oportunidades académicas exclusivas
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Obtén métricas de participación estudiantil
                    </p>
                    <p class="flex items-center">
                      <span class="mr-2 text-secondary-400">•</span>
                      Amplía la influencia académica global
                    </p>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="border-t border-border bg-surface">
        <div class="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-text-base sm:text-4xl">
              ¿Listo para transformar tu experiencia académica?
            </h2>
            <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-text-muted">
              Únete a la comunidad de estudiantes y profesionales que están creando el futuro de la
              colaboración académica.
            </p>
            <div
              class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6"
            >
              <button
                (click)="navigateToRegister()"
                class="group w-full rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-surface shadow-soft transition-all duration-300 hover:scale-105 hover:bg-primary-700 hover:shadow-hover sm:w-auto"
              >
                <span class="group-hover:animate-pulse">Crear Cuenta</span>
              </button>
              <button
                (click)="navigateToLogin()"
                class="group w-full rounded-lg border border-primary-200 bg-surface px-8 py-3 text-base font-semibold text-primary-600 shadow-soft transition-all duration-300 hover:border-primary-300 hover:bg-primary-50 hover:shadow-hover sm:w-auto"
              >
                Ya tengo cuenta
                <span
                  aria-hidden="true"
                  class="inline-block transition-transform group-hover:translate-x-1"
                  >→</span
                >
              </button>
            </div>
          </div>
        </div>
      </section>
      <section class="border-t border-border bg-surface py-16">
        <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 class="mb-6 text-center text-2xl font-bold text-text-base">
            ¿Representas una universidad o deseas ser promotor?
          </h2>

          <form class="space-y-6" (ngSubmit)="submitForm()">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                class="w-full rounded-md border border-border px-4 py-2 text-sm text-text-base"
                placeholder="Nombre completo"
                [(ngModel)]="formData.nombre"
                name="nombre"
                required
              />
              <input
                class="w-full rounded-md border border-border px-4 py-2 text-sm text-text-base"
                placeholder="Correo electrónico"
                type="email"
                [(ngModel)]="formData.correo"
                name="correo"
                required
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <select
                class="w-full rounded-md border border-border px-4 py-2 text-sm text-text-base"
                [(ngModel)]="formData.rol"
                name="rol"
                required
              >
                <option value="admin_uni">Administrador Universitario</option>
                <option value="promotor">Promotor</option>
              </select>

              <input
                *ngIf="formData.rol === 'admin_uni'"
                class="w-full rounded-md border border-border px-4 py-2 text-sm text-text-base"
                placeholder="Nombre de la Institución"
                [(ngModel)]="formData.universidad"
                name="universidad"
              />

              <input
                *ngIf="formData.rol === 'promotor'"
                class="w-full rounded-md border border-border px-4 py-2 text-sm text-text-base"
                placeholder="Región donde opera"
                [(ngModel)]="formData.region"
                name="region"
              />
            </div>

            <div class="text-center">
              <button
                type="submit"
                class="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-700"
                [disabled]="loading"
              >
                {{ loading ? 'Enviando...' : 'Enviar solicitud' }}
              </button>

              <p *ngIf="success" class="mt-4 text-sm text-green-600">
                Tu solicitud ha sido enviada correctamente.
              </p>
            </div>
          </form>
        </div>
      </section>
      <!-- Footer -->
      <footer class="border-t border-neutral-800 bg-neutral-900">
        <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div class="flex items-center space-x-3">
              <img src="/assets/images/logo.png" alt="UniON" class="h-8 w-auto" />
              <span class="text-lg font-semibold text-surface">UniON</span>
            </div>
            <p class="text-center text-sm text-neutral-400 sm:text-right">
              © 2025 UniON. Transformando la colaboración académica global.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .hero-gradient {
        background: linear-gradient(135deg, #fff3eb 0%, #fafafa 50%, #ffeef1 100%);
      }

      .feature-card {
        transition: all 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-4px);
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .bg-grid {
        background-image:
          linear-gradient(rgba(235, 98, 40, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(235, 98, 40, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `,
  ],
})
export class LandingComponent {
  private readonly router = inject(Router);
  private readonly landingService = inject(LandingService);

  loading = false;
  success = false;
  formData: ContactFormData = {
    nombre: '',
    correo: '',
    rol: 'admin_uni',
    universidad: '',
    region: '',
  };

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  scrollToFeatures(): void {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  submitForm(): void {
    if (!this.formData.nombre || !this.formData.correo || !this.formData.rol) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.loading = true;
    this.success = false;

    this.landingService.sendContactForm(this.formData).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        // Reset form after successful submission
        this.formData = {
          nombre: '',
          correo: '',
          rol: 'admin_uni',
          universidad: '',
          region: '',
        };
      },
      error: (error: any) => {
        console.error('Error al enviar el formulario:', error);
        alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
        this.loading = false;
      },
    });
  }
}
