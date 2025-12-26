import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Layout, Maximize2, CheckCircle2, Loader2, Settings, Image as ImageIcon } from 'lucide-react';

// --- STYLES (Merged for single-file compatibility) ---
const styles = `
/* --- GLOBAL VARIABLES & RESET --- */
:root {
  --primary: #4F46E5;       /* Indigo 600 */
  --primary-hover: #4338CA; /* Indigo 700 */
  --bg-color: #F0F2F5;
  --card-bg: #FFFFFF;
  --text-main: #1E293B;
  --text-muted: #64748B;
  --border-color: #E2E8F0;
  --input-bg: #F8FAFC;
  --success: #10B981;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
}

/* --- LAYOUT --- */
.app-layout {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.main-container {
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
  }
}

/* --- CARDS & SIDEBAR --- */
.card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid var(--border-color);
  padding: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.icon-badge {
  background: var(--primary);
  color: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  display: flex;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
}

h1 {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  margin: 0;
}

/* --- FORM INPUTS --- */
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.input-wrapper, .select-wrapper {
  position: relative;
}

.field-input, .field-select {
  width: 100%;
  background: var(--input-bg);
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s;
}

.field-input:focus, .field-select:focus {
  border-color: var(--primary);
  background: #fff;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.85rem;
  pointer-events: none;
}

.control-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.complex-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* --- FILE UPLOAD --- */
.file-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--input-bg);
  color: var(--text-muted);
}

.file-drop-zone:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.file-drop-zone.active {
  background: #EEF2FF;
  border-color: var(--primary);
  color: var(--primary);
}

.success-icon { color: var(--success); }

/* --- MARGIN SETTINGS BOX --- */
.margin-settings-box {
  background: var(--input-bg);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.margin-inputs {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* --- BUTTONS --- */
.generate-btn {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);
  transition: transform 0.1s, box-shadow 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.generate-btn:disabled {
  background: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.success-message {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--success);
  font-weight: 700;
  animation: bounce 1s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* --- PREVIEW AREA --- */
.previews-area {
  flex-grow: 1;
}

.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  height: 100%;
}

.preview-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.badge {
  background: #EEF2FF;
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 800;
}

.preview-viewport {
  flex-grow: 1;
  background: var(--input-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  min-height: 400px;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

/* --- GRID PREVIEW LOGIC --- */

/* 1. The Container (Canvas with margins) */
.mural-container {
  position: relative;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* STATE: If margins are active, add thick border and padding */
.mural-container.has-margins {
  border: 4px solid black; /* Outer mural edge */
  padding: 20px;          /* The white margin area */
}

.mural-container:not(.has-margins) {
  border: 1px solid #ddd;
}

/* 2. The Inner Wrapper (The image itself) */
.inner-image-wrapper {
  position: relative;
  overflow: hidden;
}

.mural-container.has-margins .inner-image-wrapper {
  border: 2px solid black; /* Inner image edge */
}

.preview-image-filtered {
  display: block;
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

/* 3. The Grid Overlay */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  pointer-events: none;
}

.grid-cell {
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-number {
  font-size: 8px;
  color: rgba(0,0,0,0.2);
  font-weight: bold;
}

/* 4. Filter Enhancements */
.preview-image-filtered.is-outline {
  opacity: 0.9;
}

.preview-footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.empty-state {
  height: 100%;
  min-height: 600px;
  border: 3px dashed var(--border-color);
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 1rem;
}

.empty-icon { opacity: 0.3; }
`;

// Reusable Components
const FieldInput = ({ label, value, onChange, type = "number", suffix = "" }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className="input-wrapper">
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  </div>
);

