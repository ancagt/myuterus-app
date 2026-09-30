import { Router } from 'express';
import { conditions } from '../data/conditions.js';

const router = Router();

// GET /api/symptoms -> [{ name, conditions: [id, ...] }]
router.get('/', (_req, res) => {
  const map = new Map<string, string[]>();
  for (const condition of conditions) {
    for (const symptom of condition.symptoms) {
      if (!map.has(symptom)) map.set(symptom, []);
      map.get(symptom)!.push(condition.id);
    }
  }
  const symptoms = [...map.entries()]
    .map(([name, ids]) => ({ name, conditions: ids }))
    .sort((a, b) => a.name.localeCompare(b.name));
  res.json(symptoms);
});

export default router;