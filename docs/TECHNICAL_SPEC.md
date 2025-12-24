# Sincro - Documento Técnico Base (Fase 0)

## 1. Arquitectura General

### 1.1 Modelo Conceptual
Arquitectura **Cliente-Servidor** clásica con API REST.
- **Cliente (App)**: Responsable de la UI, lógica de presentación, cálculo local de estimaciones (para offline-first inicial) y sincronización.
- **Servidor (Backend)**: Fuente de verdad, gestión de identidades, relaciones de pareja, permisos y notificaciones push.

### 1.2 Stack Tecnológico Propuesto
- **Backend**: Node.js con Express (o NestJS para mayor estructura).
    - Base de Datos: PostgreSQL (Relacional, ideal para manejar usuarios, relaciones y permisos estrictos).
    - Auth: JWT (JSON Web Tokens) para sesiones stateless.
- **Frontend (App Mobile)**: React Native (permite desplegar en Android con prioridad y escalar a iOS).
    - UI Library: Estilos propios o librería ligera (Paper/NativeBase) para mantener estética "premium" y limpieza.
    - Estado Local: Context API o Zustand.

## 2. Modelo de Datos (Esquemático)

### 2.1 Users (Usuarios)
Información base de la persona.
- `id`: UUID
- `email`: String (Unique)
- `password_hash`: String
- `display_name`: String
- `created_at`: Datetime

### 2.2 Cycles (Ciclos Menstruales)
Registro histórico y activo.
- `id`: UUID
- `user_id`: UUID (FK -> Users)
- `start_date`: Date (Inicio menstruación)
- `end_date`: Date (Fin menstruación, nullable si actual)
- `cycle_length`: Integer (Duración calculada/estimada)
- `notes`: Text (Opcional, encriptado preferiblemente)

### 2.3 Relationships (Vínculos)
Conexión entre dos usuarios.
- `id`: UUID
- `owner_id`: UUID (Quien comparte datos)
- `viewer_id`: UUID (Quien recibe acceso)
- `status`: Enum [PENDING, ACTIVE, REJECTED]
- `invitation_code`: String (Para enlace inicial)

### 2.4 Permissions (Permisos)
Granularidad del acceso.
- `id`: UUID
- `relationship_id`: UUID (FK -> Relationships)
- `can_view_phase`: Boolean (Ver fase actual: folicular, lútea, etc.)
- `can_view_exact_dates`: Boolean (Ver fechas exactas de sangrado)
- `can_receive_alerts`: Boolean (Recibir notificaciones de "sintonía")

## 3. Flujo de Usuarios (User Flow)

1.  **Onboarding & Registro**:
    - Splash Screen -> Login/Register -> Setup Inicial (Última regla, duración promedio).
2.  **Home (Owner)**:
    - Vista Calendario Personal.
    - Botón "Hoy" (Registrar inicio/fin).
    - Indicador de Fase Actual.
3.  **Viculación (Pairing)**:
    - Menú Configuración -> "Vincular Pareja".
    - Generar Código -> Compartir (WhatsApp/System Share).
    - Pareja descarga app -> "Tengo un código" -> Ingresa código.
    - Owner recibe solicitud -> Acepta/Define Permisos.
4.  **Home (Viewer)**:
    - Vista Simplificada (Semáforo/Fases).
    - Sin detalles médicos crudos (según FASE 3).

## 4. Convenciones de Nombres

- **Archivos/Directorios**: `kebab-case` o `camelCase` (según estándar del lenguaje elegido, ej: JS usa camelCase/PascalCase para componentes).
    - Database Tables: `snake_case` (users, relationships).
    - JSON API Fields: `camelCase` (userId, startDate).
- **Código**:
    - Variables: `camelCase`.
    - Clases/Componentes: `PascalCase`.
    - Constantes: `UPPER_SNAKE_CASE`.

## 5. Estructura de Carpetas Propuesta

### Raíz del Proyecto
```
/Sincro
  /backend
  /app
  /docs          (Documentación técnica)
  README.md
```

### Backend (Node/Express Example)
```
/backend
  /src
    /config      (Variables de entorno, DB connection)
    /controllers (Lógica de los endpoints)
    /models      (Definición de esquemas de BD)
    /routes      (Definición de API endpoints)
    /services    (Lógica de negocio pura)
    /middlewares (Auth, Validation)
    /utils       (Helpers)
  index.js
```

### App (React Native Example)
```
/app
  /src
    /assets      (Imágenes, fuentes, iconos)
    /components  (Botones, Tarjetas, Inputs reutilizables)
    /navigation  (Configuración de rutas/pantallas)
    /screens     (Pantallas completas: Login, Home, Settings)
    /services    (Llamadas a la API)
    /context     (Estado global: AuthContext, CycleContext)
    /utils       (Cálculos de fechas, helpers)
    /constants   (Colores, Textos, Config)
  App.js
```

## 6. Próximos Pasos (Fase 1)
1.  Inicializar proyecto Node.js y React Native.
2.  Configurar DB Local (Docker o Instancia local).
3.  Implementar Login básico y modelo de Usuario.
