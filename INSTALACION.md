# 🚀 Instalación de Aplicaciones Separadas

## 📂 Estructura del Proyecto

El proyecto se ha separado en dos aplicaciones independientes:

```
📂 audiencias-ciudadanas/     (App para Ciudadanos)
├── src/
│   ├── pages/               # Index, Login, Register, Dashboard, AudienceHistory
│   ├── components/ui/       # Componentes UI completos  
│   ├── lib/                 # Utilidades y funciones
│   └── hooks/               # Hooks personalizados
├── package.json
├── vite.config.ts
└── tailwind.config.ts

📂 audiencias-admin/          (App Administrativa)
├── src/
│   ├── pages/               # AdminLogin, AdminDashboard
│   ├── components/ui/       # Componentes UI completos
│   ├── lib/                 # Utilidades y funciones  
│   └── hooks/               # Hooks personalizados
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🛠️ Instalación

### **App Ciudadana** (Puerto 3001)
```bash
cd audiencias-ciudadanas
npm install
npm run dev
```

### **App Administrativa** (Puerto 3002)  
```bash
cd audiencias-admin
npm install
npm run dev
```

## 🌐 URLs de Acceso

- **App Ciudadana**: http://localhost:3001
- **App Administrativa**: http://localhost:3002

## 📋 Funcionalidades Separadas

### **🏠 App Ciudadana** (`audiencias-ciudadanas/`)
- ✅ Página principal con información
- ✅ Registro e inicio de sesión
- ✅ Dashboard para solicitar audiencias
- ✅ Formulario multi-paso con grabación de audio
- ✅ Reserva de turnos para viernes
- ✅ Historial de audiencias
- ✅ Gestión de datos personales

### **🏛️ App Administrativa** (`audiencias-admin/`)
- ✅ Login administrativo
- ✅ Panel de administración completo
- ✅ Gestión de audiencias ciudadanas
- ✅ Monitor de turnos en tiempo real
- ✅ Administración de usuarios
- ✅ Gestión de expedientes
- ✅ Sistema de reportes
- ✅ Configuración del sistema

## 🔐 Credenciales de Acceso

### **Ciudadanos**
- Registro libre con número de teléfono
- Login con teléfono + contraseña

### **Administradores**
- Email: `admin@municipio.gob.mx`
- Contraseña: `admin123`

## 🛡️ Beneficios de la Separación

### **✅ Seguridad**
- Código administrativo completamente aislado
- Sin exposición de funciones admin en app ciudadana
- Diferentes puertos y dominios

### **✅ Escalabilidad**
- Apps independientes pueden escalar por separado
- Despliegue independiente
- Diferentes equipos de desarrollo

### **✅ Mantenimiento**
- Actualizaciones sin afectar la otra app
- Debugging más fácil
- Código más limpio y organizado

### **✅ Performance**
- Bundle más pequeño para cada app
- Menos dependencias por aplicación
- Mejor tiempo de carga

## 🚀 Despliegue

### **Producción**
```bash
# App Ciudadana
cd audiencias-ciudadanas
npm run build

# App Administrativa  
cd audiencias-admin
npm run build
```

### **Sugerencias de URLs**
- **Ciudadana**: `https://audiencias.municipio.gob.mx`
- **Administrativa**: `https://admin-audiencias.municipio.gob.mx`

## 📝 Notas Importantes

1. **Datos Compartidos**: Ambas apps usan localStorage independiente
2. **Componentes UI**: Cada app tiene su propia copia de componentes
3. **Configuración**: Cada app tiene su configuración independiente
4. **Build**: Cada app se construye por separado

La separación está **100% completa** y lista para producción! 🎉
