import { Router } from 'express';
import { conditions } from '../data/conditions.js';

const router = Router();

// GET /api/conditions?category=fertility&fertility=true&q=pain
router.get('/', (req, res) => {
  const { category, fertility, q } = req.query;
  let result = conditions;

  if (typeof category === 'string') {
    result = result.filter((c) => c.category === category);
  }
  if (fertility === 'true' || fertility === 'false') {
    result = result.filter((c) => c.affectsFertility === (fertility === 'true'));
  }
  if (typeof q === 'string' && q.trim()) {
    const term = q.trim().toLowerCase();
    result = result.filter(
      (c) => c.name.toLowerCase().includes(term) || c.symptoms.some((s) => s.toLowerCase().includes(term)),
    );
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const condition = conditions.find((c) => c.id === req.params.id);
  if (!condition) return res.status(404).json({ error: 'Condition not found' });
  return res.json(condition);
});

export default router;