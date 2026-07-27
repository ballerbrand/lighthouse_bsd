+--+const { neon } = require('@neondatabase/serverless');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id          SERIAL PRIMARY KEY,
    parent_name TEXT        NOT NULL,
    whatsapp    TEXT        NOT NULL,
    child_name  TEXT        NOT NULL,
    child_grade TEXT        NOT NULL,
    child_school TEXT,
    subjects    TEXT,
    source      TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )
`;

module.exports = async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      parent_name,
      whatsapp,
      child_name,
      child_grade,
      child_school,
      subjects,
      source,
      notes,
    } = req.body || {};

    // Required field validation
    if (!parent_name?.trim() || !whatsapp?.trim() || !child_name?.trim() || !child_grade?.trim()) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Basic phone sanitisation
    const cleanPhone = whatsapp.trim().replace(/\s+/g, '');
    if (!/^\+?[\d\-]{8,20}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid WhatsApp number.' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Ensure table exists (idempotent)
    await sql.unsafe(CREATE_TABLE_SQL);

    const subjectsStr = Array.isArray(subjects)
      ? subjects.filter(Boolean).join(', ')
      : (subjects?.trim() || null);

    await sql`
      INSERT INTO leads
        (parent_name, whatsapp, child_name, child_grade, child_school, subjects, source, notes)
      VALUES (
        ${parent_name.trim()},
        ${cleanPhone},
        ${child_name.trim()},
        ${child_grade.trim()},
        ${child_school?.trim() || null},
        ${subjectsStr || null},
        ${source?.trim() || null},
        ${notes?.trim() || null}
      )
    `;

    return res.status(200).json({
      success: true,
      message: 'Thank you! We will reach out to you on WhatsApp within 24 hours.',
    });
  } catch (err) {
    console.error('[leads] Error:', err);
    return res.status(500).json({
      error: 'Something went wrong on our end. Please try again or contact us directly on WhatsApp.',
    });
  }
};
