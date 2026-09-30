import { useEffect, useState, type FormEvent } from 'react';

const STORAGE_KEY = 'myuterus-period-days';
const RANGE_KEY = 'myuterus-selected-period-range';
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localDate(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function datesBetween(start: string, end: string): string[] {
  const days: string[] = [];
  const current = localDate(start);
  while (dateKey(current) <= end) {
    days.push(dateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function readSavedDays(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((day): day is string => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)) : [];
  } catch {
    return [];
  }
}

function readSelectedRange(): { start: string; end: string } {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(RANGE_KEY) || 'null');
    if (saved && typeof saved === 'object' && 'start' in saved && 'end' in saved &&
        typeof saved.start === 'string' && typeof saved.end === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(saved.start) &&
        (saved.end === '' || /^\d{4}-\d{2}-\d{2}$/.test(saved.end)) &&
        (!saved.end || saved.start <= saved.end)) {
      return { start: saved.start, end: saved.end };
    }
  } catch {
    // Browser storage may be unavailable.
  }
  return { start: '', end: '' };
}

export default function CyclePage() {
  const today = dateKey(new Date());
  const [range, setRange] = useState(readSelectedRange);
  const { start, end } = range;
  const [month, setMonth] = useState(() => {
    const initial = range.start ? localDate(range.start) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const [periodDays, setPeriodDays] = useState<string[]>(readSavedDays);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(periodDays));
    } catch {
      setMessage('Your browser could not save these dates. They may be lost when you leave.');
    }
  }, [periodDays]);

  useEffect(() => {
    try {
      localStorage.setItem(RANGE_KEY, JSON.stringify(range));
    } catch {
      setMessage('Your browser could not save these dates. They may be lost when you leave.');
    }
  }, [range]);

  const firstDayOffset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const selectedDays = new Set(periodDays);
  const rangeDays = start && end && start <= end ? datesBetween(start, end) : [];
  const highlightedDays = new Set(rangeDays.length ? rangeDays : start ? [start] : []);

  function changeMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectDay(key: string) {
    if (!start || end) {
      setRange({ start: key, end: '' });
    } else if (key < start) {
      setRange({ start: key, end: start });
    } else {
      setRange({ start, end: key });
    }
    setMessage('');
  }

  function changeStart(value: string) {
    setRange({ start: value, end: end && value <= end ? end : '' });
    if (value) setMonth(new Date(localDate(value).getFullYear(), localDate(value).getMonth(), 1));
    setMessage('');
  }

  function changeEnd(value: string) {
    setRange({ start, end: value });
    if (value) setMonth(new Date(localDate(value).getFullYear(), localDate(value).getMonth(), 1));
    setMessage('');
  }

  function registerPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!start || !end || start > end || end > today) {
      setMessage('Choose a valid start and end date, no later than today.');
      return;
    }

    setPeriodDays((saved) => [...new Set([...saved, ...rangeDays])].sort());
    setMessage('Period days saved on this device.');
  }

  function removePeriod() {
    setPeriodDays((saved) => saved.filter((day) => !highlightedDays.has(day)));
    setMessage('Selected period days removed.');
  }

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">YOUR PERSONAL CALENDAR</span>
        <h1>My Cycle</h1>
        <p>A gentle way to keep track of your period days.</p>
      </div>

      <div className="cycle-layout">
        <div className="calendar-panel">
          <div className="calendar-header">
            <div>
              <span className="eyebrow">CYCLE CALENDAR</span>
              <h2>{new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(month)}</h2>
            </div>
            <div className="calendar-controls">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
            </div>
          </div>
          <div className="calendar-grid" role="group" aria-label="Period days calendar">
            {weekdays.map((day) => <span className="weekday" key={day}>{day}</span>)}
            {Array.from({ length: firstDayOffset }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const key = dateKey(date);
              const selected = selectedDays.has(key);
              const highlighted = highlightedDays.has(key);
              return (
                <button
                  className={`calendar-day${selected ? ' selected' : ''}${highlighted ? ' highlighted' : ''}${key === today ? ' today' : ''}`}
                  key={key}
                  type="button"
                  disabled={key > today}
                  aria-label={`${new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date)}${selected ? ', saved period day' : ''}${highlighted ? ', selected date' : ''}`}
                  aria-pressed={highlighted}
                  onClick={() => selectDay(key)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend"><span className="legend-dot" /> Saved period day <span className="legend-hint">Choose a start day, then an end day</span></div>
        </div>

        <div className="cycle-side">
          <div className="cycle-intro"><span aria-hidden="true">✿</span><h2>Your cycle, your way</h2><p>Choose a start and end day on the calendar, or enter the dates below.</p></div>
          <form className="period-form" onSubmit={registerPeriod}>
            <h2>Register a period</h2>
            <label htmlFor="period-start">Start date</label>
            <input id="period-start" type="date" value={start} max={today} required onChange={(event) => changeStart(event.target.value)} />
            <label htmlFor="period-end">End date</label>
            <input id="period-end" type="date" value={end} min={start || undefined} max={today} required onChange={(event) => changeEnd(event.target.value)} />
            {start && <p className="range-summary" role="status">{end ? `${rangeDays.length} ${rangeDays.length === 1 ? 'day' : 'days'} selected (${start} to ${end})` : `Start: ${start} — choose an end date`}</p>}
            <button className="save-button" type="submit">Save period days</button>
            {periodDays.some((day) => highlightedDays.has(day)) && (
              <button className="remove-button" type="button" onClick={removePeriod}>Remove saved days in selection</button>
            )}
            {message && <p className="form-message" role="status">{message}</p>}
            <p className="storage-note">Your dates are stored only in this browser on this device.</p>
          </form>
        </div>
      </div>
    </section>
  );
}