const FieldSelect = ({ label, value, onChange, options }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className="select-wrapper">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field-select">
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default function App() {
  // --- STATE MANAGEMENT ---
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [filteredUrl, setFilteredUrl] = useState(null);
  const canvasRef = useRef(null);

  // Dimensions & Units
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [widthFt, setWidthFt] = useState(3);
  const [widthIn, setWidthIn] = useState(3);
  const [heightFt, setHeightFt] = useState(3);
  const [heightIn, setHeightIn] = useState(3);
  const [unit, setUnit] = useState('cm');
  
  // Settings
  const [filter, setFilter] = useState('color');
  const [orientation, setOrientation] = useState('portrait');
  
  // Margins
  const [addMargins, setAddMargins] = useState('no');
  const [marginUnit, setMarginUnit] = useState('cm');
  const [marginX, setMarginX] = useState(5);
  const [marginY, setMarginY] = useState(5);
  const [marginXFt, setMarginXFt] = useState(0);
  const [marginXIn, setMarginXIn] = useState(2);
  const [marginYFt, setMarginYFt] = useState(0);
  const [marginYIn, setMarginYIn] = useState(2);

  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // --- HELPERS ---
  const toCm = (feet, inches) => (parseFloat(feet || 0) * 30.48) + (parseFloat(inches || 0) * 2.54);

  // --- EDGE DETECTION LOGIC (CANVAS) ---
  useEffect(() => {
    if (!previewUrl || filter === 'color') {
      setFilteredUrl(previewUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (filter === 'bw') {
        // High Contrast B&W
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i+1] + data[i+2]) / 3;
          const val = avg > 128 ? 255 : 0;
          data[i] = data[i+1] = data[i+2] = val;
        }
      } else if (filter === 'outline') {
        // Sobel Edge Detection
        const w = canvas.width;
        const h = canvas.height;
        const grayscale = new Uint8ClampedArray(w * h);
        
        // Convert to grayscale first
        for (let i = 0; i < data.length; i += 4) {
          grayscale[i/4] = (data[i] + data[i+1] + data[i+2]) / 3;
        }
        
        const output = new Uint8ClampedArray(w * h);
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            // Sobel kernels
            const gx = 
              -grayscale[idx - w - 1] + grayscale[idx - w + 1] +
              -2 * grayscale[idx - 1] + 2 * grayscale[idx + 1] +
              -grayscale[idx + w - 1] + grayscale[idx + w + 1];
            const gy = 
              -grayscale[idx - w - 1] - 2 * grayscale[idx - w] - grayscale[idx - w + 1] +
              grayscale[idx + w - 1] + 2 * grayscale[idx + w] + grayscale[idx + w + 1];
            
            const edge = Math.sqrt(gx * gx + gy * gy);
            // Threshold for outline (White background, Black lines)
            output[idx] = edge > 50 ? 0 : 255; 
          }
        }
        
        // Write back to image data
        for (let i = 0; i < output.length; i++) {
          const val = output[i];
          data[i*4] = data[i*4+1] = data[i*4+2] = val;
          data[i*4+3] = 255; // Alpha
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setFilteredUrl(canvas.toDataURL());
    };
  }, [previewUrl, filter]);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setDownloaded(false);
    }
  };

  const getGridInfo = () => {
    const tw = unit === 'cm' ? width : toCm(widthFt, widthIn);
    const th = unit === 'cm' ? height : toCm(heightFt, heightIn);
    const a4_w = orientation === 'portrait' ? 21.0 : 29.7;
    const a4_h = orientation === 'portrait' ? 29.7 : 21.0;
    return {
      cols: Math.max(1, Math.ceil(tw / a4_w)),
      rows: Math.max(1, Math.ceil(th / a4_h)),
    };
  };

  const { cols, rows } = getGridInfo();

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    let tw = unit === 'cm' ? width : toCm(widthFt, widthIn);
    let th = unit === 'cm' ? height : toCm(heightFt, heightIn);
    let mx = addMargins === 'yes' ? (marginUnit === 'cm' ? marginX : toCm(marginXFt, marginXIn)) : 0;
    let my = addMargins === 'yes' ? (marginUnit === 'cm' ? marginY : toCm(marginYFt, marginYIn)) : 0;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_width_cm', tw);
    formData.append('target_height_cm', th);
    formData.append('filter_type', filter);
    formData.append('orientation', orientation);
    formData.append('add_margins', addMargins === 'yes');
    formData.append('margin_x_cm', mx);
    formData.append('margin_y_cm', my);

    try {
      const res = await axios.post('http://localhost:8000/generate-stencil/', formData, { 
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stencil_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      setDownloaded(true);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Inject styles */}
      <style>{styles}</style>

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="main-container">
        
        {/* --- LEFT SIDEBAR: CONTROLS --- */}
        <aside className="sidebar card">
          <div className="app-header">
            <div className="icon-badge"><Layout size={24} /></div>
            <h1>STENCILMAKER</h1>
          </div>

          <div className="control-group">
            <label className="input-label">SOURCE MATERIAL</label>
            <div className="file-upload-wrapper">
              <input type="file" id="fileInput" hidden onChange={handleFileChange} accept="image/*" />
              <label htmlFor="fileInput" className={`file-drop-zone ${file ? 'active' : ''}`}>
                {file ? <CheckCircle2 className="success-icon" /> : <Upload className="upload-icon" />}
                <span>{file ? file.name : "Select Image"}</span>
              </label>
            </div>
          </div>

          <div className="control-row">
            <FieldSelect label="System" value={unit} onChange={setUnit} options={[{label: 'Metric (cm)', value: 'cm'}, {label: 'Imperial (ft)', value: 'ft'}]} />
            <FieldSelect label="Filter" value={filter} onChange={setFilter} options={[{label: 'Color', value: 'color'}, {label: 'B&W', value: 'bw'}, {label: 'Outline', value: 'outline'}]} />
          </div>

          {unit === 'cm' ? (
            <div className="control-row">
              <FieldInput label="Mural Width" value={width} suffix="cm" onChange={setWidth} />
              <FieldInput label="Mural Height" value={height} suffix="cm" onChange={setHeight} />
            </div>
          ) : (
            <div className="complex-input-group">
              <div className="control-row">
                <FieldInput label="Width (ft)" value={widthFt} onChange={setWidthFt} />
                <FieldInput label="In" value={widthIn} onChange={setWidthIn} />
              </div>
              <div className="control-row">
                <FieldInput label="Height (ft)" value={heightFt} onChange={setHeightFt} />
                <FieldInput label="In" value={heightIn} onChange={setHeightIn} />
              </div>
            </div>
          )}

          <div className="margin-settings-box">
            <FieldSelect label="Add White Margins?" value={addMargins} onChange={setAddMargins} options={[{label: 'No Margins', value: 'no'}, {label: 'Yes, Add Borders', value: 'yes'}]} />
            
            {addMargins === 'yes' && (
              <div className="margin-inputs">
                <FieldSelect label="Margin Unit" value={marginUnit} onChange={setMarginUnit} options={[{label: 'cm', value: 'cm'}, {label: 'ft/in', value: 'ft'}]} />
                {marginUnit === 'cm' ? (
                  <div className="control-row">
                    <FieldInput label="Sides (X)" value={marginX} suffix="cm" onChange={setMarginX} />
                    <FieldInput label="Top/Bot (Y)" value={marginY} suffix="cm" onChange={setMarginY} />
                  </div>
                ) : (
                  <div className="complex-input-group">
                    <div className="control-row">
                      <FieldInput label="Sides (ft)" value={marginXFt} onChange={setMarginXFt} />
                      <FieldInput label="In" value={marginXIn} onChange={setMarginXIn} />
                    </div>
                    <div className="control-row">
                      <FieldInput label="Top/Bot (ft)" value={marginYFt} onChange={setMarginYFt} />
                      <FieldInput label="In" value={marginYIn} onChange={setMarginYIn} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <FieldSelect label="Paper Orientation" value={orientation} onChange={setOrientation} options={[{label: 'Portrait (A4)', value: 'portrait'}, {label: 'Landscape (A4)', value: 'landscape'}]} />

          <button 
            onClick={handleSubmit} 
            disabled={loading || !file}
            className={`generate-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? <Loader2 className="spinner" /> : <FileText />}
            {loading ? "PROCESSING..." : "GENERATE STENCIL PDF"}
          </button>
          
          {downloaded && (
            <div className="success-message">
              <CheckCircle2 size={20} />
              <span>Download Complete!</span>
            </div>
          )}
        </aside>

        {/* --- RIGHT SIDE: PREVIEWS --- */}
        <div className="previews-area">
          {previewUrl ? (
            <div className="previews-grid">
              
              {/* Card 1: Original */}
              <div className="preview-card card">
                <div className="card-header">
                  <span className="card-title">REFERENCE IMAGE</span>
                  <ImageIcon size={16} className="text-gray" />
                </div>
                <div className="preview-viewport">
                  <img src={previewUrl} alt="Original" className="preview-image" />
                </div>
              </div>

              {/* Card 2: The Grid Logic */}
              <div className="preview-card card">
                <div className="card-header">
                  <span className="card-title">GRID PREVIEW</span>
                  <span className="badge">{cols} × {rows} SHEETS</span>
                </div>

                <div className="preview-viewport">
                  {/* This wrapper handles the OUTER MURAL BORDER 
                      Conditional class 'has-margins' adds the black border + white padding
                  */}
                  <div className={`mural-container ${addMargins === 'yes' ? 'has-margins' : ''}`}>
                    
                    {/* This wrapper handles the INNER IMAGE BORDER
                        It wraps the image and the grid lines 
                    */}
                    <div className="inner-image-wrapper">
                      <img 
                        src={filteredUrl} 
                        alt="Grid Preview" 
                        className={`preview-image-filtered ${filter === 'outline' ? 'is-outline' : ''}`}
                      />
                      
                      {/* CSS Grid Overlay passed via Variables */}
                      <div 
                        className="grid-overlay"
                        style={{ '--cols': cols, '--rows': rows }}
                      >
                        {Array.from({ length: cols * rows }).map((_, i) => (
                          <div key={i} className="grid-cell">
                            <span className="cell-number">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="preview-footer">
                  <p>Black borders show cut lines. White space is your margin.</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="empty-state">
              <Upload size={48} className="empty-icon" />
              <p>Upload artwork to start</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}