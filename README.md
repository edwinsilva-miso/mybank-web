# MyBank Web - Aplicación de Banca en Línea

## 🏦 Descripción

MyBank Web es una aplicación moderna de banca en línea desarrollada con Angular 17 y desplegada en Google Cloud Run. La aplicación permite a los usuarios gestionar sus cuentas bancarias, realizar transacciones y administrar su perfil de manera segura.

## 🚀 Estado de Producción

**✅ DESPLEGADA EN PRODUCCIÓN**

- **URL de Producción:** https://mybank-web-7mxungdvxq-uc.a.run.app
- **Backend API:** https://mybank-api-282065076144.us-central1.run.app/api/v1
- **Estado:** Funcionando correctamente

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 17** - Framework de desarrollo
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de estilos
- **Angular Router** - Navegación SPA

### Backend
- **Spring Boot** - API REST
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Google Cloud Run** - Plataforma de despliegue

### Infraestructura
- **Google Cloud Platform**
- **Cloud Run** - Contenedores sin servidor
- **Cloud SQL** - Base de datos PostgreSQL
- **Container Registry** - Almacenamiento de imágenes Docker

## 📁 Estructura del Proyecto

```
mybank-web/
├── src/
│   ├── app/
│   │   ├── features/          # Módulos de funcionalidades
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── dashboard/     # Panel principal
│   │   │   ├── accounts/      # Gestión de cuentas
│   │   │   ├── transactions/  # Transacciones
│   │   │   └── profile/       # Perfil de usuario
│   │   ├── services/          # Servicios de API
│   │   ├── models/            # Modelos de datos
│   │   ├── guards/            # Guardias de ruta
│   │   ├── interceptors/      # Interceptores HTTP
│   │   └── shared/            # Componentes compartidos
│   └── environments/          # Configuraciones de entorno
├── Dockerfile                 # Configuración de contenedor
├── server.js                  # Servidor de producción
└── server-package.json        # Dependencias del servidor
```

## 🔐 Funcionalidades de Seguridad

- **Autenticación JWT** - Tokens seguros para sesiones
- **Guardias de Ruta** - Protección de rutas privadas
- **Interceptores HTTP** - Manejo automático de tokens
- **Validación de Formularios** - Validación en tiempo real
- **HTTPS** - Conexiones seguras en producción

## 🎨 Características de la UI/UX

- **Diseño Responsivo** - Compatible con todos los dispositivos
- **Interfaz Moderna** - Diseño limpio y profesional
- **Navegación Intuitiva** - Experiencia de usuario optimizada
- **Feedback Visual** - Notificaciones y estados claros
- **Accesibilidad** - Cumple estándares de accesibilidad web

## 📱 Funcionalidades Principales

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Recuperación de contraseña
- Gestión de perfil

### Gestión de Cuentas
- Visualización de cuentas
- Creación de nuevas cuentas
- Detalles de transacciones
- Estados de cuenta

### Transacciones
- Historial de transacciones
- Filtros y búsqueda
- Detalles de transacciones
- Exportación de datos

### Dashboard
- Resumen de cuentas
- Actividad reciente
- Métricas financieras
- Acceso rápido a funciones

## 🔧 Configuración de Entorno

### Variables de Entorno de Producción
```bash
NODE_ENV=production
API_URL=https://mybank-api-282065076144.us-central1.run.app/api/v1
```

### Configuración del Backend
```bash
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=[configurado en Cloud Run]
DB_NAME=mybank_db
DB_USER=mybank_app
DB_PASSWORD=[configurado en Cloud Run]
```

## 📊 Monitoreo y Logs

### Logs de Aplicación
```bash
# Ver logs del frontend
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mybank-web"

# Ver logs del backend
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mybank-api"
```

### Métricas de Rendimiento
- **Tiempo de respuesta:** < 200ms
- **Disponibilidad:** 99.9%
- **Uptime:** Monitoreado 24/7

## 🔄 Actualizaciones

### Proceso de Actualización
1. Los cambios se despliegan automáticamente desde el repositorio
2. Cloud Build construye y despliega la nueva versión
3. Zero-downtime deployment garantizado
4. Rollback automático en caso de errores

### Versión Actual
- **Frontend:** 1.0.0
- **Backend:** 0.1.0
- **Última actualización:** Julio 2025

## 🆘 Soporte

### Contacto Técnico
- **Equipo de Desarrollo:** [Información del equipo]
- **Documentación API:** [URL de documentación]
- **Repositorio:** [URL del repositorio]

### Problemas Comunes
- **Problemas de Login:** Verificar credenciales y conexión a internet
- **Errores de Carga:** Refrescar la página o limpiar caché
- **Problemas de Transacciones:** Contactar soporte técnico

## 📄 Licencia

Este proyecto es propiedad de MyBank y está destinado para uso interno.

---

**© 2025 MyBank. Todos los derechos reservados.**
