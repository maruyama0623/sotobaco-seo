#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { TextDecoder } = require('util');

const SOURCE_APP_ID = 72;
const TARGET_PARENT_APP_ID = 93;
const TARGET_DETAIL_APP_ID = 94;
const CLIENT_APP_ID = 69;
const PAGE_SIZE = 500;
const WRITE_BATCH = 100;
const REPORT_DIR = path.join(process.cwd(), 'docs', 'migrations');

const REQUIRED_ENV = ['KINTONE_BASE_URL', 'KINTONE_USERNAME', 'KINTONE_PASSWORD'];

const FIELD = {
  PARENT: {
    QUESTION_ID: 'question_id',
    QUESTION_DATE: 'question_date',
    STATUS: 'status',
    SERVICE: 'service',
    CLIENT_SEARCH: 'client_search',
    CLIENT_NO: 'client_no',
    CLIENT_NAME: 'client_name',
    INQUIRER_NAME: 'inquirer_name',
    INQUIRER_MAIL: 'inquirer_mail',
    TITLE: 'title',
    MEMO: 'memo',
  },
  DETAIL: {
    QUESTION_ID: 'question_id',
    BRANCH_NUMBER: 'branch_number',
    QUESTION_DATE: 'question_date',
    STATUS: 'status',
    QUESTION_DETAIL: 'question_detail',
    ANSWER_DATE: 'answer_date',
    ANSWER_ASSOCIATE: 'answer_associate',
    ANSWER_DETAIL: 'answer_detail',
  },
  CSV: {
    OLD_QUESTION_ID: '問い合わせID',
    QUESTION_DATE: '問い合わせ日付',
    STATUS: 'ステータス',
    SERVICE: '対象サービス',
    COMPANY_REGISTERED: '問い合わせ会社名（顧客登録済み）',
    COMPANY_UNREGISTERED: '問い合わせ会社名（顧客未登録分）',
    INQUIRER_NAME: '問い合わせ者名',
    INQUIRER_MAIL: '問い合わせ者メールアドレス',
    TITLE: 'タイトル',
    QUESTION_DETAIL: '問い合わせ内容',
    ANSWER_DATE: '回答日付',
    ANSWER_ASSOCIATE: '回答者（ソトバコ.）',
    ANSWER_DETAIL: '回答内容',
    MEMO: '備考',
  },
};

const STATUS_OPTIONS = new Set(['未回答', '回答済', '要調査']);

const normalizeBaseUrl = (u) => String(u || '').replace(/\/$/, '');
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const text = (v) => (v === undefined || v === null ? '' : String(v));
const pad = (n, len) => String(n).padStart(len, '0');

const normalizeNameBasic = (s) => text(s).replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim();
const normalizeNameNoSpace = (s) => normalizeNameBasic(s).replace(/\s+/g, '');

const htmlEntityMap = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  '#39': "'",
};

