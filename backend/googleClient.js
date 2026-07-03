const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function getAuthUrl() {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
}

async function loadTokens(supabase) {
  const { data, error } = await supabase.from('google_tokens').select('*').eq('id', 'g1').maybeSingle();
  if (error) throw error;
  return data || null;
}

// Google usually omits refresh_token on a silent access-token refresh, so it must
// fall back to whatever is already stored instead of being overwritten with null.
async function saveTokens(supabase, tokens) {
  const existing = await loadTokens(supabase);
  const merged = {
    id: 'g1',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || (existing ? existing.refresh_token : null),
    scope: tokens.scope,
    token_type: tokens.token_type,
    expiry_date: tokens.expiry_date,
  };
  const { error } = await supabase.from('google_tokens').upsert(merged);
  if (error) throw error;
}

async function clearTokens(supabase) {
  const { error } = await supabase.from('google_tokens').delete().eq('id', 'g1');
  if (error) throw error;
}

async function getAuthorizedClient(supabase) {
  const row = await loadTokens(supabase);
  if (!row) return null;

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    scope: row.scope,
    token_type: row.token_type,
    expiry_date: row.expiry_date,
  });

  oauth2Client.on('tokens', (tokens) => {
    saveTokens(supabase, { ...row, ...tokens }).catch((err) => console.error('Failed to persist refreshed tokens', err));
  });

  return oauth2Client;
}

function toApiEvent(body) {
  const event = {
    summary: body.summary,
    description: body.description || undefined,
    location: body.location || undefined,
  };
  if (body.allDay) {
    event.start = { date: body.start };
    event.end = { date: body.end };
  } else {
    event.start = { dateTime: body.start, timeZone: body.timeZone || undefined };
    event.end = { dateTime: body.end, timeZone: body.timeZone || undefined };
  }
  return event;
}

function fromApiEvent(ev) {
  const allDay = !!(ev.start && ev.start.date);
  return {
    id: ev.id,
    summary: ev.summary || '(No title)',
    description: ev.description || '',
    location: ev.location || '',
    start: allDay ? ev.start.date : ev.start.dateTime,
    end: allDay ? ev.end.date : ev.end.dateTime,
    allDay,
    hangoutLink: ev.hangoutLink || '',
    htmlLink: ev.htmlLink || '',
  };
}

module.exports = {
  SCOPES,
  createOAuth2Client,
  getAuthUrl,
  loadTokens,
  saveTokens,
  clearTokens,
  getAuthorizedClient,
  toApiEvent,
  fromApiEvent,
};
