// ===== INTEREST CHIPS =====
document.querySelectorAll('.chip').forEach(c =>
  c.addEventListener('click', () => c.classList.toggle('active'))
);

// ===== TAB STATE =====
let lastData = null;

function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTab(tab);
}

function renderTab(tab) {
  if (!lastData) return;
  const content = document.getElementById('results-content');
  content.innerHTML = '';
  if (tab === 'itinerary') renderItinerary(content, lastData);
  else if (tab === 'activities') renderActivities(content, lastData);
  else if (tab === 'stays') renderStays(content, lastData);
  else if (tab === 'tips') renderTips(content, lastData);
}

// ===== HELPERS =====
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function card(headerHTML, bodyHTML, delay) {
  return `<div class="result-card" style="animation-delay:${delay || 0}s">
    <div class="card-header">${headerHTML}</div>
    <div class="card-body">${bodyHTML}</div>
  </div>`;
}

// ===== RENDER ITINERARY =====
function renderItinerary(container, data) {
  if (!data.itinerary || !data.itinerary.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text2);padding:1rem 0">No itinerary available.</p>';
    return;
  }
  data.itinerary.forEach((day, i) => {
    const header = `
      <div>
        <div class="card-title">${esc(day.day_title)}</div>
        <div class="card-subtitle">${esc(day.date_label || 'Day ' + (i + 1))}</div>
      </div>
      <span class="badge badge-vibe">${esc(day.vibe || 'Romantic')}</span>`;
    const items = (day.schedule || []).map(s =>
      `<div class="tl-item">
        <div class="tl-time">${esc(s.time || '')}</div>
        <div class="tl-text">${esc(s.activity)}</div>
      </div>`).join('');
    const tip = day.tip ? `<div class="tip-box">💡 ${esc(day.tip)}</div>` : '';
    const body = `<div class="timeline">${items}</div>${tip}`;
    container.innerHTML += card(header, body, i * 0.1);
  });
}

// ===== RENDER ACTIVITIES =====
function renderActivities(container, data) {
  if (!data.activities || !data.activities.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text2);padding:1rem 0">No activities available.</p>';
    return;
  }
  const iconBgs = ['#faeeda', '#e1f5ee', '#fbeaf0', '#e6f1fb', '#eeedfe', '#eaf3de'];
  data.activities.forEach((act, i) => {
    const isFree = act.cost === 'free' || (act.price_low === 0 && !act.price_high);
    const price = isFree ? 'Free' : (act.price_low ? '$' + act.price_low + (act.price_high ? '–$' + act.price_high : '+') : 'Paid');
    const header = `
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div class="act-icon" style="background:${iconBgs[i % iconBgs.length]}">${esc(act.emoji || '🌿')}</div>
        <div>
          <div class="card-title">${esc(act.name)}</div>
          <div class="card-subtitle">${esc(act.location || act.category || '')}</div>
        </div>
      </div>
      <span class="badge ${isFree ? 'badge-free' : 'badge-paid'}">${price}</span>`;
    const body = `
      <p class="card-desc">${esc(act.description)}</p>
      ${act.why_couples ? '<div class="tip-box">💑 ' + esc(act.why_couples) + '</div>' : ''}`;
    container.innerHTML += card(header, body, i * 0.08);
  });
}

// ===== RENDER STAYS =====
function renderStays(container, data) {
  if (!data.stays || !data.stays.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text2);padding:1rem 0">No stay recommendations available.</p>';
    return;
  }
  data.stays.forEach((stay, i) => {
    const header = `
      <div>
        <div class="card-title">${esc(stay.name)}</div>
        <div class="card-subtitle">${esc(stay.type || 'Accommodation')}</div>
      </div>
      <span class="badge badge-paid">${esc(stay.price_range || 'Varies')}</span>`;
    const body = `
      <p class="card-desc">${esc(stay.description)}</p>
      ${stay.highlights ? '<div class="tip-box">✨ ' + esc(stay.highlights) + '</div>' : ''}
      ${stay.best_for ? '<p style="font-size:12px;color:var(--text2);margin-top:8px">Best for: ' + esc(stay.best_for) + '</p>' : ''}`;
    container.innerHTML += card(header, body, i * 0.1);
  });
}

