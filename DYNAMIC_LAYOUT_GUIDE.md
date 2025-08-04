# Sistema de Layout Dinámico - UniON Frontend

## Descripción General

El sistema de layout dinámico permite que la interfaz de usuario se adapte automáticamente según el tipo de usuario (rol) que esté autenticado. Esto proporciona experiencias personalizadas y optimizadas para cada tipo de usuario.

## Componentes Principales

### 1. LayoutConfigService
**Ubicación:** `src/app/core/services/layout/layout-config.service.ts`

Servicio central que gestiona las configuraciones de layout basadas en roles de usuario.

**Características:**
- Configuraciones reactivas basadas en señales (Angular signals)
- Configuraciones específicas por rol
- Gestión de permisos de navegación
- Contadores dinámicos de badges

### 2. DynamicLayoutComponent
**Ubicación:** `src/app/layouts/dynamic-layout/dynamic-layout.component.ts`

Componente de layout universal que adapta su estructura según la configuración del usuario actual.

**Características:**
- Sidebars condicionales (izquierdo/derecho)
- Header dinámico adaptable
- Contenido principal responsive
- Detección automática de rol

### 3. DynamicHeaderComponent
**Ubicación:** `src/app/shared/components/dynamic-header/dynamic-header.component.ts`

Header adaptable con navegación específica por tipo de usuario.

**Características:**
- Navegación contextual
- Búsqueda integrada
- Notificaciones por rol
- Menú de usuario personalizado

### 4. DynamicSidebarComponent
**Ubicación:** `src/app/shared/components/dynamic-sidebar/dynamic-sidebar.component.ts`

Sidebar reutilizable que puede posicionarse a izquierda o derecha.

**Características:**
- Navegación jerárquica
- Badges dinámicos
- Iconos personalizados
- Expansión/colapso de submenús

## Configuraciones por Rol

### Admin y Promoter
- **Sidebars:** Solo izquierdo
- **Propósito:** Interfaz administrativa simplificada
- **Navegación:** Herramientas de gestión y administración

### Student y University Admin
- **Sidebars:** Izquierdo y derecho
- **Propósito:** Interfaz rica con información contextual
- **Navegación:** Herramientas académicas y información adicional

## Tipos de Usuario Soportados

```typescript
export type UserRole = 'admin' | 'promoter' | 'student' | 'university_admin';
```

### Configuración Admin
```typescript
{
  showLeftSidebar: true,
  showRightSidebar: false,
  headerType: 'admin',
  leftSidebarItems: [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Usuarios', route: '/admin/users', icon: 'users' },
    // ... más items
  ]
}
```

### Configuración Student
```typescript
{
  showLeftSidebar: true,
  showRightSidebar: true,
  headerType: 'student',
  leftSidebarItems: [
    { label: 'Feed', route: '/student/feed', icon: 'home' },
    { label: 'Mis Proyectos', route: '/student/projects', icon: 'folder' },
    // ... más items
  ],
  rightSidebarItems: [
    { label: 'Notificaciones', route: '/student/notifications', icon: 'bell' },
    // ... más items
  ]
}
```

## Uso del Sistema

### 1. Implementación Básica

```typescript
// En tu componente de página
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [DynamicLayoutComponent],
  template: `
    <app-dynamic-layout>
      <!-- Tu contenido aquí -->
      <div class="p-6">
        <h1>Mi Página</h1>
        <p>Contenido específico de la página</p>
      </div>
    </app-dynamic-layout>
  `
})
export class MyPageComponent { }
```

### 2. Acceso a Configuración Actual

```typescript
// En cualquier componente
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';

@Component({...})
export class MyComponent {
  private readonly layoutConfig = inject(LayoutConfigService);

  ngOnInit() {
    // Obtener configuración actual
    const config = this.layoutConfig.getCurrentLayoutConfig();
    
    // Verificar rol del usuario
    const userRole = this.layoutConfig.getCurrentUserRole();
    
    // Verificar permisos
    const hasPermission = this.layoutConfig.hasPermission(sidebarItem);
  }
}
```

### 3. Personalización de Items de Navegación

```typescript
// Agregar items personalizados al sidebar
const customSidebarItem: SidebarItem = {
  label: 'Mi Nueva Sección',
  route: '/custom/section',
  icon: 'custom-icon',
  badge: '5',
  permissions: ['admin', 'university_admin'],
  children: [
    {
      label: 'Sub-sección',
      route: '/custom/section/sub',
      icon: 'sub-icon'
    }
  ]
};
```

## Integración con Rutas

### Configuración de Rutas con Layout

```typescript
// En app.routes.ts o routing module
const routes: Routes = [
  {
    path: 'admin',
    component: DynamicLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      // ... más rutas admin
    ]
  },
  {
    path: 'student',
    component: DynamicLayoutComponent,
    children: [
      { path: 'feed', component: StudentFeedComponent },
      { path: 'projects', component: StudentProjectsComponent },
      // ... más rutas student
    ]
  }
];
```

## Personalización de Estilos

### Variables CSS Disponibles
```css
/* En tu archivo de estilos global */
:root {
  --sidebar-width: 16rem; /* 256px */
  --header-height: 4rem;  /* 64px */
  --border-color: theme('colors.neutral.200');
  --sidebar-bg: theme('colors.white');
}
```

### Clases CSS Personalizables
- `.nav-item` - Items de navegación
- `.nav-item.active` - Item activo
- `.nav-child-item` - Sub-items de navegación
- `.sidebar-left` - Sidebar izquierdo
- `.sidebar-right` - Sidebar derecho

## Ejemplo de Componente Demo

Ver `src/app/pages/layout-demo/layout-demo.component.ts` para un ejemplo completo de implementación y demostración del sistema.

## Ventajas del Sistema

1. **Adaptabilidad:** Interfaz automáticamente ajustada por rol
2. **Reutilización:** Componentes reutilizables y configurables
3. **Mantenibilidad:** Configuración centralizada
4. **Escalabilidad:** Fácil agregar nuevos roles y configuraciones
5. **Responsividad:** Diseño responsive automático
6. **Performance:** Renderizado condicional optimizado

## Consideraciones de Performance

- Los sidebars se renderizan condicionalmente usando `@if`
- Las configuraciones se calculan usando Angular signals para reactividad eficiente
- Los componentes son standalone para lazy loading optimizado
- Cache automático de configuraciones de layout

## Solución de Problemas

### Error: Sidebar no se muestra
- Verificar que `showLeftSidebar` o `showRightSidebar` esté en `true`
- Confirmar que el usuario tiene el rol correcto
- Revisar que los items del sidebar estén definidos

### Error: Header incorrecto
- Verificar la configuración `headerType` en el rol
- Confirmar que el componente DynamicHeaderComponent está importado
- Revisar permisos del usuario actual

### Error: Navegación no funciona
- Verificar las rutas en los items de navegación
- Confirmar que RouterModule está configurado correctamente
- Revisar que los permisos del usuario permiten acceder a la ruta
