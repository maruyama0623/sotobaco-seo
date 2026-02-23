(() => {
  'use strict';

  const APP_ID = 93;
  const DETAIL_APP_ID = 94;
  const CLIENT_APP_ID = 69;
  const SPACE_CODE = 'contact_list';
  const QUESTION_ID = 'question_id';
  const TITLE = 'title';
  const SERVICE = 'service';
  const QUESTION_DATE = 'question_date';
  const STATUS = 'status';
  const QUESTION_DETAIL = 'question_detail';
  const ANSWER_DATE = 'answer_date';
  const ANSWER_ASSOCIATE = 'answer_associate';
  const ANSWER_DETAIL = 'answer_detail';
  const BRANCH_NUMBER = 'branch_number';
  const CLIENT_NO = 'client_no';
  const CLIENT_NAME = 'client_name';
  const CREATE_TIME = '作成日時';
  const TITLE_SUMMARY_ENDPOINT = 'https://sotobaco.onrender.com/summarize-title';
  const ANSWER_DRAFT_ENDPOINT = 'https://sotobaco.onrender.com/draft-answer';
  const TITLE_SUMMARY_PROXY_TOKEN = 'sbk_20260214_proxy_7f9d2a6c1e8b4d03a75c91f2e6b8ad44';
  const ANSWER_TEMPLATE = `早速ではございますが、お問い合わせいただきました件について回答いたします。

> （ここにお問い合わせ内容を引用）

（お問い合わせ内容に合わせた回答本文。必要に応じて確認項目を番号付きで記載）
1. （確認項目1）
2. （確認項目2）
3. （確認項目3）

ご質問の回答は以上となります。

他にご不明点やお困り事等がございましたら、お気軽にお問い合わせくださいませ。

また、ソトバコポータルには無料でご利用いただけるフリープランもございますので、
ぜひ一度お試しいただけますと幸いでございます。

引き続き何卒よろしくお願い申し上げます。`;
  const REPORT_TEMPLATE = `以下の見出し構成で、サービス別お問い合わせ傾向レポートを作成してください。

【全体サマリー】
- 件数傾向、解決状況、直近の特徴を2〜4行

【よくあるお問い合わせTOP5】
1. 問い合わせテーマ（件数目安）
   - 背景/起きやすい状況
2. ...

【主な原因・背景の仮説】
- 3〜5点

【改善アクション提案】
- 短期（すぐ実施）
- 中期（運用改善）
- 長期（仕組み化）

【返信テンプレート改善ポイント】
- 3〜5点

【次回ヒアリング項目】
1. ...
2. ...
3. ...

注意:
- 断定しすぎず、実務で使える表現にする
- 具体的で短い文にする
- 日本語で出力する`;

  const MIN_SEQ_DIGITS = 3;
  const STYLE_ID = 'app93-contact-list-style';
  const WRAP_ID = 'app93-contact-list-wrap';
  const REPORT_BUTTON_ID = 'cl93-report-open-btn';
  const REPORT_MODAL_ID = 'cl93-report-modal';
  const LEARNING_ENDPOINT = 'https://sotobaco.onrender.com/learning-insights';
  const LEARNING_BUTTON_ID = 'cl93-learning-open-btn';
  const LEARNING_MODAL_ID = 'cl93-learning-modal';
  const userMap = new Map();
  let usersLoaded = false;

  const esc = (v) => String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const text = (v) => String(v == null ? '' : v);
  const pad = (n, digits) => String(n).padStart(digits, '0');
  const h = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  const decodeHtmlEntities = (value) => {
    const el = document.createElement('textarea');
    el.innerHTML = text(value);
    return el.value;
  };
  const summaryState = {
    seq: 0,
    lastSource: '',
  };

  const getJstYmd = (d = new Date()) => {
    const f = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = f.formatToParts(d).reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
    return `${parts.year}${parts.month}${parts.day}`;
  };

  const normalizeDateYmd = (v) => {
    const s = String(v || '');
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.replace(/-/g, '');
    return '';
  };

  const toDateInput = (ymd) => {
    if (!/^\d{8}$/.test(ymd || '')) return '';
    return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
  };

  const cleanSummaryText = (v) => text(v).replace(/\s+/g, ' ').trim();
  const ANSWER_SECTION_MARKERS = [
    '早速ではございますが、お問い合わせいただきました件について回答いたします。',
    'ご質問の回答は以上となります。',
    '他にご不明点やお困り事等がございましたら、お気軽にお問い合わせくださいませ。',
    'また、ソトバコポータルには無料でご利用いただけるフリープランもございますので、',
    'ぜひ一度お試しいただけますと幸いでございます。',
    '引き続き何卒よろしくお願い申し上げます。',
  ];
  const REPORT_SECTION_MARKERS = [
    '【全体サマリー】',
    '【よくあるお問い合わせTOP5】',
    '【主な原因・背景の仮説】',
    '【改善アクション提案】',
    '【返信テンプレート改善ポイント】',
    '【次回ヒアリング項目】',
  ];
  const normalizePastedMultiline = (raw) => {
    let s = text(raw).replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ');
    // When copied from rich text, lines are often separated by an unnecessary blank line.
    for (let i = 0; i < 5; i += 1) {
      const next = s.replace(/([^\n])\n\n(?=[^\n])/g, '$1\n');
      if (next === s) break;
      s = next;
    }
    s = s.replace(/\n{3,}/g, '\n\n');
    return s;
  };
  const htmlToStructuredText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html || ''), 'text/html');

    const walk = (node, depth = 0) => {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();
      if (tag === 'br') return '\n';

      if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(node.children).filter((c) => c.tagName && c.tagName.toLowerCase() === 'li');
        return items
          .map((li, i) => {
            const body = walk(li, depth + 1).trim();
            const head = tag === 'ol' ? `${i + 1}. ` : '・';
            return `${'  '.repeat(depth)}${head}${body}`;
          })
          .join('\n');
      }

      if (tag === 'li') {
        return Array.from(node.childNodes)
          .map((n) => walk(n, depth))
          .join('')
          .replace(/\n{2,}/g, '\n')
          .trim();
      }

      const inner = Array.from(node.childNodes)
        .map((n) => walk(n, depth))
        .join('');

      if (['p', 'div', 'section', 'article', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        return `${inner}\n`;
      }
      return inner;
    };

    const out = walk(doc.body)
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return out;
  };

  const formatDraftAnswerText = (raw) => {
    let s = text(raw).replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ').trim();
    if (!s) return '';
    const hadLineBreak = /\n/.test(s);
    s = s.replace(/[ \t]+/g, ' ');
    s = s.replace(/\s+(\d+\.)\s+/g, '\n$1 ');
    s = s.replace(/\s*>\s*/g, '\n> ');
    if (!hadLineBreak) {
      s = s.replace(/([。！？!?])\s*(?=[^\n])/g, '$1\n');
    }
    const lines = s
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => (line.startsWith('>') ? `> ${line.replace(/^>\s*/, '')}` : line));

    const out = [];
    const pushBlank = () => {
      if (out.length && out[out.length - 1] !== '') out.push('');
    };

    let prevWasQuote = false;
    lines.forEach((line) => {
      const isSection = ANSWER_SECTION_MARKERS.some((m) => line.startsWith(m));
      const isQuote = line.startsWith('>');
      const isList = /^(\d+\.|・|-|\*)\s*/.test(line);

      if (isSection || isList || (isQuote && !prevWasQuote)) pushBlank();
      out.push(line);
      if (isSection) pushBlank();
      prevWasQuote = isQuote;
    });

    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const formatInquiryReportText = (raw) => {
    let s = text(raw).replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ').trim();
    if (!s) return '';
    s = s.replace(/[ \t]+/g, ' ');
    s = s.replace(/\s*【/g, '\n【');
    s = s.replace(/】\s*/g, '】\n');
    s = s.replace(/\s+([0-9]+[.)])\s*/g, '\n$1 ');
    s = s.replace(/\s+-\s+/g, '\n- ');
    s = s.replace(/([。！？!?])\s*(?=【|[0-9]+[.)]|-|$)/g, '$1\n');

    const lines = s
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const out = [];
    const pushBlank = () => {
      if (out.length && out[out.length - 1] !== '') out.push('');
    };

    lines.forEach((line) => {
      const isSection = REPORT_SECTION_MARKERS.some((m) => line.startsWith(m));
      const isList = /^([0-9]+[.)]|-)\s*/.test(line);
      if (isSection || isList) pushBlank();
      out.push(line);
      if (isSection) pushBlank();
    });

    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const canUseSummaryApi = () =>
    /^https?:\/\//.test(TITLE_SUMMARY_ENDPOINT) &&
    !TITLE_SUMMARY_ENDPOINT.includes('YOUR-RENDER-SERVICE');

  const summarizeTitle = async (questionDetail) => {
    if (!canUseSummaryApi()) return '';
    const source = cleanSummaryText(questionDetail);
    if (!source) return '';

    const headers = {
      'Content-Type': 'application/json',
    };
    if (TITLE_SUMMARY_PROXY_TOKEN) headers['x-proxy-token'] = TITLE_SUMMARY_PROXY_TOKEN;

    const body = JSON.stringify({ text: source });
    const [resBody, status] = await kintone.proxy(TITLE_SUMMARY_ENDPOINT, 'POST', headers, body);
    if (Number(status) < 200 || Number(status) >= 300) {
      throw new Error('タイトル要約APIの呼び出しに失敗しました。');
    }
    const parsed = typeof resBody === 'string' ? JSON.parse(resBody) : resBody;
    return cleanSummaryText(parsed && parsed.title);
  };

  const applyTitleSummary = async (rawQuestionDetail) => {
    const source = cleanSummaryText(rawQuestionDetail);
    if (!source) return;
    if (source === summaryState.lastSource) return;

    const seq = ++summaryState.seq;
    try {
      const title = await summarizeTitle(source);
      if (!title) return;
      if (seq !== summaryState.seq) return;
      const state = kintone.app.record.get();
      if (!state || !state.record || !state.record[TITLE]) return;
      state.record[TITLE].value = title;
      kintone.app.record.set(state);
      summaryState.lastSource = source;
    } catch (err) {
      // Keep UX non-blocking for input flow.
      console.warn('[app93-contact-list] title summarize failed', err);
    }
  };

  const addUsers = (users) => {
    (users || []).forEach((u) => {
      const code = text(u.code).trim();
      if (!code) return;
      const name = text(u.name || u.code).trim();
      userMap.set(code, { code, name });
    });
  };

  const listUsers = () => Array.from(userMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  const callUsersApi = async (params) => {
    try {
      return await kintone.api(kintone.api.url('/v1/users', true), 'GET', params);
    } catch (e) {
      return kintone.api(kintone.api.url('/v1/users.json', true), 'GET', params);
    }
  };

  const loadUsers = async () => {
    if (usersLoaded) return;

    const login = kintone.getLoginUser ? kintone.getLoginUser() : null;
    if (login && login.code) addUsers([{ code: login.code, name: login.name }]);

    try {
      const limit = 100;
      for (let offset = 0; offset <= 5000; offset += limit) {
        const res = await callUsersApi({ size: limit, offset });
        const users = Array.isArray(res?.users) ? res.users : [];
        addUsers(users.map((u) => ({ code: u.code, name: u.name })));
        if (users.length < limit) break;
      }
    } catch (e) {
      console.warn('[app93-contact-list] users api unavailable', e);
    } finally {
      usersLoaded = true;
    }
  };

  const userDisplay = (code) => {
    const c = text(code).trim();
    if (!c) return '';
    const u = userMap.get(c);
    return u ? `${u.name} (${u.code})` : c;
  };

  const resolveUserCode = (raw) => {
    const s = text(raw).trim();
    if (!s) return '';
    if (userMap.has(s)) return s;

    const m = s.match(/\(([^()]+)\)\s*$/);
    if (m && userMap.has(m[1])) return m[1];

    const byName = listUsers().filter((u) => u.name === s);
    if (byName.length === 1) return byName[0].code;

    return '';
  };

  const parseClientNoNumber = (v) => {
    const m = text(v).trim().match(/^C(\d+)$/);
    return m ? Number(m[1]) : null;
  };

  const toClientNo = (num) => `C${pad(num, 5)}`;

  const existsClientNo = async (clientNo) => {
    const res = await fetchRecords(CLIENT_APP_ID, `${CLIENT_NO} = "${esc(clientNo)}" limit 1`, [CLIENT_NO]);
    return (res.records || []).length > 0;
  };

  const getNextClientNo = async () => {
    let max = 0;
    const limit = 500;
    for (let offset = 0; offset <= 5000; offset += limit) {
      const res = await fetchRecords(
        CLIENT_APP_ID,
        `order by レコード番号 desc limit ${limit} offset ${offset}`,
        [CLIENT_NO]
      );
      const list = res.records || [];
      if (!list.length) break;
      for (const r of list) {
        const n = parseClientNoNumber(r?.[CLIENT_NO]?.value);
        if (n !== null) {
          max = Math.max(max, n);
        }
      }
    }
    return toClientNo(max + 1);
  };

  const pickAvailableClientNo = async () => {
    const base = parseClientNoNumber(await getNextClientNo()) || 1;
    for (let i = 0; i < 1000; i += 1) {
      const candidate = toClientNo(base + i);
      if (!(await existsClientNo(candidate))) return candidate;
    }
    throw new Error('クライアントCDの採番に失敗しました。');
  };

  const createClientQuick = async (clientName) => {
    const name = text(clientName).trim();
    if (!name) throw new Error('クライアント名を入力してください。');
    const clientNo = await pickAvailableClientNo();
    const payload = {
      app: CLIENT_APP_ID,
      record: {
        [CLIENT_NO]: { value: clientNo },
        [CLIENT_NAME]: { value: name },
      },
    };
    await kintone.api(kintone.api.url('/k/v1/record', true), 'POST', payload);
    return { clientNo, clientName: name };
  };

  const fetchRecords = async (app, query, fields) =>
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
      app,
      query,
      fields,
    });

  const fetchAllRecordsByQuery = async (app, baseQuery, fields, max = 5000) => {
    const limit = 500;
    const records = [];
    for (let offset = 0; offset <= max; offset += limit) {
      const query = `${baseQuery} limit ${limit} offset ${offset}`;
      const res = await fetchRecords(app, query, fields);
      const page = res.records || [];
      records.push(...page);
      if (page.length < limit) break;
    }
    return records;
  };

  const existsQuestionId = async (id, excludeRecordId = null) => {
    const q = [`${QUESTION_ID} = "${esc(id)}"`];
    if (excludeRecordId) q.push(`$id != "${excludeRecordId}"`);
    const res = await fetchRecords(APP_ID, `${q.join(' and ')} limit 1`, [QUESTION_ID]);
    return (res.records || []).length > 0;
  };

  const getQuestionIdDate = (record, isCreate) => {
    const fromQuestionDate = normalizeDateYmd(record?.[QUESTION_DATE]?.value);
    if (fromQuestionDate) return fromQuestionDate;
    if (!isCreate) {
      const created = text(record?.[CREATE_TIME]?.value);
      const m = created.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) return `${m[1]}${m[2]}${m[3]}`;
    }
    return getJstYmd();
  };

  const getNextQuestionId = async (baseDate) => {
    const res = await fetchRecords(
      APP_ID,
      `${QUESTION_ID} like "${esc(baseDate)}-" order by ${QUESTION_ID} desc limit 1`,
      [QUESTION_ID]
    );
    const current = text(res.records?.[0]?.[QUESTION_ID]?.value);
    const m = current.match(new RegExp(`^${baseDate}-(\\d+)$`));
    const seq = m ? Number(m[1]) : 0;
    return `${baseDate}-${pad(seq + 1, MIN_SEQ_DIGITS)}`;
  };

  const pickAvailableQuestionId = async (baseDate, excludeRecordId = null) => {
    let start = 1;
    const latest = await getNextQuestionId(baseDate);
    const m = latest.match(/-(\d+)$/);
    if (m) start = Number(m[1]);

    for (let i = 0; i < 1000; i += 1) {
      const id = `${baseDate}-${pad(start + i, MIN_SEQ_DIGITS)}`;
      if (!(await existsQuestionId(id, excludeRecordId))) return id;
    }
    throw new Error('問い合わせIDの採番候補が見つかりませんでした。');
  };

  const ensureQuestionId = async ({ record, isCreate, recordId }) => {
    const current = text(record?.[QUESTION_ID]?.value).trim();
    let needsAssign = !current;
    if (isCreate && current) needsAssign = await existsQuestionId(current);
    if (!needsAssign) return current;
    const baseDate = getQuestionIdDate(record, isCreate);
    return pickAvailableQuestionId(baseDate, recordId ? String(recordId) : null);
  };

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${WRAP_ID} {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #fbfdff 0%, #f5f9ff 100%);
        border: 1px solid #dbe7f3;
        border-radius: 12px;
        padding: 14px;
      }
      #${WRAP_ID} .cl93-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      #${WRAP_ID} .cl93-title {
        font-size: 14px;
        font-weight: 700;
        color: #1f2e3b;
      }
      #${WRAP_ID} .cl93-sub {
        font-size: 12px;
        color: #607080;
      }
      #${WRAP_ID} .cl93-btn {
        border: 0;
        background: #1768cc;
        color: #fff;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
      }
      #${WRAP_ID} .cl93-btn-sub {
        border: 1px solid #cad6e2;
        background: #fff;
        color: #34485a;
        border-radius: 8px;
        padding: 7px 10px;
        font-size: 12px;
        cursor: pointer;
      }
      #${WRAP_ID} .cl93-btn-ai {
        border: 1px solid #5f6ad4;
        background: #f5f6ff;
        color: #3943a7;
        border-radius: 8px;
        padding: 7px 10px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
      }
      .cl93-client-btn {
        border: 0;
        background: #0d8b66;
        color: #fff;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
      }
      .cl93-client-btn-link {
        border: 1px solid #0d8b66;
        background: #fff;
        color: #0d8b66;
        border-radius: 14px;
        padding: 4px 10px;
        font-size: 11px;
        line-height: 1.4;
        cursor: pointer;
        margin-left: 8px;
        display: inline-block;
        vertical-align: middle;
      }
      .sbk-header-action-btn,
      #${REPORT_BUTTON_ID} {
        min-width: 163px !important;
        height: 44px !important;
        border: 1px solid #d3d8dd !important;
        border-radius: 0 !important;
        background: #f7f9fb !important;
        color: #3493df !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        letter-spacing: 0.04em !important;
        line-height: 1 !important;
        padding: 0 16px !important;
        box-sizing: border-box !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }
      .sbk-header-action-btn:hover,
      #${REPORT_BUTTON_ID}:hover {
        background: #f1f5f9 !important;
      }
      .sbk-header-action-btn:active,
      #${REPORT_BUTTON_ID}:active {
        background: #eaf0f6 !important;
      }
      .sbk-header-action-btn[disabled],
      #${REPORT_BUTTON_ID}[disabled] {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
      }
      @media (max-width: 760px) {
        .sbk-header-action-btn,
        #${REPORT_BUTTON_ID} {
          min-width: 163px !important;
          height: 40px !important;
          font-size: 16px !important;
          padding: 0 16px !important;
        }
      }
      #${REPORT_MODAL_ID} {
        position: fixed;
        inset: 0;
        background: rgba(15, 25, 40, 0.35);
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 16px;
      }
      #${REPORT_MODAL_ID} .cl93-report-dialog {
        width: min(920px, calc(100vw - 32px));
        max-height: calc(100vh - 32px);
        background: #fff;
        border-radius: 12px;
        border: 1px solid #dbe5f0;
        box-shadow: 0 18px 44px rgba(15, 25, 40, 0.2);
        display: grid;
        grid-template-rows: auto auto auto 1fr auto;
        overflow: hidden;
      }
      #${REPORT_MODAL_ID} .cl93-report-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 14px;
        border-bottom: 1px solid #e7eef6;
      }
      #${REPORT_MODAL_ID} .cl93-report-title {
        font-size: 14px;
        font-weight: 700;
        color: #1f2e3b;
      }
      #${REPORT_MODAL_ID} .cl93-report-controls {
        display: grid;
        grid-template-columns: minmax(220px, 360px) auto;
        gap: 8px;
        align-items: end;
        padding: 12px 14px;
        border-bottom: 1px solid #eef3f8;
      }
      #${REPORT_MODAL_ID} .cl93-report-controls label {
        display: block;
        font-size: 11px;
        color: #607080;
        margin-bottom: 4px;
      }
      #${REPORT_MODAL_ID} .cl93-report-controls select {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ccd8e4;
        border-radius: 7px;
        padding: 8px 10px;
        font-size: 13px;
      }
      #${REPORT_MODAL_ID} .cl93-report-status {
        min-height: 18px;
        padding: 8px 14px 0;
        font-size: 12px;
        color: #5f7182;
      }
      #${REPORT_MODAL_ID} .cl93-report-status[data-state="error"] { color: #bb2f2f; }
      #${REPORT_MODAL_ID} .cl93-report-status[data-state="ok"] { color: #0d8b66; }
      #${REPORT_MODAL_ID} .cl93-report-body {
        padding: 10px 14px 14px;
        overflow: auto;
      }
      #${REPORT_MODAL_ID} .cl93-report-text {
        width: 100%;
        box-sizing: border-box;
        min-height: 360px;
        border: 1px solid #ccd8e4;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 13px;
        line-height: 1.7;
        font-family: "Hiragino Sans", "Yu Gothic", sans-serif;
        resize: vertical;
        white-space: pre-wrap;
      }
      #${REPORT_MODAL_ID} .cl93-report-actions {
        border-top: 1px solid #eef3f8;
        padding: 10px 14px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      #${REPORT_MODAL_ID} .cl93-report-close-x {
        width: 36px;
        height: 36px;
        border: 1px solid #d3d8dd;
        border-radius: 0;
        background: #f7f9fb;
        color: #3493df;
        font-size: 24px;
        font-weight: 500;
        line-height: 1;
        padding: 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      #${REPORT_MODAL_ID} .cl93-report-close-x:hover {
        background: #f1f5f9;
      }
      #${REPORT_MODAL_ID} .cl93-report-close-x:active {
        background: #eaf0f6;
      }
      #${REPORT_MODAL_ID} .sbk-modal-action-btn {
        min-width: 120px;
        height: 40px;
        border: 1px solid #d3d8dd;
        border-radius: 0;
        background: #f7f9fb;
        color: #3493df;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.04em;
        line-height: 1;
        padding: 0 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      #${REPORT_MODAL_ID} .sbk-modal-action-btn:hover {
        background: #f1f5f9;
      }
      #${REPORT_MODAL_ID} .sbk-modal-action-btn:active {
        background: #eaf0f6;
      }
      #${REPORT_MODAL_ID} .sbk-modal-action-btn[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      #${REPORT_MODAL_ID} .sbk-modal-action-btn.is-copied {
        border-color: #0d8b66;
        color: #0d8b66;
        font-weight: 700;
      }
      @media (max-width: 760px) {
        #${REPORT_MODAL_ID} .cl93-report-controls {
          grid-template-columns: 1fr;
        }
      }
      #${WRAP_ID} .cl93-list {
        display: grid;
        gap: 0;
      }
      #${WRAP_ID} .cl93-row {
        background: #fff;
        border: 1px solid #d8e3ef;
        padding: 16px;
      }
      #${WRAP_ID} .cl93-row + .cl93-row {
        border-top: 3px solid #3468a8;
      }
      #${WRAP_ID} .cl93-row-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      #${WRAP_ID} .cl93-branch {
        font-size: 12px;
        color: #5f7182;
        font-weight: 700;
      }
      #${WRAP_ID} .cl93-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      #${WRAP_ID} .cl93-item label {
        display: block;
        font-size: 11px;
        color: #617486;
        margin-bottom: 4px;
      }
      #${WRAP_ID} .cl93-item input,
      #${WRAP_ID} .cl93-item select,
      #${WRAP_ID} .cl93-item textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ccd8e4;
        border-radius: 7px;
        padding: 8px 10px;
        font-size: 13px;
        font-family: inherit;
      }
      #${WRAP_ID} input[data-k="answer_associate_input"] {
        width: 100%;
        max-width: 100%;
      }
      #${WRAP_ID} .cl93-answer-row {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) auto;
        align-items: center;
        gap: 8px;
      }
      #${WRAP_ID} .cl93-answer-row .cl93-user-wrap {
        min-width: 0;
      }
      #${WRAP_ID} .cl93-item textarea {
        min-height: 300px;
        resize: vertical;
      }
      #${WRAP_ID} .cl93-btn-ai.is-loading {
        opacity: 0.85;
      }
      #${WRAP_ID} .cl93-btn-ai.is-loading::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 6px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: cl93-spin 0.7s linear infinite;
        vertical-align: -1px;
      }
      #${WRAP_ID} .cl93-ai-status {
        grid-column: 1 / -1;
        font-size: 11px;
        color: #5f7182;
        min-height: 16px;
      }
      #${WRAP_ID} .cl93-ai-status[data-state="error"] {
        color: #bb2f2f;
      }
      #${WRAP_ID} .cl93-ai-status[data-state="ok"] {
        color: #0d8b66;
      }
      #${WRAP_ID} .cl93-user-wrap { position: relative; }
      #${WRAP_ID} .cl93-user-menu {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% + 4px);
        z-index: 40;
        border: 1px solid #ccd8e4;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 6px 20px rgba(10, 20, 30, 0.14);
        max-height: 220px;
        overflow: auto;
        display: none;
      }
      #${WRAP_ID} .cl93-user-item {
        padding: 8px 10px;
        font-size: 12px;
        color: #223;
        cursor: pointer;
      }
      #${WRAP_ID} .cl93-user-item:hover { background: #f2f7ff; }
      #${WRAP_ID} .cl93-user-empty {
        padding: 8px 10px;
        font-size: 12px;
        color: #7a8794;
      }
      #${WRAP_ID} .cl93-full { grid-column: 1 / -1; }
      #${WRAP_ID} .cl93-empty {
        border: 1px dashed #c6d8eb;
        border-radius: 10px;
        padding: 14px;
        color: #5f7182;
        font-size: 12px;
        background: #fcfdff;
      }
      #${WRAP_ID} .cl93-divider {
        grid-column: 1 / -1;
        border: none;
        border-top: 1px solid #d8e3ef;
        margin: 4px 0;
      }
      #${WRAP_ID} .cl93-ro-list {
        display: grid;
        gap: 0;
      }
      #${WRAP_ID} .cl93-ro-card {
        background: #fff;
        border: 1px solid #d8e3ef;
        padding: 16px;
      }
      #${WRAP_ID} .cl93-ro-card + .cl93-ro-card {
        border-top: 3px solid #3468a8;
      }
      #${WRAP_ID} .cl93-ro-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px 12px;
      }
      #${WRAP_ID} .cl93-ro-item dt {
        margin: 0 0 2px;
        font-size: 11px;
        color: #6a7b8b;
      }
      #${WRAP_ID} .cl93-ro-item dd {
        margin: 0;
        font-size: 13px;
        color: #1f2e3b;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      #${WRAP_ID} .cl93-ro-full {
        grid-column: 1 / -1;
      }
      #${WRAP_ID} .cl93-ro-wide {
        grid-column: span 2;
      }
      #${WRAP_ID} .cl93-ro-no-break dd {
        white-space: nowrap;
        overflow-wrap: normal;
        word-break: keep-all;
      }
      @media (max-width: 900px) {
        #${WRAP_ID} .cl93-grid, #${WRAP_ID} .cl93-ro-grid { grid-template-columns: 1fr; }
      }
      #${LEARNING_BUTTON_ID} {
        min-width: 163px !important;
        height: 44px !important;
        border: 1px solid #d3d8dd !important;
        border-radius: 0 !important;
        background: #f7f9fb !important;
        color: #3493df !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        letter-spacing: 0.04em !important;
        line-height: 1 !important;
        padding: 0 16px !important;
        box-sizing: border-box !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }
      #${LEARNING_BUTTON_ID}:hover { background: #f1f5f9 !important; }
      #${LEARNING_BUTTON_ID}:active { background: #eaf0f6 !important; }
      #${LEARNING_BUTTON_ID}[disabled] { opacity: 0.6 !important; cursor: not-allowed !important; }
      #${LEARNING_MODAL_ID} {
        position: fixed;
        inset: 0;
        background: rgba(15, 25, 40, 0.35);
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 16px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-dialog {
        width: min(960px, calc(100vw - 32px));
        max-height: calc(100vh - 32px);
        background: #fff;
        border-radius: 12px;
        border: 1px solid #dbe5f0;
        box-shadow: 0 18px 44px rgba(15, 25, 40, 0.2);
        display: grid;
        grid-template-rows: auto auto auto auto 1fr auto;
        overflow: hidden;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 14px;
        border-bottom: 1px solid #e7eef6;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-title {
        font-size: 14px;
        font-weight: 700;
        color: #1f2e3b;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-controls {
        display: grid;
        grid-template-columns: minmax(220px, 360px) auto;
        gap: 8px;
        align-items: end;
        padding: 12px 14px;
        border-bottom: 1px solid #eef3f8;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-controls label {
        display: block;
        font-size: 11px;
        color: #607080;
        margin-bottom: 4px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-controls select {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ccd8e4;
        border-radius: 7px;
        padding: 8px 10px;
        font-size: 13px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-tabs {
        display: flex;
        border-bottom: 2px solid #e7eef6;
        padding: 0 14px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-tab {
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 500;
        color: #607080;
        cursor: pointer;
        border: none;
        background: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-tab.is-active {
        color: #1768cc;
        border-bottom-color: #1768cc;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-status {
        min-height: 18px;
        padding: 8px 14px 0;
        font-size: 12px;
        color: #5f7182;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-status[data-state="error"] { color: #bb2f2f; }
      #${LEARNING_MODAL_ID} .cl93-learn-status[data-state="ok"] { color: #0d8b66; }
      #${LEARNING_MODAL_ID} .cl93-learn-body {
        padding: 10px 14px 14px;
        overflow: auto;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-panel { display: none; }
      #${LEARNING_MODAL_ID} .cl93-learn-panel.is-active { display: block; }
      #${LEARNING_MODAL_ID} .cl93-learn-text {
        width: 100%;
        box-sizing: border-box;
        min-height: 320px;
        border: 1px solid #ccd8e4;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 13px;
        line-height: 1.7;
        font-family: "Hiragino Sans", "Yu Gothic", sans-serif;
        resize: vertical;
        white-space: pre-wrap;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
        background: #fafcff;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-card-title {
        font-size: 13px;
        font-weight: 700;
        color: #1f2e3b;
        margin-bottom: 6px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-card-meta {
        font-size: 11px;
        color: #607080;
        margin-bottom: 4px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-card-body {
        font-size: 12px;
        color: #34485a;
        line-height: 1.6;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-priority-high { border-left: 3px solid #e53e3e; }
      #${LEARNING_MODAL_ID} .cl93-learn-priority-medium { border-left: 3px solid #dd6b20; }
      #${LEARNING_MODAL_ID} .cl93-learn-priority-low { border-left: 3px solid #38a169; }
      #${LEARNING_MODAL_ID} .cl93-learn-actions {
        border-top: 1px solid #eef3f8;
        padding: 10px 14px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-close-x {
        width: 36px;
        height: 36px;
        border: 1px solid #d3d8dd;
        border-radius: 0;
        background: #f7f9fb;
        color: #3493df;
        font-size: 24px;
        font-weight: 500;
        line-height: 1;
        padding: 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      #${LEARNING_MODAL_ID} .cl93-learn-close-x:hover { background: #f1f5f9; }
      #${LEARNING_MODAL_ID} .sbk-modal-action-btn {
        min-width: 120px;
        height: 40px;
        border: 1px solid #d3d8dd;
        border-radius: 0;
        background: #f7f9fb;
        color: #3493df;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.04em;
        line-height: 1;
        padding: 0 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      #${LEARNING_MODAL_ID} .sbk-modal-action-btn:hover { background: #f1f5f9; }
      #${LEARNING_MODAL_ID} .sbk-modal-action-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
      #${LEARNING_MODAL_ID} .sbk-modal-action-btn.is-copied {
        border-color: #0d8b66;
        color: #0d8b66;
        font-weight: 700;
      }
      @media (max-width: 760px) {
        #${LEARNING_MODAL_ID} .cl93-learn-controls { grid-template-columns: 1fr; }
      }
      @keyframes cl93-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  };

  const getWrapper = () => document.getElementById(WRAP_ID);

  const renderRow = (row, idx) => {
    const branch = idx + 1;
    return `
      <section class="cl93-row" data-row>
        <div class="cl93-row-top">
          <div class="cl93-branch">枝番 ${branch}</div>
          <button type="button" class="cl93-btn-sub" data-action="remove">削除</button>
        </div>
        <div class="cl93-grid">
          <div class="cl93-item">
            <label>問い合わせ日付</label>
            <input type="date" data-k="question_date" value="${text(row.question_date || '')}" />
          </div>
          <div class="cl93-item cl93-full">
            <label>問い合わせ内容</label>
            <textarea data-k="question_detail">${text(row.question_detail || '')}</textarea>
          </div>
          <hr class="cl93-divider" />
          <div class="cl93-item">
            <label>回答日付</label>
            <input type="date" data-k="answer_date" value="${text(row.answer_date || '')}" />
          </div>
          <div class="cl93-item">
            <div class="cl93-answer-row">
              <button type="button" class="cl93-btn-ai" data-action="draft-answer">AI回答案</button>
              <div class="cl93-ai-status" data-k="ai_status" aria-live="polite"></div>
            </div>
          </div>
          <div class="cl93-item cl93-full">
            <label>回答内容</label>
            <textarea data-k="answer_detail">${text(row.answer_detail || '')}</textarea>
          </div>
        </div>
      </section>
    `;
  };

  const renderRows = (rows) => {
    const wrap = getWrapper();
    if (!wrap) return;
    const list = wrap.querySelector('.cl93-list');
    if (!list) return;
    if (!rows.length) {
      list.innerHTML = '<div class="cl93-empty">明細がありません。右上の「+ 明細を追加」で追加してください。</div>';
      return;
    }
    list.innerHTML = rows.map((r, i) => renderRow(r, i)).join('');
  };

  const collectRows = () => {
    const wrap = getWrapper();
    if (!wrap) return [];
    const sections = Array.from(wrap.querySelectorAll('[data-row]'));
    return sections.map((sec) => ({
      question_date: text(sec.querySelector('[data-k="question_date"]')?.value).trim(),
      question_detail: text(sec.querySelector('[data-k="question_detail"]')?.value).trim(),
      answer_date: text(sec.querySelector('[data-k="answer_date"]')?.value).trim(),
      answer_detail: text(sec.querySelector('[data-k="answer_detail"]')?.value).trim(),
    }));
  };

  const parseAssociateCodes = (code) => {
    const c = text(code).trim();
    return c ? [{ code: c }] : [];
  };

  const validateRows = (rows) => {
    for (let i = 0; i < rows.length; i += 1) {
      const r = rows[i];
      if (!r.question_date) {
        throw new Error(`明細${i + 1}: 問い合わせ日付を入力してください。`);
      }
      if (!r.question_detail) {
        throw new Error(`明細${i + 1}: 問い合わせ内容を入力してください。`);
      }
    }
  };

  const fetchDetailRows = async (questionId) => {
    if (!questionId) return [];
    const query = `${QUESTION_ID} = "${esc(questionId)}" order by ${BRANCH_NUMBER} asc limit 500`;
    const fields = [QUESTION_DATE, QUESTION_DETAIL, ANSWER_DATE, ANSWER_DETAIL, BRANCH_NUMBER];
    const res = await fetchRecords(DETAIL_APP_ID, query, fields);
    const records = res.records || [];
    return records.map((rec) => ({
      question_date: text(rec?.[QUESTION_DATE]?.value),
      question_detail: decodeHtmlEntities(text(rec?.[QUESTION_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
      answer_date: text(rec?.[ANSWER_DATE]?.value),
      answer_detail: decodeHtmlEntities(text(rec?.[ANSWER_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
    }));
  };

  const fetchDetailIds = async (questionId) => {
    if (!questionId) return [];
    const ids = [];
    const limit = 500;
    for (let offset = 0; offset <= 5000; offset += limit) {
      const res = await fetchRecords(
        DETAIL_APP_ID,
        `${QUESTION_ID} = "${esc(questionId)}" order by $id asc limit ${limit} offset ${offset}`,
        ['$id']
      );
      const list = res.records || [];
      ids.push(...list.map((r) => Number(r.$id.value)));
      if (list.length < limit) break;
    }
    return ids;
  };

  const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const replaceDetails = async (questionId, rows) => {
    const ids = await fetchDetailIds(questionId);
    for (const group of chunk(ids, 100)) {
      await kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
        app: DETAIL_APP_ID,
        ids: group,
      });
    }

    if (!rows.length) return;

    const records = rows.map((r, idx) => ({
      [QUESTION_ID]: { value: questionId },
      [BRANCH_NUMBER]: { value: String(idx + 1) },
      [QUESTION_DATE]: { value: r.question_date },
      [QUESTION_DETAIL]: { value: r.question_detail || '' },
      [ANSWER_DATE]: { value: r.answer_date || '' },
      [ANSWER_DETAIL]: { value: r.answer_detail || '' },
    }));

    for (const group of chunk(records, 100)) {
      await kintone.api(kintone.api.url('/k/v1/records', true), 'POST', {
        app: DETAIL_APP_ID,
        records: group,
      });
    }
  };

  const splitKeywords = (s) =>
    text(s)
      .toLowerCase()
      .split(/[ 　\n\r\t、。,.!！?？:：;；()（）\[\]【】「」"']/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 2)
      .slice(0, 20);

  const scoreByKeywords = (question, target) => {
    const keys = splitKeywords(question);
    if (!keys.length) return 0;
    const t = text(target).toLowerCase();
    let score = 0;
    keys.forEach((k) => {
      if (t.includes(k)) score += 1;
    });
    return score;
  };

  const fetchAnswerCandidates = async (questionText, service) => {
    let records = [];

    const svc = text(service).trim();
    if (svc) {
      const head = await fetchRecords(
        APP_ID,
        `${SERVICE} = "${esc(svc)}" and ${QUESTION_ID} != "" order by 更新日時 desc limit 200`,
        [QUESTION_ID]
      );
      const ids = [...new Set((head.records || []).map((r) => text(r?.[QUESTION_ID]?.value).trim()).filter(Boolean))];
      const groups = chunk(ids, 30);
      for (const group of groups) {
        const inClause = group.map((id) => `"${esc(id)}"`).join(', ');
        const q = `${QUESTION_ID} in (${inClause}) order by 更新日時 desc limit 200`;
        const res = await fetchRecords(DETAIL_APP_ID, q, [QUESTION_DETAIL, ANSWER_DETAIL, QUESTION_ID]);
        records.push(...(res.records || []));
        if (records.length >= 400) break;
      }
    }

    if (!records.length) {
      const res = await fetchRecords(
        DETAIL_APP_ID,
        'order by 更新日時 desc limit 200',
        [QUESTION_DETAIL, ANSWER_DETAIL]
      );
      records = res.records || [];
    }

    const candidates = records
      .map((r) => ({
        question: decodeHtmlEntities(text(r?.[QUESTION_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
        answer: decodeHtmlEntities(text(r?.[ANSWER_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
      }))
      .filter((x) => x.question && x.answer)
      .map((x) => ({
        ...x,
        score: scoreByKeywords(questionText, x.question),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ question, answer }) => ({ question, answer }));
    return candidates;
  };

  const requestAiText = async ({ question, candidates, template, emptyErrorMessage, failErrorMessage }) => {
    const headers = { 'Content-Type': 'application/json' };
    if (TITLE_SUMMARY_PROXY_TOKEN) headers['x-proxy-token'] = TITLE_SUMMARY_PROXY_TOKEN;
    const body = JSON.stringify({
      question,
      candidates,
      template,
    });
    const [resBody, status] = await kintone.proxy(ANSWER_DRAFT_ENDPOINT, 'POST', headers, body);
    if (Number(status) < 200 || Number(status) >= 300) {
      throw new Error(failErrorMessage || 'AI呼び出しに失敗しました。');
    }
    const parsed = typeof resBody === 'string' ? JSON.parse(resBody) : resBody;
    const out = text(parsed && parsed.answer).trim();
    if (!out) throw new Error(emptyErrorMessage || 'AI生成結果が空でした。');
    return out;
  };

  const requestDraftAnswer = async ({ question, candidates }) => {
    return requestAiText({
      question,
      candidates,
      template: ANSWER_TEMPLATE,
      emptyErrorMessage: '回答案が生成されませんでした。',
      failErrorMessage: '回答案生成APIの呼び出しに失敗しました。',
    });
  };

  const uniqueList = (items) => [...new Set((items || []).filter(Boolean))];

  const STOP_WORDS = new Set([
    'です',
    'ます',
    'ため',
    'こと',
    'こちら',
    'について',
    'お願い',
    '確認',
    '利用',
    '表示',
    '設定',
    '対応',
    '画面',
    'ソトバコ',
    'ポータル',
    'kintone',
  ]);

  const calcTopKeywords = (questions) => {
    const counter = new Map();
    (questions || []).forEach((q) => {
      const words = uniqueList(splitKeywords(q).filter((w) => !STOP_WORDS.has(w)));
      words.forEach((w) => counter.set(w, (counter.get(w) || 0) + 1));
    });
    return [...counter.entries()]
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  };

  const fetchServiceOptions = async () => {
    const records = await fetchAllRecordsByQuery(APP_ID, 'order by 更新日時 desc', [SERVICE], 20000);
    return uniqueList(records.map((r) => text(r?.[SERVICE]?.value).trim()).filter(Boolean)).sort((a, b) =>
      a.localeCompare(b, 'ja')
    );
  };

  const fetchInquiryDatasetByService = async (service) => {
    const svc = text(service).trim();
    if (!svc) return { parents: [], details: [] };

    const parents = await fetchAllRecordsByQuery(
      APP_ID,
      `${SERVICE} = "${esc(svc)}" order by 更新日時 desc`,
      [QUESTION_ID, TITLE, QUESTION_DATE, STATUS]
    );
    const questionIds = uniqueList(parents.map((r) => text(r?.[QUESTION_ID]?.value).trim()));
    if (!questionIds.length) return { parents, details: [] };

    const details = [];
    const groups = chunk(questionIds, 30);
    for (const group of groups) {
      const inClause = group.map((id) => `"${esc(id)}"`).join(', ');
      const rows = await fetchAllRecordsByQuery(
        DETAIL_APP_ID,
        `${QUESTION_ID} in (${inClause}) order by 更新日時 desc`,
        [QUESTION_ID, QUESTION_DATE, STATUS, QUESTION_DETAIL, ANSWER_DETAIL],
        10000
      );
      details.push(...rows);
    }
    return { parents, details };
  };

  const summarizeDataset = ({ parents, details }) => {
    const normalized = (details || [])
      .map((r) => ({
        questionId: text(r?.[QUESTION_ID]?.value).trim(),
        question: decodeHtmlEntities(text(r?.[QUESTION_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
        answer: decodeHtmlEntities(text(r?.[ANSWER_DETAIL]?.value).replace(/<[^>]*>/g, ' ')).trim(),
      }))
      .filter((r) => r.question);

    const answered = normalized.filter((r) => r.answer).length;
    const unanswered = normalized.length - answered;
    const topKeywords = calcTopKeywords(normalized.map((r) => r.question));
    const samples = normalized.slice(0, 20).map((r) => ({
      question: r.question,
      answer: r.answer || '（未回答）',
    }));

    return {
      stats: {
        parentCount: (parents || []).length,
        detailCount: normalized.length,
        answeredCount: answered,
        unansweredCount: unanswered,
      },
      topKeywords,
      samples,
    };
  };

  const requestInquiryReport = async ({ service, summary }) => {
    const stats = summary.stats || {};
    const topics = summary.topKeywords || [];
    const samples = summary.samples || [];
    const question = [
      `対象サービス: ${service}`,
      `件数: 問い合わせ管理=${stats.parentCount || 0}件 / 問い合わせ明細=${stats.detailCount || 0}件 / 回答済み=${stats.answeredCount || 0}件 / 未回答=${stats.unansweredCount || 0}件`,
      `多いキーワード: ${topics.length ? topics.map((t) => `${t.word}(${t.count})`).join(', ') : '該当なし'}`,
      `代表問い合わせ（抜粋）:\n${samples
        .slice(0, 8)
        .map((s, i) => `${i + 1}. 質問: ${s.question}\n   回答: ${s.answer}`)
        .join('\n') || 'なし'}`,
    ].join('\n\n');

    const report = await requestAiText({
      question,
      candidates: samples.slice(0, 8),
      template: REPORT_TEMPLATE,
      emptyErrorMessage: 'レポートが生成されませんでした。',
      failErrorMessage: 'レポート生成APIの呼び出しに失敗しました。',
    });
    return formatInquiryReportText(report);
  };

  const deleteDetailsByQuestionId = async (questionId) => {
    const qid = text(questionId).trim();
    if (!qid) return;
    const ids = await fetchDetailIds(qid);
    for (const group of chunk(ids, 100)) {
      await kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
        app: DETAIL_APP_ID,
        ids: group,
      });
    }
  };

  const filterUsers = (keyword) => {
    const q = text(keyword).trim().toLowerCase();
    const users = listUsers();
    if (!q) return users.slice(0, 60);
    return users
      .filter((u) => u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q))
      .slice(0, 60);
  };

  const closeMenus = () => {
    const wrap = getWrapper();
    if (!wrap) return;
    wrap.querySelectorAll('[data-k="answer_associate_menu"]').forEach((menu) => {
      menu.style.display = 'none';
    });
  };

  const openMenuForInput = (input) => {
    const row = input.closest('[data-row]');
    if (!row) return;
    const menu = row.querySelector('[data-k="answer_associate_menu"]');
    const hidden = row.querySelector('[data-k="answer_associate_code"]');
    if (!menu || !hidden) return;

    const candidates = filterUsers(input.value);
    if (!candidates.length) {
      menu.innerHTML = '<div class="cl93-user-empty">候補がありません</div>';
    } else {
      menu.innerHTML = candidates
        .map(
          (u) =>
            `<div class="cl93-user-item" data-action="pick-user" data-code="${h(u.code)}" data-name="${h(
              u.name
            )}">${h(`${u.name} (${u.code})`)}</div>`
        )
        .join('');
    }
    menu.style.display = 'block';

    const resolved = resolveUserCode(input.value);
    hidden.value = resolved || '';
  };

  const mount = async (event) => {
    if (kintone.app.getId() !== APP_ID) return;

    ensureStyle();
    const root =
      kintone.app.record.getSpaceElement(SPACE_CODE) ||
      kintone.app.record.getHeaderMenuSpaceElement();
    if (!root) return;

    root.innerHTML = `
      <section id="${WRAP_ID}">
        <div class="cl93-head">
          <div>
            <div class="cl93-title">問い合わせ明細（アプリ94）</div>
            <div class="cl93-sub">この画面で編集した内容は、問い合わせ管理の保存時に明細アプリへ保存されます。</div>
          </div>
          <button type="button" class="cl93-btn" data-action="add">+ 明細を追加</button>
        </div>
        <div class="cl93-list"></div>
      </section>
    `;

    let rows = [];
    await loadUsers();
    if (event.type === 'app.record.edit.show') {
      const qid = text(event.record?.[QUESTION_ID]?.value).trim();
      rows = await fetchDetailRows(qid);
      // rows already loaded from fetchDetailRows
    }
    renderRows(rows);

    const wrap = getWrapper();
    if (!wrap) return;

    wrap.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.action === 'add') {
        const current = collectRows();
        current.push({
          question_date: text(kintone.app.record.get().record?.[QUESTION_DATE]?.value),
          question_detail: '',
          answer_date: '',
          answer_detail: '',
        });
        renderRows(current);
      }

      if (target.dataset.action === 'remove') {
        const rowEl = target.closest('[data-row]');
        if (!rowEl) return;
        const ok = window.confirm('この明細行を削除します。よろしいですか？');
        if (!ok) return;
        rowEl.remove();
        const current = collectRows();
        renderRows(current);
      }

      if (target.dataset.action === 'pick-user') {
        const code = text(target.dataset.code).trim();
        const name = text(target.dataset.name).trim();
        const row = target.closest('[data-row]');
        if (!row) return;
        const input = row.querySelector('[data-k="answer_associate_input"]');
        const hidden = row.querySelector('[data-k="answer_associate_code"]');
        const menu = row.querySelector('[data-k="answer_associate_menu"]');
        if (!input || !hidden || !menu) return;
        input.value = `${name} (${code})`;
        hidden.value = code;
        menu.style.display = 'none';
      }

      if (target.dataset.action === 'draft-answer') {
        const row = target.closest('[data-row]');
        if (!row) return;
        const q = row.querySelector('[data-k="question_detail"]');
        const a = row.querySelector('[data-k="answer_detail"]');
        const statusEl = row.querySelector('[data-k="ai_status"]');
        if (!(q instanceof HTMLTextAreaElement) || !(a instanceof HTMLTextAreaElement)) return;

        const setStatus = (message, state = '') => {
          if (!statusEl) return;
          statusEl.textContent = message || '';
          if (state) {
            statusEl.dataset.state = state;
          } else {
            statusEl.removeAttribute('data-state');
          }
        };

        const setLoading = (loading) => {
          if (loading) {
            target.setAttribute('disabled', 'true');
            target.classList.add('is-loading');
            target.textContent = '生成中';
            return;
          }
          target.removeAttribute('disabled');
          target.classList.remove('is-loading');
          target.textContent = 'AI回答案';
        };

        const question = text(q.value).trim();
        if (!question) {
          window.alert('先に「問い合わせ内容」を入力してください。');
          return;
        }
        setLoading(true);
        setStatus('AIが回答案を生成しています...');
        (async () => {
          try {
            const service = text(kintone.app.record.get().record?.[SERVICE]?.value).trim();
            const candidates = await fetchAnswerCandidates(question, service);
            const draft = await requestDraftAnswer({ question, candidates });
            a.value = formatDraftAnswerText(draft);
            setStatus('回答内容に反映しました。', 'ok');
          } catch (err) {
            setStatus('回答案の生成に失敗しました。', 'error');
            window.alert(err && err.message ? err.message : '回答案の生成に失敗しました。');
          } finally {
            setLoading(false);
          }
        })();
      }
    });

    wrap.addEventListener('input', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.dataset.k !== 'answer_associate_input') return;
      openMenuForInput(target);
    });

    wrap.addEventListener('focusout', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLTextAreaElement)) return;
      if (target.dataset.k !== 'question_detail') return;
      const row = target.closest('[data-row]');
      if (!row) return;
      const rows = Array.from(wrap.querySelectorAll('[data-row]'));
      if (rows.indexOf(row) !== 0) return;
      applyTitleSummary(target.value);
    });

    wrap.addEventListener('focusin', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.dataset.k !== 'answer_associate_input') return;
      openMenuForInput(target);
    });

    wrap.addEventListener('paste', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLTextAreaElement)) return;
      const key = target.dataset.k;
      if (key !== 'question_detail' && key !== 'answer_detail') return;
      const pastedHtml = e.clipboardData && e.clipboardData.getData ? e.clipboardData.getData('text/html') : '';
      const pastedText = e.clipboardData && e.clipboardData.getData ? e.clipboardData.getData('text/plain') : '';
      const pasted = pastedHtml ? htmlToStructuredText(pastedHtml) : pastedText;
      if (!pasted) return;
      e.preventDefault();

      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const normalized = normalizePastedMultiline(pasted);
      const current = target.value || '';
      target.value = `${current.slice(0, start)}${normalized}${current.slice(end)}`;
      const pos = start + normalized.length;
      target.setSelectionRange(pos, pos);
    });

    wrap.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.k === 'answer_associate_input') {
        openMenuForInput(target);
        return;
      }
      if (!target.closest('.cl93-user-wrap')) {
        closeMenus();
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const rootEl = getWrapper();
      if (!rootEl) return;
      if (!rootEl.contains(target)) closeMenus();
    });
  };

  const mountReadonlyDetails = async (event) => {
    if (kintone.app.getId() !== APP_ID) return;
    ensureStyle();

    const root =
      kintone.app.record.getSpaceElement(SPACE_CODE) ||
      kintone.app.record.getHeaderMenuSpaceElement();
    if (!root) return;

    const qid = text(event.record?.[QUESTION_ID]?.value).trim();
    const rows = await fetchDetailRows(qid);

    const toSafe = (v) => h(text(v || '-'));
    const toSafeWithLinks = (v) => {
      const s = text(v || '-');
      const re = /https?:\/\/[^\s<>"']+/g;
      let out = '';
      let last = 0;
      let m;
      while ((m = re.exec(s)) !== null) {
        const url = m[0];
        out += h(s.slice(last, m.index));
        out += `<a href="${h(url)}" target="_blank" rel="noopener noreferrer">${h(url)}</a>`;
        last = m.index + url.length;
      }
      out += h(s.slice(last));
      return out || '-';
    };
    const cards = rows
      .map((r, i) => {
        const assoc = r.answer_associate_code ? userDisplay(r.answer_associate_code) : '-';
        return `
          <section class="cl93-ro-card">
            <div class="cl93-row-top" style="margin-bottom:8px;">
              <div class="cl93-branch">枝番 ${i + 1}</div>
            </div>
            <dl class="cl93-ro-grid">
              <div class="cl93-ro-item"><dt>問い合わせ日付</dt><dd>${toSafe(r.question_date)}</dd></div>
              <div class="cl93-ro-item cl93-ro-full"><dt>問い合わせ内容</dt><dd>${toSafeWithLinks(r.question_detail)}</dd></div>
              <hr class="cl93-divider" />
              <div class="cl93-ro-item"><dt>回答日付</dt><dd>${toSafe(r.answer_date)}</dd></div>
              <div class="cl93-ro-item cl93-ro-full"><dt>回答内容</dt><dd>${toSafeWithLinks(r.answer_detail)}</dd></div>
            </dl>
          </section>
        `;
      })
      .join('');

    root.innerHTML = `
      <section id="${WRAP_ID}">
        <div class="cl93-head">
          <div>
            <div class="cl93-title">問い合わせ明細（アプリ94）</div>
            <div class="cl93-sub">詳細画面は読み取り専用です</div>
          </div>
        </div>
        <div class="cl93-ro-list">
          ${cards || '<div class="cl93-empty">問い合わせ明細はありません。</div>'}
        </div>
      </section>
    `;
  };

  const mountClientAddButton = () => {
    const buttonId = 'cl93-client-add-near-search';
    const old = document.getElementById(buttonId);
    if (old) old.remove();

    const btn = document.createElement('button');
    btn.id = buttonId;
    btn.type = 'button';
    btn.className = 'cl93-client-btn-link';
    btn.textContent = '新規追加';
    btn.onclick = async () => {
      const seed = text(kintone.app.record.get().record?.[CLIENT_NAME]?.value).trim();
      const name = window.prompt('顧客管理へ登録するクライアント名を入力してください。', seed);
      if (name == null) return;

      btn.disabled = true;
      try {
        const created = await createClientQuick(name);
        const state = kintone.app.record.get();
        if (state && state.record) {
          if (state.record[CLIENT_NO]) state.record[CLIENT_NO].value = created.clientNo;
          if (state.record[CLIENT_NAME]) state.record[CLIENT_NAME].value = created.clientName;
          if (state.record.client_search) {
            state.record.client_search.value = `【${created.clientNo}】${created.clientName}`;
          }
          kintone.app.record.set(state);
        }
        window.alert(`顧客管理へ登録しました: ${created.clientNo} / ${created.clientName}`);
      } catch (err) {
        window.alert(err && err.message ? err.message : '顧客管理への新規登録に失敗しました。');
      } finally {
        btn.disabled = false;
      }
    };
    // Prefer placing next to field label; fallback to field container/header space.
    const fieldEl = kintone.app.record.getFieldElement('client_search');
    const reqMark = document.querySelector('.control-label-gaia.label-13312626 .require-cybozu');
    const exactLabel = document.querySelector('.control-label-gaia.label-13312626');
    const labelByText = Array.from(document.querySelectorAll('label, .control-label-gaia, .gaia-argoui-app-edit-layout-formname'))
      .find((el) => text(el.textContent).includes('クライアント検索'));

    if (reqMark && reqMark.parentElement) {
      reqMark.insertAdjacentElement('afterend', btn);
      return true;
    }

    if (exactLabel && exactLabel.parentElement) {
      exactLabel.insertAdjacentElement('afterend', btn);
      return true;
    }

    if (labelByText && labelByText.parentElement) {
      labelByText.insertAdjacentElement('afterend', btn);
      return true;
    }

    if (fieldEl) {
      const row =
        fieldEl.closest('.row-gaia') ||
        fieldEl.closest('.control-gaia') ||
        fieldEl.closest('.gaia-argoui-app-edit-layout-row') ||
        fieldEl.parentElement;
      const labelEl =
        row &&
        (row.querySelector('label') ||
          row.querySelector('.control-label-gaia') ||
          row.querySelector('.gaia-argoui-app-edit-layout-formname'));
      if (labelEl && labelEl.parentElement) {
        labelEl.parentElement.appendChild(btn);
        return true;
      }
      if (fieldEl.parentElement) {
        fieldEl.parentElement.appendChild(btn);
        return true;
      }
      fieldEl.appendChild(btn);
      return true;
    }

    const header = kintone.app.record.getHeaderMenuSpaceElement();
    if (header) {
      header.appendChild(btn);
      return true;
    }
    return false;
  };

  const mountClientAddButtonWithRetry = () => {
    let tries = 0;
    const tick = () => {
      tries += 1;
      const ok = mountClientAddButton();
      if (!ok && tries < 20) {
        window.setTimeout(tick, 250);
      }
    };
    tick();
  };

  const closeReportModal = () => {
    const modal = document.getElementById(REPORT_MODAL_ID);
    if (modal) modal.remove();
  };

  const openReportModal = async () => {
    ensureStyle();
    closeReportModal();

    const modal = document.createElement('div');
    modal.id = REPORT_MODAL_ID;
    modal.innerHTML = `
      <div class="cl93-report-dialog" role="dialog" aria-modal="true" aria-label="お問い合わせレポート作成">
        <div class="cl93-report-head">
          <div class="cl93-report-title">お問い合わせ傾向レポート作成</div>
          <button type="button" class="cl93-report-close-x" data-action="close" aria-label="閉じる">×</button>
        </div>
        <div class="cl93-report-controls">
          <div>
            <label>対象サービス</label>
            <select data-k="service"></select>
          </div>
          <button type="button" class="kintoneplugin-button-normal sbk-modal-action-btn" data-action="run">レポート作成</button>
        </div>
        <div class="cl93-report-status" data-k="status"></div>
        <div class="cl93-report-body">
          <textarea class="cl93-report-text" data-k="output" placeholder="ここにレポートが表示されます。" readonly></textarea>
        </div>
        <div class="cl93-report-actions">
          <button type="button" class="kintoneplugin-button-normal sbk-modal-action-btn" data-action="copy">コピー</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const statusEl = modal.querySelector('[data-k="status"]');
    const serviceEl = modal.querySelector('[data-k="service"]');
    const outputEl = modal.querySelector('[data-k="output"]');
    const runBtn = modal.querySelector('[data-action="run"]');
    let copyResetTimer = 0;

    const setStatus = (msg, state = '') => {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      if (state) statusEl.dataset.state = state;
      else statusEl.removeAttribute('data-state');
    };
    const setBusy = (busy) => {
      if (!(runBtn instanceof HTMLButtonElement)) return;
      runBtn.disabled = !!busy;
      runBtn.textContent = busy ? '作成中...' : 'レポート作成';
    };
    const setServices = (services) => {
      if (!(serviceEl instanceof HTMLSelectElement)) return;
      const items = services || [];
      serviceEl.innerHTML = `
        <option value="">選択してください</option>
        ${items.map((s) => `<option value="${h(s)}">${h(s)}</option>`).join('')}
      `;
    };
    const markCopied = (btn, ok) => {
      if (!(btn instanceof HTMLButtonElement)) return;
      if (copyResetTimer) window.clearTimeout(copyResetTimer);
      const normal = 'コピー';
      if (ok) {
        btn.textContent = 'コピーしました';
        btn.classList.add('is-copied');
      } else {
        btn.textContent = 'コピー失敗';
        btn.classList.remove('is-copied');
      }
      copyResetTimer = window.setTimeout(() => {
        btn.textContent = normal;
        btn.classList.remove('is-copied');
      }, 1800);
    };

    setStatus('サービス一覧を読み込み中...');
    try {
      const services = await fetchServiceOptions();
      setServices(services);
      if (!services.length) setStatus('対象サービスが見つかりませんでした。', 'error');
      else setStatus('対象サービスを選択してください。');
    } catch (err) {
      setServices([]);
      setStatus(err && err.message ? err.message : 'サービス一覧の取得に失敗しました。', 'error');
    }

    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.action === 'close') {
        closeReportModal();
        return;
      }
      if (target.dataset.action === 'copy') {
        const value = outputEl instanceof HTMLTextAreaElement ? text(outputEl.value).trim() : '';
        if (!value) {
          window.alert('先にレポートを作成してください。');
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(value)
            .then(() => {
              setStatus('レポートをコピーしました。', 'ok');
              markCopied(target, true);
            })
            .catch(() => {
              setStatus('コピーに失敗しました。', 'error');
              markCopied(target, false);
            });
        } else if (outputEl instanceof HTMLTextAreaElement) {
          outputEl.focus();
          outputEl.select();
          try {
            document.execCommand('copy');
            setStatus('レポートをコピーしました。', 'ok');
            markCopied(target, true);
          } catch (_e) {
            setStatus('コピーに失敗しました。', 'error');
            markCopied(target, false);
          }
        }
        return;
      }
      if (target.dataset.action === 'run') {
        const service = serviceEl instanceof HTMLSelectElement ? text(serviceEl.value).trim() : '';
        if (!service) {
          setStatus('対象サービスを選択してください。', 'error');
          return;
        }
        setBusy(true);
        setStatus('お問い合わせデータを集計しています...');
        if (outputEl instanceof HTMLTextAreaElement) outputEl.value = '';
        (async () => {
          try {
            const dataset = await fetchInquiryDatasetByService(service);
            const summary = summarizeDataset(dataset);
            if (!summary.stats.detailCount) {
              setStatus('該当サービスの問い合わせ明細が見つかりませんでした。', 'error');
              return;
            }
            setStatus('AIでレポートを作成しています...');
            const report = await requestInquiryReport({ service, summary });
            if (outputEl instanceof HTMLTextAreaElement) outputEl.value = report;
            setStatus('レポートを作成しました。', 'ok');
          } catch (err) {
            setStatus(err && err.message ? err.message : 'レポート作成に失敗しました。', 'error');
          } finally {
            setBusy(false);
          }
        })();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReportModal();
    });
  };

  const mountReportButton = () => {
    ensureStyle();
    const header = kintone.app.getHeaderMenuSpaceElement() || kintone.app.getHeaderSpaceElement();
    if (!header) return false;

    const old = document.getElementById(REPORT_BUTTON_ID);
    if (old) old.remove();

    const btn = document.createElement('button');
    btn.id = REPORT_BUTTON_ID;
    btn.type = 'button';
    btn.className = 'kintoneplugin-button-normal sbk-header-action-btn';
    btn.textContent = 'レポート作成';
    btn.onclick = () => {
      openReportModal().catch((err) => {
        window.alert(err && err.message ? err.message : 'レポート作成モーダルの表示に失敗しました。');
      });
    };
    header.appendChild(btn);
    return true;
  };

  const mountReportButtonWithRetry = () => {
    let tries = 0;
    const tick = () => {
      tries += 1;
      const ok = mountReportButton();
      if (!ok && tries < 20) window.setTimeout(tick, 250);
    };
    tick();
  };

  const requestLearningInsights = async ({ service, summary }) => {
    const stats = summary.stats || {};
    const topics = summary.topKeywords || [];
    const samples = summary.samples || [];

    const inquiries = samples.slice(0, 30).map((s) => ({
      question: s.question,
      answer: s.answer,
    }));

    const headers = { 'Content-Type': 'application/json' };
    if (TITLE_SUMMARY_PROXY_TOKEN) headers['x-proxy-token'] = TITLE_SUMMARY_PROXY_TOKEN;

    const body = JSON.stringify({
      service,
      inquiries,
      stats,
      keywords: topics,
    });

    const [resBody, status] = await kintone.proxy(LEARNING_ENDPOINT, 'POST', headers, body);
    if (Number(status) < 200 || Number(status) >= 300) {
      throw new Error('学習分析APIの呼び出しに失敗しました。');
    }
    const parsed = typeof resBody === 'string' ? JSON.parse(resBody) : resBody;
    return {
      blogTopics: Array.isArray(parsed.blogTopics) ? parsed.blogTopics : [],
      guideImprovements: Array.isArray(parsed.guideImprovements) ? parsed.guideImprovements : [],
      answerPatterns: Array.isArray(parsed.answerPatterns) ? parsed.answerPatterns : [],
    };
  };

  const formatLearningTabText = (insights, tabKey) => {
    if (tabKey === 'blog') {
      return (insights.blogTopics || [])
        .map((t, i) => [
          `${i + 1}. ${t.title || '(タイトルなし)'}`,
          `   優先度: ${t.priority || '-'}`,
          `   想定キーワード: ${t.targetKeyword || '-'}`,
          `   理由: ${t.reason || '-'}`,
        ].join('\n'))
        .join('\n\n') || '提案がありません。';
    }
    if (tabKey === 'guide') {
      return (insights.guideImprovements || [])
        .map((g, i) => [
          `${i + 1}. ${g.page || '(ページ不明)'}`,
          `   課題: ${g.issue || '-'}`,
          `   改善提案: ${g.suggestion || '-'}`,
        ].join('\n'))
        .join('\n\n') || '提案がありません。';
    }
    if (tabKey === 'pattern') {
      return (insights.answerPatterns || [])
        .map((p, i) => [
          `${i + 1}. ${p.pattern || '(パターン名なし)'}`,
          `   頻度: ${p.frequency || '-'}`,
          `   改善ヒント: ${p.improvementHint || '-'}`,
        ].join('\n'))
        .join('\n\n') || '提案がありません。';
    }
    return '';
  };

  const renderBlogCards = (topics) => {
    if (!topics || !topics.length) return '<div class="cl93-empty">提案がありません。</div>';
    const priorityClass = (p) => {
      if (p === 'high') return 'cl93-learn-priority-high';
      if (p === 'medium') return 'cl93-learn-priority-medium';
      return 'cl93-learn-priority-low';
    };
    return topics.map((t) => `
      <div class="cl93-learn-card ${priorityClass(t.priority)}">
        <div class="cl93-learn-card-title">${h(t.title || '(タイトルなし)')}</div>
        <div class="cl93-learn-card-meta">優先度: ${h(t.priority || '-')} ｜ キーワード: ${h(t.targetKeyword || '-')}</div>
        <div class="cl93-learn-card-body">${h(t.reason || '')}</div>
      </div>
    `).join('');
  };

  const renderGuideCards = (improvements) => {
    if (!improvements || !improvements.length) return '<div class="cl93-empty">提案がありません。</div>';
    return improvements.map((g) => `
      <div class="cl93-learn-card">
        <div class="cl93-learn-card-title">${h(g.page || '(ページ不明)')}</div>
        <div class="cl93-learn-card-meta">課題: ${h(g.issue || '-')}</div>
        <div class="cl93-learn-card-body">${h(g.suggestion || '')}</div>
      </div>
    `).join('');
  };

  const renderPatternCards = (patterns) => {
    if (!patterns || !patterns.length) return '<div class="cl93-empty">提案がありません。</div>';
    return patterns.map((p) => `
      <div class="cl93-learn-card">
        <div class="cl93-learn-card-title">${h(p.pattern || '(パターン名なし)')}</div>
        <div class="cl93-learn-card-meta">頻度: ${h(p.frequency || '-')}</div>
        <div class="cl93-learn-card-body">${h(p.improvementHint || '')}</div>
      </div>
    `).join('');
  };

  const closeLearningModal = () => {
    const modal = document.getElementById(LEARNING_MODAL_ID);
    if (modal) modal.remove();
  };

  const openLearningModal = async () => {
    ensureStyle();
    closeLearningModal();

    const modal = document.createElement('div');
    modal.id = LEARNING_MODAL_ID;
    modal.innerHTML = `
      <div class="cl93-learn-dialog" role="dialog" aria-modal="true" aria-label="学習分析">
        <div class="cl93-learn-head">
          <div class="cl93-learn-title">お問い合わせ学習分析</div>
          <button type="button" class="cl93-learn-close-x" data-action="close" aria-label="閉じる">×</button>
        </div>
        <div class="cl93-learn-controls">
          <div>
            <label>対象サービス</label>
            <select data-k="service"></select>
          </div>
          <button type="button" class="kintoneplugin-button-normal sbk-modal-action-btn" data-action="run">分析実行</button>
        </div>
        <div class="cl93-learn-tabs">
          <button type="button" class="cl93-learn-tab is-active" data-tab="blog">ブログ記事案</button>
          <button type="button" class="cl93-learn-tab" data-tab="guide">ガイド改善案</button>
          <button type="button" class="cl93-learn-tab" data-tab="pattern">回答パターン</button>
        </div>
        <div class="cl93-learn-status" data-k="status"></div>
        <div class="cl93-learn-body">
          <div class="cl93-learn-panel is-active" data-panel="blog">
            <div data-k="blog-cards"></div>
            <textarea class="cl93-learn-text" data-k="blog-text" placeholder="ブログ記事案がここに表示されます。" readonly></textarea>
          </div>
          <div class="cl93-learn-panel" data-panel="guide">
            <div data-k="guide-cards"></div>
            <textarea class="cl93-learn-text" data-k="guide-text" placeholder="ガイド改善案がここに表示されます。" readonly></textarea>
          </div>
          <div class="cl93-learn-panel" data-panel="pattern">
            <div data-k="pattern-cards"></div>
            <textarea class="cl93-learn-text" data-k="pattern-text" placeholder="回答パターンがここに表示されます。" readonly></textarea>
          </div>
        </div>
        <div class="cl93-learn-actions">
          <button type="button" class="kintoneplugin-button-normal sbk-modal-action-btn" data-action="copy">コピー</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const statusEl = modal.querySelector('[data-k="status"]');
    const serviceEl = modal.querySelector('[data-k="service"]');
    const runBtn = modal.querySelector('[data-action="run"]');
    let currentTab = 'blog';
    let currentInsights = null;
    let copyResetTimer = 0;

    const setStatus = (msg, state = '') => {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      if (state) statusEl.dataset.state = state;
      else statusEl.removeAttribute('data-state');
    };
    const setBusy = (busy) => {
      if (!(runBtn instanceof HTMLButtonElement)) return;
      runBtn.disabled = !!busy;
      runBtn.textContent = busy ? '分析中...' : '分析実行';
    };
    const setServices = (services) => {
      if (!(serviceEl instanceof HTMLSelectElement)) return;
      serviceEl.innerHTML = `
        <option value="">選択してください</option>
        ${(services || []).map((s) => `<option value="${h(s)}">${h(s)}</option>`).join('')}
      `;
    };
    const switchTab = (tab) => {
      currentTab = tab;
      modal.querySelectorAll('.cl93-learn-tab').forEach((t) => {
        t.classList.toggle('is-active', t.dataset.tab === tab);
      });
      modal.querySelectorAll('.cl93-learn-panel').forEach((p) => {
        p.classList.toggle('is-active', p.dataset.panel === tab);
      });
    };
    const renderInsights = (insights) => {
      currentInsights = insights;
      const blogCards = modal.querySelector('[data-k="blog-cards"]');
      const guideCards = modal.querySelector('[data-k="guide-cards"]');
      const patternCards = modal.querySelector('[data-k="pattern-cards"]');
      const blogText = modal.querySelector('[data-k="blog-text"]');
      const guideText = modal.querySelector('[data-k="guide-text"]');
      const patternText = modal.querySelector('[data-k="pattern-text"]');

      if (blogCards) blogCards.innerHTML = renderBlogCards(insights.blogTopics);
      if (guideCards) guideCards.innerHTML = renderGuideCards(insights.guideImprovements);
      if (patternCards) patternCards.innerHTML = renderPatternCards(insights.answerPatterns);
      if (blogText instanceof HTMLTextAreaElement) blogText.value = formatLearningTabText(insights, 'blog');
      if (guideText instanceof HTMLTextAreaElement) guideText.value = formatLearningTabText(insights, 'guide');
      if (patternText instanceof HTMLTextAreaElement) patternText.value = formatLearningTabText(insights, 'pattern');
    };
    const markCopied = (btn, ok) => {
      if (!(btn instanceof HTMLButtonElement)) return;
      if (copyResetTimer) window.clearTimeout(copyResetTimer);
      if (ok) {
        btn.textContent = 'コピーしました';
        btn.classList.add('is-copied');
      } else {
        btn.textContent = 'コピー失敗';
        btn.classList.remove('is-copied');
      }
      copyResetTimer = window.setTimeout(() => {
        btn.textContent = 'コピー';
        btn.classList.remove('is-copied');
      }, 1800);
    };

    setStatus('サービス一覧を読み込み中...');
    try {
      const services = await fetchServiceOptions();
      setServices(services);
      if (!services.length) setStatus('対象サービスが見つかりませんでした。', 'error');
      else setStatus('対象サービスを選択して「分析実行」をクリックしてください。');
    } catch (err) {
      setServices([]);
      setStatus(err && err.message ? err.message : 'サービス一覧の取得に失敗しました。', 'error');
    }

    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.action === 'close') {
        closeLearningModal();
        return;
      }

      if (target.dataset.tab) {
        switchTab(target.dataset.tab);
        return;
      }

      if (target.dataset.action === 'copy') {
        if (!currentInsights) {
          window.alert('先に分析を実行してください。');
          return;
        }
        const value = formatLearningTabText(currentInsights, currentTab);
        if (!value) {
          window.alert('コピーする内容がありません。');
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(value)
            .then(() => {
              setStatus('コピーしました。', 'ok');
              markCopied(target, true);
            })
            .catch(() => {
              setStatus('コピーに失敗しました。', 'error');
              markCopied(target, false);
            });
        }
        return;
      }

      if (target.dataset.action === 'run') {
        const service = serviceEl instanceof HTMLSelectElement ? text(serviceEl.value).trim() : '';
        if (!service) {
          setStatus('対象サービスを選択してください。', 'error');
          return;
        }
        setBusy(true);
        setStatus('お問い合わせデータを集計しています...');
        (async () => {
          try {
            const dataset = await fetchInquiryDatasetByService(service);
            const summary = summarizeDataset(dataset);
            if (!summary.stats.detailCount) {
              setStatus('該当サービスの問い合わせ明細が見つかりませんでした。', 'error');
              return;
            }
            setStatus('AIが学習分析を実行しています...');
            const insights = await requestLearningInsights({ service, summary });
            renderInsights(insights);
            setStatus('分析が完了しました。', 'ok');
          } catch (err) {
            setStatus(err && err.message ? err.message : '学習分析に失敗しました。', 'error');
          } finally {
            setBusy(false);
          }
        })();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLearningModal();
    });
  };

  const mountLearningButton = () => {
    ensureStyle();
    const header = kintone.app.getHeaderMenuSpaceElement() || kintone.app.getHeaderSpaceElement();
    if (!header) return false;

    const old = document.getElementById(LEARNING_BUTTON_ID);
    if (old) old.remove();

    const btn = document.createElement('button');
    btn.id = LEARNING_BUTTON_ID;
    btn.type = 'button';
    btn.className = 'kintoneplugin-button-normal sbk-header-action-btn';
    btn.textContent = '学習分析';
    btn.onclick = () => {
      openLearningModal().catch((err) => {
        window.alert(err && err.message ? err.message : '学習分析モーダルの表示に失敗しました。');
      });
    };
    header.appendChild(btn);
    return true;
  };

  const mountLearningButtonWithRetry = () => {
    let tries = 0;
    const tick = () => {
      tries += 1;
      const ok = mountLearningButton();
      if (!ok && tries < 20) window.setTimeout(tick, 250);
    };
    tick();
  };

  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show', 'app.record.index.edit.show', 'app.record.detail.show'],
    (event) => {
    if (kintone.app.getId() !== APP_ID) return event;
    if (event.record && event.record[QUESTION_ID]) {
      event.record[QUESTION_ID].disabled = true;
    }
    if (event.type === 'app.record.detail.show') {
      mountReadonlyDetails(event).catch((err) => {
        console.error('[app93-contact-list] detail mount failed', err);
      });
      return event;
    }

    if (event.type !== 'app.record.index.edit.show') {
      mount(event).catch((err) => {
        console.error('[app93-contact-list] mount failed', err);
      });
      mountClientAddButtonWithRetry();
    }
    return event;
  });

  kintone.events.on('app.record.index.show', (event) => {
    if (kintone.app.getId() !== APP_ID) return event;
    closeReportModal();
    closeLearningModal();
    mountReportButtonWithRetry();
    mountLearningButtonWithRetry();
    return event;
  });

  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], async (event) => {
    if (kintone.app.getId() !== APP_ID) return event;
    if (!event.record || !event.record[QUESTION_ID]) return event;

    try {
      const isCreate = event.type === 'app.record.create.submit';
      const nextQuestionId = await ensureQuestionId({
        record: event.record,
        isCreate,
        recordId: event.recordId || null,
      });
      event.record[QUESTION_ID].value = nextQuestionId;

      const rows = collectRows();
      validateRows(rows);
      await replaceDetails(nextQuestionId, rows);

      return event;
    } catch (err) {
      event.error = err && err.message ? err.message : '問い合わせ管理の保存処理に失敗しました。';
      return event;
    }
  });

  kintone.events.on(['app.record.detail.delete.submit', 'app.record.index.delete.submit'], async (event) => {
    if (kintone.app.getId() !== APP_ID) return event;
    try {
      const qid = text(event?.record?.[QUESTION_ID]?.value).trim();
      await deleteDetailsByQuestionId(qid);
      return event;
    } catch (err) {
      event.error =
        err && err.message
          ? `関連する問い合わせ明細の削除に失敗しました: ${err.message}`
          : '関連する問い合わせ明細の削除に失敗しました。';
      return event;
    }
  });
})();
