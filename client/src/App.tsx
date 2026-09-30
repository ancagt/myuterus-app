import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { getConditions } from './api';
import ConditionCard from './components/ConditionCard';
import CursorTrail, { type CursorDesign } from './components/CursorTrail';
import CyclePage from './components/CyclePage';
import logo from './assets/uterus.png';
import { symptomOptions, menuItems } from './constants';
import type { Condition } from './types';

const CURSOR_DESIGN_KEY = 'myuterus-cursor-design';
const cursorDesigns: { value: CursorDesign; label: string; icon: string; description: string }[] = [
  { value: 'stars', label: 'Yellow stars', icon: '✦', description: 'A little sparkle as you move.' },
  { value: 'hearts', label: 'Pink hearts', icon: '♥', description: 'A soft trail of hearts.' },
  { value: 'flowers', label: 'Flowers', icon: '✿', description: 'A trail of delicate blooms.' },
  { value: 'none', label: 'None', icon: '○', description: 'Keep the cursor simple.' },
];

function readCursorDesign(): CursorDesign {
  try {
    const stored = localStorage.getItem(CURSOR_DESIGN_KEY);
    return stored === 'hearts' || stored === 'flowers' || stored === 'none' ? stored : 'stars';
  } catch {
    return 'stars';
  }
}

function ConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConditions().then(setConditions).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unknown error'));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">EXPLORE & LEARN</span>
        <h1>Conditions</h1>
        <p>Understand your body, one step at a time.</p>
      </div>
      {error && <p className="error" role="alert">Unable to load conditions: {error}</p>}
      <div className="grid">
        {conditions.map((condition) => (
          <ConditionCard key={condition.id} condition={condition} />
        ))}
      </div>
    </section>
  );
}

function SymptomsPage() {

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom],
    );
  };

  const handleAdd = () => {
    if (!selectedSymptoms.length) return;

    const label = selectedSymptoms.length === 1 ? 'symptom' : 'symptoms';
    setMessage(`${selectedSymptoms.length} ${label} added to your list.`);
    setSelectedSymptoms([]);
  };

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">YOUR WELLBEING</span>
        <h1>My Symptoms</h1>
        <p>A space to keep track of how you feel.</p>
      </div>

      <div className="symptom-selector" aria-label="Symptoms selector">
        {symptomOptions.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);

          return (
            <div key={symptom} className={`symptom-pill${isSelected ? ' selected' : ''}`}>
              <button
                type="button"
                className="symptom-option"
                onClick={() => toggleSymptom(symptom)}
                aria-pressed={isSelected}
              >
                {symptom}
              </button>
              {isSelected && (
                <button
                  type="button"
                  className="symptom-remove"
                  aria-label={`Remove ${symptom}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSymptom(symptom);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="symptom-actions">
        <button type="button" className="save-button" onClick={handleAdd} disabled={!selectedSymptoms.length}>
          Add
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

function SettingsPage({ cursorDesign, onChange }: { cursorDesign: CursorDesign; onChange: (design: CursorDesign) => void }) {
  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">MAKE IT YOURS</span>
        <h1>Settings</h1>
        <p>Choose how your cursor looks around the app.</p>
      </div>
      <fieldset className="cursor-settings">
        <legend>Cursor design</legend>
        <div className="cursor-options">
          {cursorDesigns.map(({ value, label, icon, description }) => (
            <label key={value} className={`cursor-option${cursorDesign === value ? ' chosen' : ''}`}>
              <input
                type="radio"
                name="cursor-design"
                value={value}
                checked={cursorDesign === value}
                onChange={() => onChange(value)}
              />
              <span className={`cursor-preview cursor-preview--${value}`} aria-hidden="true">{icon}</span>
              <span className="cursor-option-text"><strong>{label}</strong><span>{description}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

export default function App() {
  const [cursorDesign, setCursorDesign] = useState<CursorDesign>(readCursorDesign);

  function changeCursorDesign(design: CursorDesign) {
    setCursorDesign(design);
    try {
      localStorage.setItem(CURSOR_DESIGN_KEY, design);
    } catch {
      // The choice still works for this session if browser storage is unavailable.
    }
  }

  return (
    <div className="app-shell">
      <CursorTrail design={cursorDesign} />
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="MyUterus logo" className="brand-mark" />
          <span>MyUterus</span>
        </div>
        <nav aria-label="My account">
          <div className="nav-title">myaccount</div>
          {menuItems.map(({ label, path, icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-note">A little care, every day. <span aria-hidden="true">✿</span></p>
      </aside>

      <main className="main-content">
        <div className="content-inner">
          <Routes>
            <Route path="/" element={<Navigate to="/conditions" replace />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/mysymptoms" element={<SymptomsPage />} />
            <Route path="/mycycle" element={<CyclePage />} />
            <Route path="/settings" element={<SettingsPage cursorDesign={cursorDesign} onChange={changeCursorDesign} />} />
            <Route path="*" element={<Navigate to="/conditions" replace />} />
          </Routes>
          <p className="disclaimer">Educational information only — not a substitute for medical advice.</p>
        </div>
      </main>
    </div>
  );
}