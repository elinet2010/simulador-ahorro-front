# Simulador del Ahorro Digital

Aplicación web desarrollada con Next.js que permite a los usuarios explorar productos de ahorro, simular rentabilidad y registrar intenciones de apertura de cuenta. Diseñada para inspirar confianza y ofrecer una experiencia intuitiva, elegante y segura.

## 🚀 Características Principales

### 1. Descubrir Productos Financieros (`/products`)
- Listado completo de cuentas de ahorro con información detallada
- Sistema de filtros con búsqueda en tiempo real (debounce de 300ms)
- Búsqueda por nombre, descripción o tipo de producto
- Renderizado del lado del servidor (SSR) para mejor rendimiento

### 2. Simular Rentabilidad (`/simulator`)
- Formulario interactivo con validaciones completas
- Campos: monto inicial, aporte mensual y plazo en meses
- Cálculo automático de interés compuesto
- Formato de moneda en tiempo real
- Visualización de resultados con gráficos

### 3. Registrar Intención de Apertura (`/onboarding`)
- Formulario de registro con validaciones
- Integración con reCAPTCHA (simulado en desarrollo)
- Generación de código de solicitud único (UUID)
- Mensajes de éxito y error amigables

## 🛠️ Tecnologías

### Frontend
- **Next.js 16.0.1** - Framework React con App Router
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Material-UI (MUI) 7.3.5** - Componentes de UI
- **Redux Toolkit 2.10.1** - Gestión de estado
- **Formik 2.4.6** - Manejo de formularios
- **Yup 1.7.1** - Validación de esquemas
- **Recharts 3.3.0** - Gráficos y visualizaciones

### Estilo
- **Emotion** - CSS-in-JS
- **Tailwind CSS 4** - Utilidades CSS

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd front-simulador
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno** (opcional)
   
   Crear archivo `.env.local`:
   ```env
   # reCAPTCHA (opcional - funciona sin estas variables en modo desarrollo)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_aqui
   RECAPTCHA_SECRET_KEY=tu_secret_key_aqui
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
front-simulador/
├── app/                      # App Router de Next.js
│   ├── api/                  # API Routes
│   │   └── onboarding/       # Endpoint de onboarding
│   ├── products/             # Página de productos (SSR)
│   ├── simulator/            # Página del simulador
│   ├── onboarding/           # Página de registro
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página de inicio
├── components/               # Componentes React
│   ├── common/               # Componentes compartidos
│   │   └── Header/           # Header de navegación
│   ├── products/             # Componentes de productos
│   ├── simulator/            # Componentes del simulador
│   ├── onboarding/           # Componentes de registro
│   └── ui/                   # Componentes UI reutilizables
├── data/                     # Datos estáticos
│   └── products.ts           # Mock de productos
├── hooks/                    # Custom hooks
│   ├── useDebounce.ts        # Hook para debounce
│   └── useScrollToTop.ts     # Hook para scroll
├── lib/                      # Utilidades y configuraciones
│   ├── currency.ts           # Utilidades de formato de moneda
│   ├── recaptcha.ts          # Lógica de reCAPTCHA
│   ├── validations.ts        # Esquemas de validación
│   └── theme.ts              # Tema de Material-UI
├── store/                    # Redux store
│   ├── slices/               # Redux slices
│   └── hooks.ts              # Typed hooks
└── public/                   # Archivos estáticos
```

## 🎯 Decisiones Técnicas

### SSR (Server-Side Rendering) en `/products`

- **SEO optimizado:** El contenido se renderiza en el servidor, mejorando la indexación por motores de búsqueda.
- **Rendimiento inicial:** La página se entrega completamente renderizada, reduciendo el tiempo de carga inicial.
- **Simplicidad:** Implementación más directa que ISR, sin necesidad de configurar tiempos de revalidación.

**Implementación:**
```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  // Los productos se cargan en el servidor en cada request
  const products = getAllProducts();
  return <ProductsClient products={products} />;
}
```

**Separación de responsabilidades:**
- **Server Component:** Carga de datos y renderizado inicial
- **Client Component:** Interactividad (búsqueda y filtrado con debounce)

