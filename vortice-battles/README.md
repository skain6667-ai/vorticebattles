# 🌀 Vórtice Battles — PWA

La aplicación oficial de la liga de batallas de rap Vórtice Battles.

## Stack
- **React 18** + **Vite 5**
- **Tailwind CSS** (diseño negro mate / rojo neón)
- **Firebase** (Auth Google + Firestore)
- **PWA** (instalable en Android/Chrome vía vite-plugin-pwa)

## Setup rápido

### 1. Clonar e instalar
```bash
git clone https://github.com/TU_USUARIO/vortice-battles
cd vortice-battles
npm install
```

### 2. Configurar Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un proyecto → activa **Authentication → Google Sign-In**
3. Activa **Firestore Database** (modo producción)
4. En Configuración → Apps Web, copia las credenciales

```bash
cp .env.example .env
# Edita .env con tus valores de Firebase
```

### 3. Configurar reglas Firestore
Copia el contenido de `firestore.rules` y pégalo en:
Firebase Console → Firestore → Reglas

> ⚠️ **Importante:** Reemplaza `TU-CORREO@GMAIL.COM` con tu email real en `firestore.rules` y en `VITE_ADMIN_EMAIL` en `.env`

### 4. Correr en desarrollo
```bash
npm run dev
```

### 5. Deploy en Vercel
```bash
npm run build
# Sube a GitHub y conecta con Vercel
# Agrega las variables de entorno en Vercel → Settings → Environment Variables
```

## Estructura del proyecto
```
src/
├── context/AuthContext.jsx   # Autenticación global
├── lib/firebase.js           # SDK Firebase + helpers
├── pages/
│   ├── LoginPage.jsx         # Login con Google
│   ├── GlobalPage.jsx        # Feed principal + Reels
│   ├── RankingPage.jsx       # Ranking en tiempo real
│   ├── CompetirPage.jsx      # Canje de beneficios
│   ├── PerfilPage.jsx        # Mi Refri + logros
│   └── AdminPage.jsx         # Panel admin privado
└── components/
    ├── BottomNav.jsx          # Navegación inferior
    ├── InstallBanner.jsx      # Banner PWA
    ├── LoadingScreen.jsx      # Pantalla de carga
    └── VorticeCanSVG.jsx      # Lata SVG animada
```

## Economía de latas

| Acción | Costo |
|--------|-------|
| Filtro ganado | +1 lata |
| Mención especial | +1 lata |
| Batalla destacada | +1 lata |
| Inscripción gratuita | -1 lata |
| Pase directo a Octavos | -3 latas |

## Admin
Accede a `/admin` con el correo configurado en `VITE_ADMIN_EMAIL` para:
- Asignar latas a MCs
- Editar perfiles (alias, estadísticas)
- Ver todos los usuarios registrados