const decodeHtmlEntities = (input) => {
  let s = text(input);
  s = s.replace(/&#(\d+);/g, (_, n) => {
    const code = Number(n);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => {
    const code = parseInt(n, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&([a-zA-Z0-9#]+);/g, (m, name) => (htmlEntityMap[name] ? htmlEntityMap[name] : m));
  return s;
};

const htmlToPlain = (html) =>
  decodeHtmlEntities(
    text(html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
      .replace(/<[^>]*>/g, '')
  )
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const normalizeStatus = (value, hasAnswer) => {
  const s = text(value).trim();
  if (STATUS_OPTIONS.has(s)) return s;
  return hasAnswer ? '回答済' : '未回答';
};

const normalizeDate = (value) => {
  const s = text(value).trim();
  if (!s) return '';
  const m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (!m) return '';
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return '';
  return `${pad(y, 4)}-${pad(mo, 2)}-${pad(d, 2)}`;
};

const ymdKey = (ymd) => {
  const m = text(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[1]}${m[2]}${m[3]}` : '';
};

const nowJstYmd = () => {
  const d = new Date();
  const f = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const p = f.formatToParts(d).reduce((acc, cur) => {
    acc[cur.type] = cur.value;
    return acc;
  }, {});
  return `${p.year}-${p.month}-${p.day}`;
};

const stripBom = (s) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);

const decodeCsvBuffer = (buf) => {
  const candidates = ['shift_jis', 'utf-8'];
  for (const enc of candidates) {
    try {
      const decoder = new TextDecoder(enc, { fatal: false });
      const out = decoder.decode(buf);
      if (out.includes(',')) return stripBom(out);
    } catch (e) {
      // ignore and fallback
    }
  }
  return stripBom(buf.toString('utf8'));
};

const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === '"') {
      if (inQuotes && content[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && ch === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && content[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
    rows.pop();
  }
  return rows;
};

const loadCsvRows = (csvPath) => {
  const raw = fs.readFileSync(csvPath);
  const textData = decodeCsvBuffer(raw);
  const matrix = parseCsv(textData);
  if (!matrix.length) return [];
  const headers = matrix[0].map((h) => stripBom(text(h)));
  const rows = [];
  for (let i = 1; i < matrix.length; i += 1) {
    const cols = matrix[i];
    const row = { __line: i + 1 };
    headers.forEach((h, idx) => {
      row[h] = text(cols[idx]);
    });
    rows.push(row);
  }
  return rows;
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = {
    csvPath: '',
    execute: false,
    limitGroups: null,
    onlyLines: null,
  };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if ((a === '--csv' || a === '-c') && args[i + 1]) {
      out.csvPath = args[i + 1];
      i += 1;
      continue;
    }
    if (a === '--execute') {
      out.execute = true;
      continue;
    }
    if (a === '--limit-groups' && args[i + 1]) {
      const n = Number(args[i + 1]);
      if (Number.isFinite(n) && n > 0) out.limitGroups = n;
      i += 1;
      continue;
    }
    if (a === '--only-lines' && args[i + 1]) {
      const set = new Set();
      String(args[i + 1])
        .split(',')
        .map((v) => Number(v.trim()))
        .forEach((n) => {
          if (Number.isFinite(n) && n >= 2) set.add(n);
        });
      out.onlyLines = set.size ? set : null;
      i += 1;
    }
  }
  return out;
};

const ensureEnv = () => {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      console.error(`[error] Missing env: ${key}`);
      process.exit(1);
    }
  }
};

const createApiClient = () => {
  const baseUrl = normalizeBaseUrl(process.env.KINTONE_BASE_URL);
  const authToken = Buffer.from(`${process.env.KINTONE_USERNAME}:${process.env.KINTONE_PASSWORD}`).toString('base64');
  return {
    baseUrl,
    client: axios.create({
      baseURL: `${baseUrl}/k/v1`,
      headers: {
        'X-Cybozu-Authorization': authToken,
      },
      timeout: 60000,
    }),
    userClient: axios.create({
      baseURL: baseUrl,
      headers: {
        'X-Cybozu-Authorization': authToken,
      },
      timeout: 60000,
    }),
  };
};

const fetchAllRecords = async (api, appId, query, fields) => {
  const out = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const q = `${query} limit ${PAGE_SIZE} offset ${offset}`;
    const params = { app: appId, query: q };
    if (fields && fields.length) params.fields = fields;
    const res = await api.get('/records.json', { params });
    const page = res.data.records || [];
    out.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return out;
};

const fetchUsers = async (api) => {
  const users = new Set();
  try {
    for (let offset = 0; ; offset += 100) {
      const res = await api.get('/v1/users.json', {
        params: {
          size: 100,
          offset,
        },
      });
      const page = Array.isArray(res.data.users) ? res.data.users : [];
      page.forEach((u) => {
        if (u && u.code) users.add(u.code);
      });
      if (page.length < 100) break;
    }
    return { enabled: true, users };
  } catch (e) {
    return { enabled: false, users };
  }
};

const buildClientIndex = (records) => {
  const exact = new Map();
  const noSpace = new Map();
  records.forEach((r) => {
    const clientNo = text(r.client_no && r.client_no.value).trim();
    const clientName = text(r.client_name && r.client_name.value).trim();
    if (!clientNo || !clientName) return;
    const data = { clientNo, clientName };
    const k1 = normalizeNameBasic(clientName);
    const k2 = normalizeNameNoSpace(clientName);
    if (!exact.has(k1)) exact.set(k1, []);
    if (!noSpace.has(k2)) noSpace.set(k2, []);
    exact.get(k1).push(data);
    noSpace.get(k2).push(data);
  });
  return { exact, noSpace };
};

const listCompanyCandidates = (rows) => {
  const names = [];
  rows.forEach((r) => {
    const reg = normalizeNameBasic(r[FIELD.CSV.COMPANY_REGISTERED]);
    const unreg = normalizeNameBasic(r[FIELD.CSV.COMPANY_UNREGISTERED]);
    if (reg) names.push(reg);
    if (unreg) names.push(unreg);
  });
  const seen = new Set();
  const out = [];
  names.forEach((name) => {
    const key = normalizeNameBasic(name);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(name);
  });
  return out;
};

const resolveClient = (rows, clientIndex) => {
  const candidates = listCompanyCandidates(rows);
  const ambiguous = [];
  for (const name of candidates) {
    const k1 = normalizeNameBasic(name);
    const exact = clientIndex.exact.get(k1) || [];
    if (exact.length === 1) return { ok: true, by: 'exact', name, client: exact[0] };
    if (exact.length > 1) {
      ambiguous.push({ name, mode: 'exact', count: exact.length });
      continue;
    }
    const k2 = normalizeNameNoSpace(name);
    const ns = clientIndex.noSpace.get(k2) || [];
    if (ns.length === 1) return { ok: true, by: 'nospace', name, client: ns[0] };
    if (ns.length > 1) ambiguous.push({ name, mode: 'nospace', count: ns.length });
  }
  return { ok: false, reason: ambiguous.length ? 'ambiguous_client_name' : 'client_not_found', candidates, ambiguous };
};

const collectFirstNonEmpty = (rows, field) => {
  for (const r of rows) {
    const v = text(r[field]).trim();
    if (v) return v;
  }
  return '';
};

const sortRowsForBranch = (rows) =>
  [...rows].sort((a, b) => {
    const da = normalizeDate(a[FIELD.CSV.QUESTION_DATE]);
    const db = normalizeDate(b[FIELD.CSV.QUESTION_DATE]);
    if (da && db && da !== db) return da < db ? -1 : 1;
    if (da && !db) return -1;
    if (!da && db) return 1;
    return (a.__line || 0) - (b.__line || 0);
  });

const buildGroups = (rows) => {
  const map = new Map();
  rows.forEach((r, idx) => {
    const oldId = text(r[FIELD.CSV.OLD_QUESTION_ID]).trim();
    const key = oldId ? `old:${oldId}` : `row:${idx + 1}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return [...map.entries()].map(([groupKey, list]) => ({ groupKey, rows: list }));
};

const validateParentRequired = (parent) => {
  const missing = [];
  const required = [
    FIELD.PARENT.CLIENT_SEARCH,
    FIELD.PARENT.TITLE,
    FIELD.PARENT.INQUIRER_NAME,
    FIELD.PARENT.INQUIRER_MAIL,
    FIELD.PARENT.SERVICE,
  ];
  required.forEach((code) => {
    if (!text(parent[code] && parent[code].value).trim()) missing.push(code);
  });
  return missing;
};

const parseExistingQuestionIdSeq = (value) => {
  const m = text(value).trim().match(/^(\d{8})-(\d+)$/);
  if (!m) return null;
  return { dateKey: m[1], seq: Number(m[2]) };
};

const buildExistingSeqMap = (records) => {
  const map = new Map();
  records.forEach((r) => {
    const parsed = parseExistingQuestionIdSeq(r.question_id && r.question_id.value);
    if (!parsed) return;
    const prev = map.get(parsed.dateKey) || 0;
    if (parsed.seq > prev) map.set(parsed.dateKey, parsed.seq);
  });
  return map;
};

const nextQuestionId = (dateKey, seqMap) => {
  const prev = seqMap.get(dateKey) || 0;
  const next = prev + 1;
  seqMap.set(dateKey, next);
  return `${dateKey}-${pad(next, 3)}`;
};

const toTimestamp = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1, 2);
  const day = pad(d.getDate(), 2);
  const hh = pad(d.getHours(), 2);
  const mm = pad(d.getMinutes(), 2);
  const ss = pad(d.getSeconds(), 2);
  return `${y}${m}${day}-${hh}${mm}${ss}`;
};

const writeReport = (report) => {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const outPath = path.join(REPORT_DIR, `migrate-72-to-93-94-${toTimestamp()}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return outPath;
};

const postRecords = async (api, app, records) => {
  if (!records.length) return;
  for (let i = 0; i < records.length; i += WRITE_BATCH) {
    const chunk = records.slice(i, i + WRITE_BATCH);
    await api.post('/records.json', { app, records: chunk });
    process.stdout.write(`[apply] app=${app} ${Math.min(i + WRITE_BATCH, records.length)}/${records.length}\n`);
  }
};

const main = async () => {
  ensureEnv();
  const { csvPath, execute, limitGroups, onlyLines } = parseArgs();
  if (!csvPath) {
    console.error('[error] --csv が必要です。');
    console.error('  例: node scripts/migrate-inquiry-72-to-93-94.js --csv "/path/to/file.csv"');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error(`[error] CSV not found: ${csvPath}`);
    process.exit(1);
  }

  const { client: api, userClient } = createApiClient();
  const loadedRows = loadCsvRows(csvPath);
  const csvRows = onlyLines ? loadedRows.filter((r) => onlyLines.has(r.__line)) : loadedRows;
  if (!csvRows.length) {
    console.log('[ok] CSV行が0件でした。');
    return;
  }

  const groupList = buildGroups(csvRows);
  const groups = limitGroups ? groupList.slice(0, limitGroups) : groupList;

  const [clientRecords, existingParentRecords, userSet] = await Promise.all([
    fetchAllRecords(api, CLIENT_APP_ID, 'order by レコード番号 asc', ['client_no', 'client_name']),
    fetchAllRecords(api, TARGET_PARENT_APP_ID, 'order by $id asc', ['question_id']),
    fetchUsers(userClient),
  ]);

  const clientIndex = buildClientIndex(clientRecords);
  const seqMap = buildExistingSeqMap(existingParentRecords);
  const todayKey = ymdKey(nowJstYmd());

  const parentRecords = [];
  const detailRecords = [];
  const skipped = [];
  const warnings = [];
  const createdPreview = [];
  const unknownAssociateCodes = new Set();

  const sortedGroups = [...groups].sort((a, b) => {
    const ar = sortRowsForBranch(a.rows);
    const br = sortRowsForBranch(b.rows);
    const ad = normalizeDate(ar[0] && ar[0][FIELD.CSV.QUESTION_DATE]);
    const bd = normalizeDate(br[0] && br[0][FIELD.CSV.QUESTION_DATE]);
    if (ad && bd && ad !== bd) return ad < bd ? -1 : 1;
    if (ad && !bd) return -1;
    if (!ad && bd) return 1;
    const ai = ar[0] ? ar[0].__line : 0;
    const bi = br[0] ? br[0].__line : 0;
    return ai - bi;
  });

  for (const group of sortedGroups) {
    const rowsForBranch = sortRowsForBranch(group.rows);
    const clientResolve = resolveClient(rowsForBranch, clientIndex);
    if (!clientResolve.ok) {
      skipped.push({
        groupKey: group.groupKey,
        lineNumbers: rowsForBranch.map((r) => r.__line),
        reason: clientResolve.reason,
        candidates: clientResolve.candidates,
        ambiguous: clientResolve.ambiguous,
      });
      continue;
    }

    const firstDate = normalizeDate(rowsForBranch[0][FIELD.CSV.QUESTION_DATE]) || nowJstYmd();
    const dateKey = ymdKey(firstDate) || todayKey;
    const questionId = nextQuestionId(dateKey, seqMap);

    const latestRow = rowsForBranch[rowsForBranch.length - 1];
    const firstRow = rowsForBranch[0];

    let title = collectFirstNonEmpty(rowsForBranch, FIELD.CSV.TITLE);
    if (!title) {
      title = htmlToPlain(collectFirstNonEmpty(rowsForBranch, FIELD.CSV.QUESTION_DETAIL)).slice(0, 60);
    }
    if (!title) title = '問い合わせ';

    const service = collectFirstNonEmpty(rowsForBranch, FIELD.CSV.SERVICE);
    const inquirerName = collectFirstNonEmpty(rowsForBranch, FIELD.CSV.INQUIRER_NAME);
    const inquirerMail = collectFirstNonEmpty(rowsForBranch, FIELD.CSV.INQUIRER_MAIL);
    const memo = collectFirstNonEmpty(rowsForBranch, FIELD.CSV.MEMO);
    const parentStatus = normalizeStatus(
      latestRow[FIELD.CSV.STATUS],
      !!text(latestRow[FIELD.CSV.ANSWER_DETAIL]).trim()
    );

    const clientNo = clientResolve.client.clientNo;
    const clientName = clientResolve.client.clientName;
    const clientSearch = `【${clientNo}】${clientName}`;

    const parent = {
      [FIELD.PARENT.QUESTION_ID]: { value: questionId },
      [FIELD.PARENT.QUESTION_DATE]: { value: firstDate },
      [FIELD.PARENT.STATUS]: { value: parentStatus },
      [FIELD.PARENT.SERVICE]: { value: service },
      [FIELD.PARENT.CLIENT_SEARCH]: { value: clientSearch, lookup: false },
      [FIELD.PARENT.CLIENT_NO]: { value: clientNo },
      [FIELD.PARENT.CLIENT_NAME]: { value: clientName },
      [FIELD.PARENT.INQUIRER_NAME]: { value: inquirerName },
      [FIELD.PARENT.INQUIRER_MAIL]: { value: inquirerMail },
      [FIELD.PARENT.TITLE]: { value: title },
      [FIELD.PARENT.MEMO]: { value: memo },
    };

    const missing = validateParentRequired(parent);
    if (missing.length) {
      skipped.push({
        groupKey: group.groupKey,
        lineNumbers: rowsForBranch.map((r) => r.__line),
        reason: 'missing_required_parent_field',
        missingFields: missing,
      });
      continue;
    }

    let branchNo = 1;
    for (const row of rowsForBranch) {
      const questionDetail = text(row[FIELD.CSV.QUESTION_DETAIL]).trim();
      if (!questionDetail) {
        warnings.push({
          groupKey: group.groupKey,
          questionId,
          line: row.__line,
          reason: 'detail_skipped_empty_question_detail',
        });
        continue;
      }
      const ansCodeRaw = text(row[FIELD.CSV.ANSWER_ASSOCIATE]).trim();
      let ansCodes = [];
      if (ansCodeRaw) {
        if (!userSet.enabled || userSet.users.has(ansCodeRaw)) {
          ansCodes = [{ code: ansCodeRaw }];
        } else {
          unknownAssociateCodes.add(ansCodeRaw);
        }
      }
      detailRecords.push({
        [FIELD.DETAIL.QUESTION_ID]: { value: questionId },
        [FIELD.DETAIL.BRANCH_NUMBER]: { value: String(branchNo) },
        [FIELD.DETAIL.QUESTION_DATE]: { value: normalizeDate(row[FIELD.CSV.QUESTION_DATE]) || firstDate },
        [FIELD.DETAIL.STATUS]: {
          value: normalizeStatus(row[FIELD.CSV.STATUS], !!text(row[FIELD.CSV.ANSWER_DETAIL]).trim()),
        },
        [FIELD.DETAIL.QUESTION_DETAIL]: { value: questionDetail },
        [FIELD.DETAIL.ANSWER_DATE]: { value: normalizeDate(row[FIELD.CSV.ANSWER_DATE]) },
        [FIELD.DETAIL.ANSWER_ASSOCIATE]: { value: ansCodes },
        [FIELD.DETAIL.ANSWER_DETAIL]: { value: text(row[FIELD.CSV.ANSWER_DETAIL]) },
      });
      branchNo += 1;
    }

    parentRecords.push(parent);
    createdPreview.push({
      groupKey: group.groupKey,
      lineNumbers: rowsForBranch.map((r) => r.__line),
      questionId,
      clientSearch,
      detailCount: branchNo - 1,
      oldInquiryIds: [...new Set(rowsForBranch.map((r) => text(r[FIELD.CSV.OLD_QUESTION_ID]).trim()).filter(Boolean))],
      sourceAppId: SOURCE_APP_ID,
      sourceLine: firstRow.__line,
    });
  }

  if (unknownAssociateCodes.size) {
    warnings.push({
      reason: 'unknown_answer_associate_codes_ignored',
      codes: [...unknownAssociateCodes].sort(),
    });
  }
  if (!userSet.enabled) {
    warnings.push({
      reason: 'user_api_unavailable_answer_associate_not_validated',
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: execute ? 'execute' : 'dry-run',
    source: {
      appId: SOURCE_APP_ID,
      csvPath,
      csvRows: csvRows.length,
      onlyLines: onlyLines ? [...onlyLines].sort((a, b) => a - b) : null,
      groups: groups.length,
    },
    target: {
      parentAppId: TARGET_PARENT_APP_ID,
      detailAppId: TARGET_DETAIL_APP_ID,
    },
    summary: {
      parentPlanned: parentRecords.length,
      detailPlanned: detailRecords.length,
      skippedGroups: skipped.length,
      warnings: warnings.length,
    },
    skipped,
    warnings,
    createdPreview,
  };

  if (execute) {
    await postRecords(api, TARGET_PARENT_APP_ID, parentRecords);
    await postRecords(api, TARGET_DETAIL_APP_ID, detailRecords);
  }

  const reportPath = writeReport(report);
  console.log(`[info] mode=${report.mode}`);
  console.log(`[info] sourceRows=${csvRows.length} groups=${groups.length}`);
  console.log(`[info] parentPlanned=${parentRecords.length} detailPlanned=${detailRecords.length}`);
  console.log(`[info] skippedGroups=${skipped.length} warnings=${warnings.length}`);
  console.log(`[info] report=${reportPath}`);
  if (!execute) {
    console.log('[dry-run] 実登録は未実施です。--execute を付けると登録します。');
  } else {
    console.log('[ok] 移行データの登録が完了しました。');
  }
};

main().catch((err) => {
  console.error('[error] migration failed');
  if (err && err.response && err.response.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(err && err.stack ? err.stack : err);
  }
  process.exit(1);
});
