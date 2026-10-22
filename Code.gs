// SROI booking backend (standalone script; writes to the sheet below by id).
// Deploy: Extensions > Apps Script > paste > Deploy > New deployment > Web app
//         (Execute as: Me, Who has access: Anyone) > copy the /exec URL into index.html (API_URL).
const SHEET_NAME = null;        // null = first sheet
const FIRST_ROW = 6, LAST_ROW = 17;   // slot rows (header is row 5)
const TEACHERS = ['楊詩弘', '楊佳翰', '黃仲菁', '陳璽任'];
const NOTIFY = Session.getEffectiveUser().getEmail();

function sheet_() {
  const ss = SpreadsheetApp.openById('18Ay2sG-7orSvysBiUF-YbMzpEk_l0fKlG5b8GsEgUkE');
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function day_(s) {   // "10/29" | "2026/10/29" | "2026-10-29" -> "10/29"
  const p = String(s).split(/[\/-]/);
  return p[0].length === 4 ? p[1] + '/' + p[2].slice(0, 2).replace(/\D/g, '') : p[0] + '/' + p[1];
}

function doGet() {
  const sh = sheet_();
  const v = sh.getRange(FIRST_ROW, 1, LAST_ROW - FIRST_ROW + 1, 6).getDisplayValues();
  const slots = v.map((r, i) => ({ row: FIRST_ROW + i, date: day_(r[0]), weekday: r[1], time: r[2], tier: r[3], taken: r[5] !== '' }));
  return json_({ ok: true, slots });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    const sh = sheet_();
    if (TEACHERS.indexOf(b.name) < 0) return json_({ ok: false, error: '名單中找不到這位老師' });
    const row = Number(b.row);
    if (!(row >= FIRST_ROW && row <= LAST_ROW)) return json_({ ok: false, error: '時段不存在' });
    if (sh.getRange(row, 3).getDisplayValue() !== b.time) return json_({ ok: false, error: '時段已更新，請重新整理頁面' });
    const cur = sh.getRange(row, 6).getValue();
    if (cur !== '' && cur !== b.name) return json_({ ok: false, error: '這個時段剛被其他老師預約了，請改選其他時段' });
    // one booking per teacher: moving to a new slot frees the old one
    const names = sh.getRange(FIRST_ROW, 6, LAST_ROW - FIRST_ROW + 1, 1).getValues();
    names.forEach((n, i) => { if (n[0] === b.name && FIRST_ROW + i !== row) sh.getRange(FIRST_ROW + i, 5, 1, 4).setValues([['空缺', '', '', '']]); });
    sh.getRange(row, 5, 1, 4).setValues([['確定', b.name, b.mode || '', b.note || '']]);
    MailApp.sendEmail(NOTIFY, '[SROI 訪談預約] ' + b.name, b.name + ' 預約 ' + day_(sh.getRange(row, 1).getDisplayValue()) + ' ' + b.time + '（' + (b.mode || '未選') + '）\n備註：' + (b.note || '無'));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}
