/* kult8 events: shared by index.html and event pages.
   The sheet link lives here only. */
window.KULT8 = (function(){
  const CONFIG = {
    // Google Sheets: File > Share > Publish to web > events tab > Comma-separated values (.csv)
    EVENTS_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcBhHK4ItthPSynZEGePHAgWAojYB2jw7rboi2lPKHcHNYkGNyBjy6d_-ocKDLXCc0MSgXmxWoAcSa/pub?gid=0&single=true&output=csv"
  };

  // Preview without the sheet: add ?demo=open or ?demo=closed to any page
  const DEMO_CSV =
`event,type,title,date,time,duration,location_note,price,includes,food,capacity,registration_open,register_link,show_on_home,details_url,home_when,home_desc,is_new
frisbee,frisbee,סושיאל פריזבי,,,,פארק החורשות,חינם,,,,1,,1,frisbee.html,פארק החורשות · נובמבר 2026,"שומרים על כושר אירובי בלי לשים לב שזה קורה. מתאים לכל הרמות, כן גם למתחילים לגמרי.",1
chairs-2026-12,meal,"משחק הכיסאות: משתה בסימן ""מישהו זוכר איפה ישבתי?""",2026-12-10,20:00,כ-3 שעות,פלורנטין. הכתובת המדויקת נשלחת לנרשמים,180 ₪,ארוחה מלאה ושתייה ראשונה,צמחוני. אפשר לעדכן על רגישויות בהרשמה,40,1,https://wa.me/972500000000?text=הרשמה%20למשחק%20הכיסאות,1,chairs.html,פלורנטין · דצמבר 2026,"ערב שלם של אוכל טוב, משחקים ואנשים חדשים. כל 20 דקות מתחלפים שולחן, משחק וחברים לשולחן. 70% מגיעים לבד.",0`;

  function parseCSV(text){
    const rows = []; let row = [], field = '', q = false;
    for (let i=0; i<text.length; i++){
      const ch = text[i];
      if (q){
        if (ch === '"'){ if (text[i+1] === '"'){ field += '"'; i++; } else q = false; }
        else field += ch;
      } else if (ch === '"') q = true;
      else if (ch === ','){ row.push(field); field=''; }
      else if (ch === '\n' || ch === '\r'){
        if (ch === '\r' && text[i+1] === '\n') i++;
        row.push(field); rows.push(row); row=[]; field='';
      } else field += ch;
    }
    if (field.length || row.length){ row.push(field); rows.push(row); }
    const head = rows.shift().map(h => h.trim());
    return rows.filter(r => r.some(v => v.trim()))
               .map(r => Object.fromEntries(head.map((h,i) => [h, (r[i]||'').trim()])));
  }

  function heDate(iso){
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('he-IL', { weekday:'long', day:'numeric', month:'long' });
  }

  const today = () => new Date().toISOString().slice(0,10);
  // events with no date (recurring) never expire
  const notPast = r => !r.date || r.date >= today();

  async function load(){
    const demo = new URLSearchParams(location.search).get('demo');
    if (demo){
      const rows = parseCSV(DEMO_CSV);
      if (demo === 'closed') rows.forEach(r => r.registration_open = '0');
      return rows;
    }
    if (CONFIG.EVENTS_CSV_URL.startsWith('REPLACE')) throw new Error('No sheet link in events.js');
    const res = await fetch(CONFIG.EVENTS_CSV_URL, { cache:'no-store' });
    if (!res.ok) throw new Error('Sheet request failed: ' + res.status);
    return parseCSV(await res.text());
  }

  // ?debug=1 on any page shows what the sheet returned
  function debug(msg){
    if (!new URLSearchParams(location.search).get('debug')) return;
    let el = document.getElementById('kult8-debug');
    if (!el){
      el = document.createElement('pre');
      el.id = 'kult8-debug';
      el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:40vh;overflow:auto;margin:0;padding:12px;background:#223428;color:#F5F6EC;font:12px/1.5 monospace;direction:ltr;text-align:left;z-index:99';
      document.body.appendChild(el);
    }
    el.textContent += msg + '\n';
  }

  return { load, heDate, notPast, debug };
})();
