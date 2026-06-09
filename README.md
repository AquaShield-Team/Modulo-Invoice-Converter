# 🛡️ AquaShield — Módulo Commercial Invoice

> **Plataforma:** AquaShield by AquaChile  
> **Versión:** 3.0  
> **Última actualización:** Junio 2026

---

## 📌 ¿Qué es esta aplicación?

Esta aplicación convierte las **Facturas de Exportación** chilenas (emitidas por el SII) en **Commercial Invoices** listas para enviar a clientes internacionales. 

En palabras simples: toma tu factura electrónica, le **oculta los elementos del SII** (timbre electrónico, texto "FACTURA DE EXPORTACIÓN", etc.), le **agrega el título "COMMERCIAL INVOICE"** en rojo, y te genera un PDF limpio listo para exportación.

Además, incluye un módulo de **Factura Mermas** para ajustar cantidades cuando hay pérdida de producto.

### ¿Necesito instalar algo?

**No.** La aplicación funciona directamente en tu navegador (Chrome, Edge, Firefox). Solo necesitas abrir el enlace o el archivo `index.html` y listo.

🔗 **Enlace directo:** [https://aquashield-team.github.io/Modulo-Invoice-Converter/](https://aquashield-team.github.io/Modulo-Invoice-Converter/)

---

## 🚀 Guía Rápida (Commercial Invoice)

### Paso 1: Abrir la aplicación
Abre el enlace en tu navegador. Verás la pantalla principal con el logo de AquaShield.

### Paso 2: Seleccionar la plantilla correcta
En el panel derecho verás un menú desplegable **"PLANTILLA"**. Elige según la empresa de la factura:

| Plantilla | Cuándo usarla |
|---|---|
| **Empresas Aquachile** | Facturas emitidas por Empresas Aquachile S.A. (SII Puerto Montt) |
| **Los Fiordos** | Facturas emitidas por Los Fiordos (SII Rancagua) |

> ⚠️ **Importante:** Si eliges la plantilla equivocada, los rectángulos blancos quedarán en posiciones incorrectas y no taparán el texto que corresponde.

### Paso 3: Cargar tu(s) factura(s)
Tienes dos opciones:
- **Arrastrar y soltar:** Arrastra los archivos PDF desde tu escritorio al área que dice "Cargar Documentos"
- **Hacer clic:** Haz clic en esa misma área y selecciona los archivos desde tu computador

✅ Puedes cargar **varios PDFs a la vez**. La aplicación los procesará todos juntos.

### Paso 4: Escribir notas (opcional)
En la sección **"Notas del Documento"** puedes escribir información adicional que aparecerá en un recuadro en la esquina inferior izquierda del PDF. Por ejemplo:
```
BL: MSCUXXX
Nave: MSC ANNA
Puerto destino: Miami, FL
```

> 💡 Si dejas las notas vacías, no aparecerá ningún recuadro en el PDF.

### Paso 5: Adjuntar imagen (opcional)
En la sección **"Imagen Adjunta"** puedes pegar una imagen (por ejemplo, un sello o firma):
1. Copia la imagen en tu portapapeles (Ctrl+C sobre la imagen)
2. Haz clic en el área que dice "Clic aquí y Ctrl+V para pegar imagen"
3. Presiona **Ctrl+V**
4. Ajusta el tamaño con el control deslizante si es necesario

La imagen se incrustará en la parte inferior de cada página del PDF.

### Paso 6: Descargar
Haz clic en el botón rojo **"⬇ DESCARGAR PDF"**.

- Si cargaste **1 archivo** → se descarga un PDF llamado `Commercial_Invoice_[nombre original].pdf`
- Si cargaste **varios archivos** → se descarga un ZIP llamado `Commercial_Invoices.zip` con todos los PDFs procesados

---

## 📦 Guía: Módulo Factura Mermas

### ¿Qué es una Factura Merma?

Cuando hay **pérdida de producto** (por daño, rechazo, etc.) y necesitas generar una factura con cantidades menores a la original, usas este módulo. Tú solo cambias el **número de cajas** y la aplicación recalcula todo automáticamente.

### Cómo usar

#### Paso 1: Cambiar al módulo Mermas
Haz clic en la pestaña **"📦 Factura Mermas"** (arriba, junto a "📄 Commercial Invoice").

#### Paso 2: Cargar la factura
Arrastra o selecciona **un PDF** de factura. La aplicación leerá automáticamente la tabla de productos y extraerá:
- Código del producto
- Cantidad de cajas
- Peso (KG o LB)
- Valor unitario
- Total por línea

#### Paso 3: Modificar las cajas
En la columna **"Cajas"** verás campos editables (con borde naranja). Cambia el número de cajas en los productos que tengan merma.

Al cambiar las cajas, automáticamente se recalcula:
- ✅ La **cantidad** (peso) proporcional
- ✅ El **total** de esa línea
- ✅ El **gran total** de la factura
- Los valores modificados aparecen en naranja, y los originales tachados al lado

#### Paso 4: Vista previa (opcional)
Haz clic en **"◫ Mostrar Preview"** para ver cómo quedará el PDF final en tiempo real.

#### Paso 5: Generar PDF
Haz clic en **"⬇ Generar PDF Merma"**. Se descargará como `MERMA_[nombre original].pdf`.

> 📝 **Nota:** El módulo de Mermas también aplica las transformaciones de Commercial Invoice (oculta el timbre, agrega "COMMERCIAL INVOICE", etc.) al generar el PDF.

---

## 🔄 ¿Qué le hace exactamente al PDF?

La aplicación aplica las siguientes modificaciones a cada página de tu factura:

### Para Empresas Aquachile:
| # | Operación | Qué hace |
|---|---|---|
| 1 | Ocultar empresa | Tapa "EMPRESAS AQUACHILE S.A." con un rectángulo blanco |
| 2 | Reescribir empresa | Escribe "EMPRESAS AQUACHILE S.A." en la posición correcta |
| 3 | Ocultar factura | Tapa "FACTURA DE EXPORTACIÓN ELECTRÓNICA" |
| 4 | Ocultar SII | Tapa "S.I.I. - PTO MONTT" |
| 5 | Título nuevo | Agrega "COMMERCIAL INVOICE" en rojo |
| 6 | Timbre electrónico | Tapa el código de barras del SII con un rectángulo blanco |
| 7 | Notas | Si escribiste notas, las muestra en un recuadro |

### Para Los Fiordos:
| # | Operación | Qué hace |
|---|---|---|
| 1 | Ocultar factura | Tapa "FACTURA DE EXPORTACIÓN ELECTRÓNICA" |
| 2 | Ocultar SII | Tapa "S.I.I. - RANCAGUA" |
| 3 | Título nuevo | Agrega "COMMERCIAL INVOICE" en rojo |
| 4 | Timbre electrónico | Tapa el código de barras del SII |
| 5 | Notas | Si escribiste notas, las muestra en un recuadro |

---

## 🌙 Modo Oscuro

La aplicación tiene modo claro y modo oscuro. Para cambiarlo, haz clic en el botón **🌙/☀️** en la esquina superior derecha del header. Tu preferencia se guarda automáticamente.

---

## 🔧 Panel de Administración (Solo Administradores)

### ¿Qué es?

El panel de administración (`admin.html`) es un editor visual donde se configuran las "capas" que se aplican a los PDFs. **Solo deben usarlo los administradores** — los cambios aquí afectan a todos los usuarios.

🔗 **Enlace:** [https://aquashield-team.github.io/Modulo-Invoice-Converter/admin.html](https://aquashield-team.github.io/Modulo-Invoice-Converter/admin.html)

### ¿Qué puedo hacer en el Admin?

#### Gestionar Plantillas (Perfiles)
- **Crear** nuevas plantillas para otras empresas
- **Renombrar** plantillas existentes
- **Eliminar** plantillas (siempre debe quedar al menos una)

#### Editar Capas de Operación
Cada plantilla tiene una lista de "capas" que son las modificaciones al PDF:

| Tipo de capa | Ícono | Descripción |
|---|---|---|
| **Recuadro** | 🟠 | Rectángulo de color (generalmente blanco) para ocultar texto |
| **Texto** | 🟢 | Texto que se escribe sobre el PDF |
| **Notas** | 🟡 | Recuadro de notas con borde y texto multi-línea |
| **Imagen** | 🟣 | Imagen pegada desde el portapapeles |

Cada capa se puede:
- **Mover** arrastrándola directamente sobre la vista previa del PDF
- **Redimensionar** usando los puntos de control en las esquinas
- **Ajustar** manualmente editando los valores numéricos (X, Y, Ancho, Alto)
- **Reordenar** con las flechas ▲▼
- **Duplicar** o **eliminar**

#### Herramientas de Calibración
- **Cuadrícula:** Activa una grilla con coordenadas cada 50px para posicionar las capas con precisión
- **Cajas Rojas:** Modo de calibración que muestra los rectángulos en rojo semi-transparente y los textos en azul, para ver exactamente qué se está tapando

#### Guardar Cambios
Haz clic en **"Guardar Config"** para guardar los cambios. Los cambios se aplican automáticamente en la aplicación principal.

> ⚠️ **Para publicar cambios a todos los usuarios (GH Pages):** Los cambios guardados en el admin se guardan solo en tu navegador. Para que lleguen a todos, un administrador debe actualizar el archivo `profiles.json` en el repositorio de GitHub.

---

## ❓ Preguntas Frecuentes

### ¿Por qué el PDF descargado se ve igual que el original?
Asegúrate de estar usando la **plantilla correcta** (Empresas Aquachile o Los Fiordos). Si la plantilla no coincide con la factura, los rectángulos blancos quedarán en posiciones incorrectas.

### ¿Las notas son obligatorias?
No. Si dejas el campo de notas vacío, no aparecerá ningún recuadro de notas en el PDF.

### ¿Puedo procesar facturas de otras empresas (no Aquachile ni Fiordos)?
Sí, pero necesitas que un administrador **cree una nueva plantilla** en el panel de administración con las coordenadas correctas para esa empresa.

### ¿Se guarda algo en algún servidor?
**No.** Todo se procesa en tu navegador. Los PDFs nunca salen de tu computador. Las notas y preferencias se guardan solo en tu navegador (localStorage).

### ¿Funciona sin internet?
La primera vez necesitas internet para cargar la página. Una vez cargada, puedes usarla sin conexión. Sin embargo, si abres la página desde GitHub Pages, siempre necesitarás conexión.

### ¿Puedo usar la app en mi celular?
La aplicación está diseñada para computador. Puede funcionar en tablets, pero **no se recomienda** para celulares por el tamaño de la interfaz.

### ¿Qué navegadores son compatibles?
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ⚠️ Safari (funcionalidad limitada)

### Se ven mal los colores / el logo no aparece
Intenta:
1. **Ctrl+Shift+Delete** → borrar caché del navegador
2. Recargar la página con **Ctrl+F5**
3. O abre en una ventana **InPrivate/Incógnito**

### ¿Cuántos archivos puedo procesar a la vez?
No hay límite fijo, pero recuerda que todo se procesa en tu navegador. Con más de **~20 archivos** o archivos muy grandes, puede tardar más.

---

## 📂 Archivos del Proyecto

| Archivo | Descripción |
|---|---|
| `index.html` | Aplicación principal (Commercial Invoice + Mermas) |
| `admin.html` | Panel de administración para configurar plantillas |
| `js/pdfEngine.js` | Motor de procesamiento de PDFs (compartido entre index y admin) |
| `profiles.json` | Configuración de plantillas (fuente remota) |
| `logo_aquachile_dark.png` | Logo para modo claro |
| `logo_aquachile_white.png` | Logo para modo oscuro |
| `favicon.ico` | Ícono de pestaña del navegador |

---

## 🏗️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| React 18 | Interfaz de usuario |
| Tailwind CSS | Estilos visuales |
| pdf.js | Renderizado de PDFs (vista previa) |
| pdf-lib | Modificación programática de PDFs |
| JSZip | Generación de archivos ZIP |
| GitHub Pages | Hospedaje web gratuito |

> **No requiere instalación, servidor ni compilación.** Todo funciona directamente en el navegador.

---

<p align="center">
  <strong>AquaShield</strong> by AquaChile · Cultivos Marinos, Procesadora y Comercializadora<br>
  <em>Desde el rincón más austral del mundo 🌊</em>
</p>
