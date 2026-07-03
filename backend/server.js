require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const googleAuth = require('./googleClient');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors({ origin: FRONTEND_URL }));
app.use(bodyParser.json());

// -- TASKS --
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(r => ({ ...r, checked: !!r.checked, isOverdue: !!r.isOverdue })));
});
app.post('/api/tasks', async (req, res) => {
  const { error } = await supabase.from('tasks').insert(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.json(req.body);
});
app.put('/api/tasks/:id', async (req, res) => {
  const { text, priority, status, date, checked, isOverdue } = req.body;
  let error;
  if (checked !== undefined && status !== undefined && Object.keys(req.body).length === 2) {
    ({ error } = await supabase.from('tasks').update({ checked, status }).eq('id', req.params.id));
  } else {
    ({ error } = await supabase.from('tasks')
      .update({ text, priority, status, date, checked, isOverdue }).eq('id', req.params.id));
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});
app.delete('/api/tasks/:id', async (req, res) => {
  const { error } = await supabase.from('tasks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- NOTES --
app.get('/api/notes', async (req, res) => {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/api/notes', async (req, res) => {
  const { error } = await supabase.from('notes').insert(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.json(req.body);
});

// -- CHECKLIST --
app.get('/api/checklist', async (req, res) => {
  const { data, error } = await supabase.from('checklist').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(r => ({ ...r, checked: !!r.checked })));
});
app.put('/api/checklist/:id', async (req, res) => {
  const { error } = await supabase.from('checklist').update({ checked: req.body.checked }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- REFLECTION --
app.get('/api/reflection', async (req, res) => {
  const { data, error } = await supabase.from('reflection').select('*').eq('id', 'r1').maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || { wentWell: '', win: '', improvement: '', tomorrowTask: '' });
});
app.put('/api/reflection', async (req, res) => {
  const { wentWell, win, improvement, tomorrowTask } = req.body;
  const { error } = await supabase.from('reflection')
    .upsert({ id: 'r1', wentWell, win, improvement, tomorrowTask });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- USER --
app.get('/api/user', async (req, res) => {
  const { data, error } = await supabase.from('user').select('*').eq('id', 'u1').maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// -- GOALS --
app.get('/api/goals', async (req, res) => {
  const { data, error } = await supabase.from('goals').select('*').eq('id', 'g1').maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.put('/api/goals', async (req, res) => {
  const { title, target, current } = req.body;
  const { error } = await supabase.from('goals').update({ title, target, current }).eq('id', 'g1');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- FOCUS --
app.get('/api/focus', async (req, res) => {
  const { data, error } = await supabase.from('focus_tasks').select('*').eq('id', 'f1').maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.put('/api/focus', async (req, res) => {
  const { title, priority } = req.body;
  const { error } = await supabase.from('focus_tasks').update({ title, priority }).eq('id', 'f1');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- AGENDA --
app.get('/api/agenda', async (req, res) => {
  const { data, error } = await supabase.from('agenda').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/api/agenda', async (req, res) => {
  const { error } = await supabase.from('agenda').insert(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.json(req.body);
});
app.delete('/api/agenda/:id', async (req, res) => {
  const { error } = await supabase.from('agenda').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- MEETINGS --
app.get('/api/meetings', async (req, res) => {
  const { data, error } = await supabase.from('meetings').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/api/meetings', async (req, res) => {
  const { error } = await supabase.from('meetings').insert(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.json(req.body);
});
app.delete('/api/meetings/:id', async (req, res) => {
  const { error } = await supabase.from('meetings').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- TEMPLATES --
app.get('/api/templates', async (req, res) => {
  const { data, error } = await supabase.from('templates').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/api/templates', async (req, res) => {
  const { error } = await supabase.from('templates').insert(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.json(req.body);
});
app.put('/api/templates/:id', async (req, res) => {
  const { title, description } = req.body;
  const { error } = await supabase.from('templates').update({ title, description }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});
app.delete('/api/templates/:id', async (req, res) => {
  const { error } = await supabase.from('templates').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// -- Google Calendar Integration --
app.get('/api/calendar/status', async (req, res) => {
  try {
    const row = await googleAuth.loadTokens(supabase);
    res.json({ connected: !!row });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/calendar/auth', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).send('Google OAuth is not configured. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI in backend/.env');
  }
  res.redirect(googleAuth.getAuthUrl());
});

app.get('/api/calendar/oauth2callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect(`${FRONTEND_URL}/calendar?google=error`);
  try {
    const oauth2Client = googleAuth.createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    await googleAuth.saveTokens(supabase, tokens);
    res.redirect(`${FRONTEND_URL}/calendar?google=connected`);
  } catch (err) {
    console.error('OAuth callback error', err.message);
    res.redirect(`${FRONTEND_URL}/calendar?google=error`);
  }
});

app.post('/api/calendar/disconnect', async (req, res) => {
  try {
    await googleAuth.clearTokens(supabase);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/calendar/events', async (req, res) => {
  try {
    const auth = await googleAuth.getAuthorizedClient(supabase);
    if (!auth) return res.status(401).json({ error: 'Google Calendar not connected' });
    const calendar = google.calendar({ version: 'v3', auth });
    const { timeMin, timeMax } = req.query;
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || undefined,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    });
    res.json((result.data.items || []).map(googleAuth.fromApiEvent));
  } catch (err) {
    console.error('List events error', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar/events', async (req, res) => {
  try {
    const auth = await googleAuth.getAuthorizedClient(supabase);
    if (!auth) return res.status(401).json({ error: 'Google Calendar not connected' });
    const calendar = google.calendar({ version: 'v3', auth });
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: googleAuth.toApiEvent(req.body),
    });
    res.json(googleAuth.fromApiEvent(result.data));
  } catch (err) {
    console.error('Create event error', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/calendar/events/:id', async (req, res) => {
  try {
    const auth = await googleAuth.getAuthorizedClient(supabase);
    if (!auth) return res.status(401).json({ error: 'Google Calendar not connected' });
    const calendar = google.calendar({ version: 'v3', auth });
    const result = await calendar.events.update({
      calendarId: 'primary',
      eventId: req.params.id,
      requestBody: googleAuth.toApiEvent(req.body),
    });
    res.json(googleAuth.fromApiEvent(result.data));
  } catch (err) {
    console.error('Update event error', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/calendar/events/:id', async (req, res) => {
  try {
    const auth = await googleAuth.getAuthorizedClient(supabase);
    if (!auth) return res.status(401).json({ error: 'Google Calendar not connected' });
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({ calendarId: 'primary', eventId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete event error', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
