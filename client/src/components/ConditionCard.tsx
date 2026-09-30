import type { Condition } from '../types';

export default function ConditionCard({ condition }: { condition: Condition }) {
  return (
    <article className="card">
      <h2>{condition.name}</h2>
      {condition.affectsFertility && <span className="badge">Affects fertility</span>}
      <p>{condition.summary}</p>
      <h3>Symptoms</h3>
      <ul>
        {condition.symptoms.map((symptom) => (
          <li key={symptom}>{symptom}</li>
        ))}
      </ul>
    </article>
  );
}