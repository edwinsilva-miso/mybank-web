# MyBank Web

Aplicación bancaria digital moderna desarrollada con Angular 20, TypeScript y Tailwind CSS.

## Características

- 🏦 **Gestión de Cuentas**: Crear y administrar cuentas bancarias
- 💰 **Transacciones**: Realizar depósitos, retiros y transferencias
- 📊 **Dashboard**: Vista general de finanzas con métricas en tiempo real
- 🔐 **Autenticación**: Sistema seguro de login y registro
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🎨 **UI Moderna**: Interfaz amigable con gradientes y efectos visuales

## Tecnologías

- **Frontend**: Angular 20, TypeScript
- **Styling**: Tailwind CSS
- **Estado**: RxJS Observables
- **Rutas**: Angular Router con guards
- **HTTP**: Angular HttpClient con interceptors

## Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd mybank-web
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar servidor de desarrollo:**
```bash
npm start
```

4. **Abrir en el navegador:**
```
http://localhost:4200
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para desarrollo
- `npm run build:prod` - Construye la aplicación para producción
- `npm run watch` - Construye en modo watch
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige errores del linter automáticamente

## Estructura del Proyecto

```
src/
├── app/
│   ├── features/          # Componentes de características
│   │   ├── auth/         # Autenticación (login, registro)
│   │   ├── dashboard/    # Dashboard principal
│   │   ├── accounts/     # Gestión de cuentas
│   │   ├── transactions/ # Gestión de transacciones
│   │   └── profile/      # Perfil de usuario
│   ├── shared/           # Componentes compartidos
│   │   └── header/       # Header de navegación
│   ├── services/         # Servicios de datos
│   ├── models/           # Modelos de datos
│   ├── guards/           # Guards de rutas
│   └── interceptors/     # Interceptores HTTP
├── environments/         # Configuraciones de entorno
└── styles.scss          # Estilos globales
```

## API Backend

La aplicación requiere un backend REST API con los siguientes endpoints:

- `POST /auth/login` - Autenticación de usuarios
- `POST /auth/register` - Registro de usuarios
- `GET /accounts` - Obtener cuentas del usuario
- `POST /accounts` - Crear nueva cuenta
- `GET /transactions` - Obtener transacciones
- `POST /transactions` - Crear transacción
- `POST /transactions/{id}/process` - Procesar transacción

## Autor

**Edwin Silva**

## Licencia

MIT
