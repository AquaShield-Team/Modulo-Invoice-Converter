# AquaShield — Invoice Converter

Módulo de conversión y ajuste de facturas de exportación para AquaChile.

## Módulos

| Archivo | Función | Uso |
|---|---|---|
| `index.html` | **App principal** — Commercial Invoice + Factura Mermas | Usuarios finales |
| `admin.html` | **Panel Admin** — Configuración de operaciones y perfiles | Administradores |
| `js/pdfProcessor.js` | Motor de procesamiento PDF (perfiles, operaciones) | Librería compartida |

## Funcionalidades

### 📄 Commercial Invoice
- Carga de facturas PDF (una o múltiples)
- Aplicación de operaciones configurables (rectángulos, textos, notas)
- Sistema de perfiles/plantillas
- Vista previa en tiempo real
- Descarga individual o ZIP
- Tema claro/oscuro
- Historial de procesamientos

### 📦 Factura Mermas
- Extracción automática de tabla de productos desde PDF
- Edición de cajas por producto
- Recálculo proporcional de cantidades y totales
- Aplicación automática del perfil activo de Commercial Invoice
- Vista previa del PDF modificado
- Descarga del PDF ajustado

### ⚙️ Admin
- CRUD de perfiles (crear, renombrar, eliminar)
- Drag & drop de operaciones sobre el PDF
- Cuadrícula de calibración
- Redimensionamiento interactivo de rectángulos

## Tech Stack

- **React 18** (JSX via Babel standalone)
- **Tailwind CSS** (CDN)
- **pdf.js** 3.11.174 (lectura/render de PDFs)
- **pdf-lib** 1.17.1 (modificación de PDFs)
- **Google Fonts**: Quicksand, Inter, JetBrains Mono

## Uso

Abrir `index.html` directamente en el navegador (sin servidor requerido).

Para configuración avanzada, abrir `admin.html`.

## Marca

Basado en el Manual de Marca AquaChile — Industrial Fusion Design System.
- Accent: `#EB5F0A`
- Primary: `#445565`
- Fonts: Quicksand (headings), Inter (body), JetBrains Mono (code)