Esta arquitectura permite aprovechar los beneficios del SSR mientras mantiene la interactividad del lado del cliente para los filtros.

## 📊 Fórmula de Cálculo de Interés

El simulador utiliza **interés compuesto mensual** para calcular la rentabilidad de los ahorros.

### Componentes del Cálculo

1. **Valor Futuro del Monto Inicial**
   ```
   FV_initial = Monto_Inicial × (1 + Tasa_Mensual)^Meses
   ```
   Donde:
   - `Tasa_Mensual = Tasa_Anual / 100 / 12`
   - El monto inicial crece con interés compuesto durante todo el período

2. **Valor Futuro de los Aportes Mensuales (Anualidad)**
   ```
   Si Tasa_Mensual > 0:
     FV_contributions = Aporte_Mensual × [(1 + Tasa_Mensual)^Meses - 1] / Tasa_Mensual
   
   Si Tasa_Mensual = 0:
     FV_contributions = Aporte_Mensual × Meses
   ```
   Esta fórmula calcula el valor futuro de una serie de pagos iguales (anualidad) con capitalización mensual.

3. **Resultados Finales**
   ```
   Monto_Final = FV_initial + FV_contributions
   Total_Aportado = Monto_Inicial + (Aporte_Mensual × Meses)
   Intereses_Ganados = Monto_Final - Total_Aportado
   ```

### Ejemplo de Cálculo

**Datos de entrada:**
- Monto inicial: $1,000,000 COP
- Aporte mensual: $200,000 COP
- Plazo: 12 meses
- Tasa de interés anual: 6.2%

**Cálculo:**
1. Tasa mensual = 6.2% / 100 / 12 = 0.005167
2. Valor futuro del monto inicial:
   ```
   FV_initial = 1,000,000 × (1.005167)^12 = 1,063,800 COP
   ```
3. Valor futuro de los aportes:
   ```
   FV_contributions = 200,000 × [(1.005167)^12 - 1] / 0.005167
                    = 200,000 × 12.37
                    = 2,474,000 COP
   ```
4. Monto final = 1,063,800 + 2,474,000 = **3,537,800 COP**
5. Total aportado = 1,000,000 + (200,000 × 12) = 3,400,000 COP
6. Intereses ganados = 3,537,800 - 3,400,000 = **137,800 COP**

### Notas Importantes

- **Capitalización mensual:** Los intereses se calculan y capitalizan cada mes
- **Aportes al inicio del mes:** Los aportes mensuales se asumen al inicio de cada período
- **Tasa fija:** La tasa de interés se mantiene constante durante todo el período
- **Sin retiros:** El cálculo asume que no hay retiros durante el período de ahorro

## 🚦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo en http://localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción (requiere build previo)

# Calidad de código
npm run lint         # Ejecuta ESLint para verificar el código
```

## 🔐 Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Site key de Google reCAPTCHA | No | Modo desarrollo simulado |
| `RECAPTCHA_SECRET_KEY` | Secret key de Google reCAPTCHA | No | Modo desarrollo simulado |

**Nota:** El proyecto funciona sin estas variables en modo desarrollo, utilizando tokens simulados de reCAPTCHA.

## 📝 Características Adicionales

- ✅ Validaciones de formularios con mensajes de error amigables
- ✅ Formato automático de moneda en inputs
- ✅ Diseño responsive (móvil y desktop)
- ✅ Manejo de estado global con Redux Toolkit
- ✅ Tipado completo con TypeScript
- ✅ Componentes reutilizables y modulares
- ✅ Optimización de rendimiento con debounce en búsquedas

## 🎨 Diseño

El proyecto utiliza Material-UI como sistema de diseño principal, con un tema personalizado que incluye:
- Paleta de colores consistente
- Tipografía optimizada
- Componentes accesibles
- Diseño responsive

## 📄 Licencia

Este proyecto es privado y está desarrollado como parte de una prueba técnica.

## 👥 Contribución

## Deploy on Vercel

---

**Desarrollado usando Next.js y React**