// ===== RENDER TIPS =====
function renderTips(container, data) {
  if (!data.local_tips || !data.local_tips.length) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text2);padding:1rem 0">No tips available.</p>';
    return;
  }
  const tipItems = data.local_tips.map(tip =>
    `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px">
      <div style="width:6px;height:6px;border-radius:50%;background:var(--gold);margin-top:6px;flex-shrink:0"></div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--dark);margin-bottom:2px">${esc(tip.title)}</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.5">${esc(tip.detail)}</div>
      </div>
    </div>`).join('');

  container.innerHTML += card(
    `<div class="card-title">Local Insider Tips</div>`,
    tipItems,
    0
  );

  if (data.cost_summary) {
    const costItems = data.cost_summary.map(c =>
      `<div class="cost-item">
        <div class="cost-label">${esc(c.label)}</div>
        <div class="cost-value">${esc(c.value)}</div>
      </div>`).join('');
    container.innerHTML += card(
      `<div><div class="card-title">Estimated Budget</div><div class="card-subtitle">Approximate costs for two</div></div>`,
      `<div class="cost-grid">${costItems}</div>`,
      0.15
    );
  }
}

// ===== MAIN PLAN FUNCTION =====
async function planRetreat() {
  const location = document.getElementById('location').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const tripType = document.getElementById('trip-type').value;
  const budget = document.getElementById('budget').value;
  const extra = document.getElementById('extra').value.trim();
  const interests = Array.from(document.querySelectorAll('.chip.active')).map(c => c.dataset.val);

  if (!location) {
    document.getElementById('location').focus();
    return;
  }

  const btn = document.getElementById('plan-btn');
  btn.disabled = true;
  btn.textContent = 'Planning your escape...';

  const section = document.getElementById('results-section');
  const content = document.getElementById('results-content');
  section.classList.remove('hidden');
  content.innerHTML = '<div class="loading-state"><div class="spinner"></div>Finding romantic spots just for you…</div>';

  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const prompt = `You are a romantic travel and activities expert. Plan a couples retreat based on these details:

Location/Home: ${location}
${destination ? 'Destination/Visiting: ' + destination : 'Trip type: Stay local or nearby'}
Trip length: ${tripType}
Budget: ${budget}
Interests: ${interests.length ? interests.join(', ') : 'general outdoor and romantic activities'}
Extra notes: ${extra || 'none'}

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "itinerary": [
    {
      "day_title": "Romantic title for day",
      "date_label": "Day 1 / Saturday / etc",
      "vibe": "short vibe word",
      "schedule": [
        {"time": "9am", "activity": "description"},
        {"time": "11am", "activity": "description"}
      ],
      "tip": "insider tip for this day"
    }
  ],
  "activities": [
    {
      "name": "Activity name",
      "emoji": "single emoji",
      "category": "category",
      "location": "specific place name or area",
      "description": "2-3 sentence romantic description",
      "cost": "free OR paid",
      "price_low": 0,
      "price_high": 50,
      "why_couples": "why this is special for couples"
    }
  ],
  "stays": [
    {
      "name": "Property or area name",
      "type": "cabin / inn / hotel / camping / etc",
      "description": "romantic 2-sentence description",
      "price_range": "$X–$Y/night",
      "highlights": "top romantic feature",
      "best_for": "type of couple"
    }
  ],
  "local_tips": [
    {"title": "tip title", "detail": "specific actionable detail"},
    {"title": "best time to visit", "detail": "specific detail"},
    {"title": "hidden gem nearby", "detail": "specific place and why"},
    {"title": "free romantic spot", "detail": "specific detail"},
    {"title": "local food pick", "detail": "specific restaurant or food detail"}
  ],
  "cost_summary": [
    {"label": "Activities (2 people)", "value": "$X–$Y"},
    {"label": "Accommodation/night", "value": "$X–$Y"},
    {"label": "Dining/day (2 people)", "value": "$X–$Y"},
    {"label": "Total estimate", "value": "$X–$Y"}
  ]
}

Make recommendations REAL and SPECIFIC to the actual location. Include real place names, actual hot springs, real parks, real restaurants. Mix free and paid options. Be romantic, specific, and genuinely helpful. Include 3 itinerary days (or 1 for day trip), 6 activities, 3 stays, 5 local tips.`;

  try {
const resp = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const resp2 = resp;
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await resp.json();
    const fullText = (data.content || []).map(b => b.type === 'text' ? b.text : '').join('');
    const clean = fullText.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    lastData = JSON.parse(jsonMatch[0]);

    content.innerHTML = '';
    renderItinerary(content, lastData);

  } catch (e) {
    content.innerHTML = `<div class="error-box">Couldn't load recommendations. Please try again — make sure to enter a specific city or region.</div>`;
  }

  btn.disabled = false;
  btn.textContent = '✨ Plan Our Retreat';
}
