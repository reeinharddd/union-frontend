## 🚀 Overview

UNION is a modern Angular application built using the latest Angular features and best practices. This documentation provides all necessary information for developers to set up, understand, and contribute to the project effectively.

## 📋 Table of Contents

1. Getting Started
2. Project Structure
3. Core Technologies
4. Styling with Tailwind CSS
5. Angular Patterns & Best Practices
6. Code Quality & Standards
7. Common Tasks
8. Deployment

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Bun (recommended) or npm
- Angular CLI

### Setup

```bash
# Clone the repository
git clone [repository-url]
cd union-frontend

# Install dependencies
bun install
# or
npm install

# Start development server
bun run start
# or
ng serve
```

Access the application at http://localhost:4200

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/              # Core functionality (services, guards, models)
│   ├── features/          # Feature modules
│   │   └── public/        # Public features (login, etc.)
│   ├── layouts/           # Layout components
│   │   ├── private-layout/  # Authorized user layout
│   │   └── public-layout/   # Unauthenticated user layout
│   └── shared/            # Shared components, directives, pipes
├── assets/
│   ├── i18n/              # Internationalization files
│   └── images/            # Image assets
└── environments/          # Environment configurations
```

### Key Components

- **Private Layout**: Three-column layout with sidebars
- **Public Layout**: Simpler layout for unauthenticated users
- **Header**: Navigation, user controls, search
- **Left Sidebar**: Categories/tags and main navigation
- **Right Sidebar**: User projects and actions

## 💻 Core Technologies

- **Angular 17+**: Standalone components, Signals, Inject API
- **TypeScript**: With strict type checking
- **RxJS**: Reactive programming
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

## 🎨 Styling with Tailwind CSS

We use a customized Tailwind configuration:

### Color System

```javascript
colors: {
  primary: { /* Orange */ },
  secondary: { /* Yellow */ },
  accent: { /* Red */ },
  // ...plus semantic colors and neutrals
}
```

### Plugins

- `@tailwindcss/forms`: Better form styling
- `@tailwindcss/typography`: Rich text formatting
- `@tailwindcss/aspect-ratio`: Aspect ratio utilities
- `tailwindcss-animate`: Animation utilities

### Usage Guidelines

1. Use Tailwind utility classes directly in templates
2. Use semantic color tokens (`primary-500`, `surface`, etc.) instead of raw colors
3. Follow the project's design system for consistency

## ⚙️ Angular Patterns & Best Practices

### Standalone Components

All components are standalone for better tree-shaking:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, OtherComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}
```

### Change Detection

Use OnPush change detection for better performance:

```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Signals

Use Angular's Signals for reactive state management:

```typescript
// Example service with signals
@Injectable({providedIn: 'root'})
export class CounterService {
  private count = signal(0);
  public count$ = this.count.asReadonly();
  
  increment() {
    this.count.update(value => value + 1);
  }
}
```

### Dependency Injection with Inject

Use the modern inject function instead of constructor DI:

```typescript
@Component({
  // ...
})
export class MyComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  
  // Component logic...
}
```

## 📐 Code Quality & Standards

### Linting

```bash
# Run ESLint
bun run lint
# or
ng lint
```

### Formatting

```bash
# Format all files
bun run format
```

### Pre-commit Hooks

The project uses Git hooks to enforce quality standards:

```bash
# Pre-commit runs:
bun run format      # Format code
bun run lint        # Lint code
bun run prune       # Find unused exports
```

### Path Aliases

Use TypeScript path aliases for cleaner imports:

```typescript
// Instead of relative paths:
import { UserService } from '../../../../core/services/user.service';

// Use aliases:
import { UserService } from '@services/user.service';
```

## 🛠️ Common Tasks

### Creating New Components

```bash
ng generate component path/to/component-name
```

### Running Tests

```bash
ng test
```

### Building for Production

```bash
ng build --configuration production
```

## 🚀 Deployment

The application build artifacts will be stored in the `dist/` directory. Deploy these files to your web server or hosting platform.

```bash
# Example deployment to Firebase
ng build --configuration production
firebase deploy
```

---

## 🤝 Contributing

1. Follow the code style guidelines
2. Write tests for new features
3. Update documentation
4. Create a pull request with a clear description

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)

---

