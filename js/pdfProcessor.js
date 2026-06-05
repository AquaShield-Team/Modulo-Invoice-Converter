/**
 * AquaShield PDF Processor v3
 * Sistema de perfiles/plantillas para múltiples tipos de documento.
 * Soporte para operaciones dinámicas (rectángulos, textos, notas).
 */

window.AquaShieldPDF = (function () {
  let isLoaded = false;
  let isLoading = false;

  const STORAGE_KEY = 'aquashield_profiles_v1';

  // ── Inicialización de librerías ──────────────────────────────
  async function init() {
    if (isLoaded) return true;
    if (isLoading) {
      while (isLoading) await new Promise((r) => setTimeout(r, 80));
      return isLoaded;
    }
    isLoading = true;
    try {
      if (!window.PDFLib) await loadScript("https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js");
      if (!window.JSZip) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
      isLoaded = true;
    } catch (err) {
      console.error("Error cargando librerías:", err);
    }
    isLoading = false;
    return isLoaded;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  function num(v) {
    const p = parseFloat(String(v).replace(",", "."));
    return isNaN(p) ? 0 : p;
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.substring(0, 2), 16) / 255,
      g: parseInt(h.substring(2, 4), 16) / 255,
      b: parseInt(h.substring(4, 6), 16) / 255,
    };
  }

  // ── Operaciones por defecto para perfil "Factura Exportación" ──
  function getDefaultOperations() {
    return [
      { id: crypto.randomUUID(), type: "rect", label: 'Ocultar "FACTURA DE EXPORT..."', x: 380, y: 840, width: 190, height: 45, color: "#FFFFFF" },
      { id: crypto.randomUUID(), type: "rect", label: 'Ocultar "S.I.I. PTO MONTT"', x: 415, y: 800, width: 120, height: 12, color: "#FFFFFF" },
      { id: crypto.randomUUID(), type: "text", label: "COMMERCIAL INVOICE", text: "COMMERCIAL INVOICE", x: 405, y: 860, size: 14, color: "#FF0000" },
      { id: crypto.randomUUID(), type: "notes", label: "Notas", x: 40, y: 20, width: 230, height: 125, color: "#000000", borderColor: "#000000", bgColor: "#FFFFFF" },
    ];
  }

  // ── Sistema de Perfiles ─────────────────────────────────────
  function migrateToProfiles() {
    // Migrar desde v9 (config única) al sistema de perfiles
    let existingOps = null;

    // Intentar v9
    try {
      const raw = localStorage.getItem("aquachile_invoice_config_v9");
      if (raw) existingOps = JSON.parse(raw);
    } catch (e) {}

    // Intentar v8
    if (!existingOps) {
      try {
        const oldRaw = localStorage.getItem("aquachile_invoice_config_v8");
        if (oldRaw) {
          const old = JSON.parse(oldRaw);
          const ops = [];
          if (old.hideFacturaText?.enabled) {
            ops.push({ id: crypto.randomUUID(), type: "rect", label: 'Ocultar "FACTURA DE EXPORT..."', x: old.hideFacturaText.x, y: old.hideFacturaText.y, width: old.hideFacturaText.width, height: old.hideFacturaText.height, color: "#FFFFFF" });
          }
          if (old.hideSIIText?.enabled) {
            ops.push({ id: crypto.randomUUID(), type: "rect", label: 'Ocultar "S.I.I. PTO MONTT"', x: old.hideSIIText.x, y: old.hideSIIText.y, width: old.hideSIIText.width, height: old.hideSIIText.height, color: "#FFFFFF" });
          }
          if (old.newTitle?.enabled) {
            ops.push({ id: crypto.randomUUID(), type: "text", label: "COMMERCIAL INVOICE", text: "COMMERCIAL INVOICE", x: old.newTitle.x, y: old.newTitle.y, size: old.newTitle.size, color: "#FF0000" });
          }
          if (old.siiCode?.enabled) {
            ops.push({ id: crypto.randomUUID(), type: "rect", label: "Timbre Electrónico", x: old.siiCode.x, y: old.siiCode.y, width: old.siiCode.width, height: old.siiCode.height, color: "#FFFFFF" });
          }
          if (ops.length > 0) existingOps = ops;
        }
      } catch (e) {}
    }

    const defaultProfile = {
      id: crypto.randomUUID(),
      name: "Factura Exportación",
      operations: existingOps || getDefaultOperations(),
    };

    const data = {
      activeId: defaultProfile.id,
      profiles: [defaultProfile],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function loadProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.profiles && data.profiles.length > 0) return data;
      }
    } catch (e) {}
    return migrateToProfiles();
  }

  async function syncFromRemote() {
    try {
      const res = await fetch('profiles.json?t=' + Date.now());
      if (!res.ok) return loadProfiles();
      const remote = await res.json();
      if (!remote || !remote.profiles || remote.profiles.length === 0) return loadProfiles();

      // Merge: use remote operations structure but preserve user's note text
      const existing = localStorage.getItem(STORAGE_KEY);
      let localData = null;
      try { localData = existing ? JSON.parse(existing) : null; } catch(e) {}

      for (const rProfile of remote.profiles) {
        const lProfile = localData?.profiles?.find(p => p.id === rProfile.id);
        if (lProfile) {
          // Preserve user's note text from localStorage
          for (const rOp of rProfile.operations) {
            if (rOp.type === 'notes') {
              const lOp = lProfile.operations.find(o => o.id === rOp.id);
              if (lOp && lOp.text) rOp.text = lOp.text;
            }
          }
        }
      }

      // Keep activeId from local if it exists
      if (localData?.activeId) remote.activeId = localData.activeId;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      return remote;
    } catch (e) { console.warn('syncFromRemote:', e); }
    return loadProfiles();
  }

  function saveProfiles(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getActiveProfile(data) {
    if (!data) data = loadProfiles();
    return data.profiles.find(p => p.id === data.activeId) || data.profiles[0];
  }

  function setActiveProfile(profileId) {
    const data = loadProfiles();
    if (data.profiles.some(p => p.id === profileId)) {
      data.activeId = profileId;
      saveProfiles(data);
    }
    return data;
  }

  function createProfile(name) {
    const data = loadProfiles();
    const newProfile = {
      id: crypto.randomUUID(),
      name: name || "Nuevo Perfil",
      operations: [],
    };
    data.profiles.push(newProfile);
    data.activeId = newProfile.id;
    saveProfiles(data);
    return data;
  }

  function deleteProfile(profileId) {
    const data = loadProfiles();
    if (data.profiles.length <= 1) return data; // No permitir eliminar el último
    data.profiles = data.profiles.filter(p => p.id !== profileId);
    if (data.activeId === profileId) {
      data.activeId = data.profiles[0].id;
    }
    saveProfiles(data);
    return data;
  }

  function renameProfile(profileId, newName) {
    const data = loadProfiles();
    const profile = data.profiles.find(p => p.id === profileId);
    if (profile) {
      profile.name = newName;
      saveProfiles(data);
    }
    return data;
  }

  // ── Compatibilidad: loadOperations/saveOperations (usan perfil activo) ──
  function loadOperations() {
    const data = loadProfiles();
    return getActiveProfile(data).operations;
  }



  // ── Aplicar operaciones a una página de PDF ──────────────────
  async function applyOperations(page, font, operations, options = {}, pdfDoc = null) {
    const { rgb } = window.PDFLib;
    const { calibrationMode = false, showGrid = false } = options;
    const { width, height } = page.getSize();

    // Grid (solo en admin)
    if (showGrid) {
      const gridFont = font;
      for (let x = 0; x < width; x += 50) {
        page.drawLine({ start: { x, y: 0 }, end: { x, y: height }, color: rgb(0.6, 0.8, 1), thickness: 0.5 });
        page.drawText(x.toString(), { x: x + 2, y: height - 14, size: 8, font: gridFont, color: rgb(0, 0, 0.7) });
      }
      for (let y = 0; y < height; y += 50) {
        page.drawLine({ start: { x: 0, y }, end: { x: width, y }, color: rgb(0.6, 0.8, 1), thickness: 0.5 });
        page.drawText(y.toString(), { x: 3, y: y + 2, size: 8, font: gridFont, color: rgb(0, 0.5, 0) });
      }
    }

    // Aplicar cada operación
    for (const op of operations) {
      if (op.type === "rect") {
        const c = calibrationMode ? { r: 1, g: 0, b: 0 } : hexToRgb(op.color || "#FFFFFF");
        page.drawRectangle({
          x: num(op.x),
          y: num(op.y),
          width: num(op.width),
          height: num(op.height),
          color: rgb(c.r, c.g, c.b),
          opacity: calibrationMode ? 0.35 : 1,
        });
      } else if (op.type === "text") {
        const c = calibrationMode ? { r: 0, g: 0, b: 1 } : hexToRgb(op.color || "#FF0000");
        page.drawText(op.text || "", {
          x: num(op.x),
          y: num(op.y),
          size: num(op.size || 14),
          font: font,
          color: rgb(c.r, c.g, c.b),
        });
      } else if (op.type === "notes") {
        // No dibujar el recuadro de notas si no hay texto
        if (!op.text || !op.text.trim()) continue;
        const bx = num(op.x), by = num(op.y), bw = num(op.width || 230), bh = num(op.height || 125);
        const borderC = calibrationMode ? { r: 0, g: 0.4, b: 0 } : hexToRgb(op.borderColor || "#000000");
        const bgC = hexToRgb(op.bgColor || "#FFFFFF");
        const textC = calibrationMode ? { r: 0, g: 0.4, b: 0 } : hexToRgb(op.color || "#000000");
        const titleSize = num(op.titleSize || 9);
        const contentSize = num(op.size || 8);
        // Fondo blanco
        page.drawRectangle({ x: bx, y: by, width: bw, height: bh, color: rgb(bgC.r, bgC.g, bgC.b), opacity: calibrationMode ? 0.3 : 1 });
        // Borde del recuadro
        page.drawRectangle({ x: bx, y: by, width: bw, height: bh, borderColor: rgb(borderC.r, borderC.g, borderC.b), borderWidth: 0.8, color: rgb(1, 1, 1), opacity: 0 });
        // Título "Notas"
        const title = op.label || "Notas";
        page.drawText(title, { x: bx + 4, y: by + bh - titleSize - 3, size: titleSize, font: font, color: rgb(textC.r, textC.g, textC.b) });
        // Línea separadora bajo título
        page.drawLine({ start: { x: bx, y: by + bh - titleSize - 7 }, end: { x: bx + bw, y: by + bh - titleSize - 7 }, color: rgb(borderC.r, borderC.g, borderC.b), thickness: 0.5 });
        // Contenido de texto (multi-línea)
        if (op.text) {
          const lineH = num(op.lineHeight || contentSize * 1.5);
          const lines = op.text.split("\n");
          let curY = by + bh - titleSize - 10 - contentSize;
          for (const line of lines) {
            if (curY < by + 4) break;
            page.drawText(line, { x: bx + 4, y: curY, size: contentSize, font: font, color: rgb(textC.r, textC.g, textC.b) });
            curY -= lineH;
          }
        }
      } else if (op.type === "image" && op.imageData) {
        try {
          if (!pdfDoc) { console.warn('pdfDoc requerido para imagen'); continue; }
          const imgBytes = Uint8Array.from(atob(op.imageData.split(',').pop()), c => c.charCodeAt(0));
          let img;
          if (op.imageData.includes('image/png')) {
            img = await pdfDoc.embedPng(imgBytes);
          } else {
            img = await pdfDoc.embedJpg(imgBytes);
          }
          const iw = num(op.width || img.width);
          const ih = num(op.height || img.height);
          // Mantener aspect ratio si solo se especifica width
          const scale = iw / img.width;
          const finalH = op.height ? ih : img.height * scale;
          page.drawImage(img, {
            x: num(op.x),
            y: num(op.y),
            width: iw,
            height: finalH,
          });
        } catch (e) { console.warn('Error embebiendo imagen:', e); }
      }
    }
  }

  // ── Procesar múltiples archivos ──────────────────────────────
  async function processFiles(filesData, operations, options = {}) {
    const loaded = await init();
    if (!loaded) throw new Error('No se pudieron cargar las librerías PDF');
    const { PDFDocument, StandardFonts } = window.PDFLib;
    const { calibrationMode = false, showGrid = false } = options;
    const processedFiles = [];

    for (const fileData of filesData) {
      const pdfDoc = await PDFDocument.load(fileData.data);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        await applyOperations(page, font, operations, { calibrationMode, showGrid }, pdfDoc);
      }

      const prefix = calibrationMode ? "PRUEBA_" : "Commercial_Invoice_";
      processedFiles.push({ name: prefix + fileData.name, bytes: await pdfDoc.save() });
    }

    if (processedFiles.length === 1) {
      return {
        url: URL.createObjectURL(new Blob([processedFiles[0].bytes], { type: "application/pdf" })),
        name: processedFiles[0].name,
        isZip: false,
      };
    } else {
      const zip = new window.JSZip();
      processedFiles.forEach((pf) => zip.file(pf.name, pf.bytes));
      return {
        url: URL.createObjectURL(await zip.generateAsync({ type: "blob" })),
        name: calibrationMode ? "PRUEBAS_Facturas.zip" : "Commercial_Invoices.zip",
        isZip: true,
      };
    }
  }

  // ── API Pública ──────────────────────────────────────────────
  return {
    init,
    processFiles,
    applyOperations,
    // Perfiles
    loadProfiles,
    syncFromRemote,
    saveProfiles,
    getActiveProfile,
    setActiveProfile,
    createProfile,
    deleteProfile,
    renameProfile,
    // Compatibilidad
    loadOperations,
    getDefaultOperations,
    num,
  };
})();
