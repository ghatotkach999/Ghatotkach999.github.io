(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- data ---------- */
  const ALL = [];
  UNITS.forEach(u => u.questions.forEach(q => {
    q.unit = u.n; q.unitTitle = u.title; q.id = "u" + u.n + "q" + q.q;
    q.hay = [("unit " + u.n), "q" + q.q, "unit" + u.n + "q" + q.q, u.title, q.title, q.question, q.keywords, q.notes, q.url,
      ...q.files.map(f => f.name + " " + (f.label || "") + " " + f.code), ...q.cmds.map(c => c.label + " " + c.code)].join("\n").toLowerCase();
    ALL.push(q);
  }));
  const BY_ID = Object.fromEntries(ALL.map(q => [q.id, q]));

  /* ---------- state ---------- */
  let favs = store.get("aad.fav", []).filter(id => BY_ID[id]);
  let recent = store.get("aad.recent", []).filter(id => BY_ID[id]).slice(0, 5);
  let unit = "all", query = "", favOnly = false;
  const openSet = new Set();
  const COPY = {}; let copyN = 0;

  /* ---------- syntax highlighting (offline, tiny) ---------- */
  const JSK = "const|let|var|function|return|if|else|async|await|try|catch|finally|new|class|constructor|this|typeof|require";
  const RULES = {
    js: [new RegExp("(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)|\\b(" + JSK + ")\\b|\\b(\\d+)\\b|(\\$\\w+|\\.\\w+(?=\\())", "g"), [0, "c", "s", "k", "n", "m"]],
    html: [new RegExp("(<!--[\\s\\S]*?-->|\\/\\/.*)|(\"[^\"]*\")|(<\\/?[a-zA-Z!][\\w!-]*|>)|(\\bng-[\\w-]+|\\{\\{[\\s\\S]*?\\}\\})|\\b(var|function|return|new)\\b", "g"), [0, "c", "s", "t", "at", "k"]],
    pug: [/(\/\/.*)|("[^"]*")|(^[ \t]*)(doctype|[a-z][\w-]*)/gm, [0, "c", "s", null, "t"]],
    sh: [/(#.*)|("[^"]*")|(^>)|(^\s*)(npm|node|mkdir|cd)\b|(\s--?[\w-]+)/gm, [0, "c", "s", "m", null, "k", "n"]]
  };
  RULES.mongo = [new RegExp(RULES.js[0].source.replace(JSK, JSK + "|use"), "g"), [0, "c", "s", "k", "n", "m"]];
  function highlight(code, lang) {
    const [re, cls] = RULES[lang] || RULES.js;
    re.lastIndex = 0;
    const segs = []; let last = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === "") { re.lastIndex++; continue; }
      if (m.index > last) segs.push([null, code.slice(last, m.index)]);
      let pos = m.index;
      for (let g = 1; g < m.length; g++) if (m[g] !== undefined) { segs.push([cls[g], m[g]]); pos += m[g].length; }
      if (pos < m.index + m[0].length) segs.push([null, code.slice(pos, m.index + m[0].length)]);
      last = m.index + m[0].length;
    }
    if (last < code.length) segs.push([null, code.slice(last)]);
    const lines = [""];
    segs.forEach(([c, t]) => t.split("\n").forEach((part, i) => {
      if (i > 0) lines.push("");
      if (part) lines[lines.length - 1] += c ? '<b class="' + c + '" style="font-weight:400">' + esc(part) + "</b>" : esc(part);
    }));
    return lines;
  }
  const hlCache = {};
  function codeHTML(code, lang) {
    const key = lang + "\u0000" + code;
    return hlCache[key] || (hlCache[key] = highlight(code, lang).map((l, i) => '<div class="ln"><i>' + (i + 1) + "</i><span>" + (l || " ") + "</span></div>").join(""));
  }

  /* ---------- search ---------- */
  function parseQuery(raw) {
    let s = raw.toLowerCase().trim(), u = null, qn = null;
    s = s.replace(/\bunit\s*(\d+)/, (_, d) => { u = +d; return " "; });
    s = s.replace(/\bq\s*(\d+)\b/, (_, d) => { qn = +d; return " "; });
    return { u, qn, terms: s.split(/\s+/).filter(Boolean) };
  }
  function visible() {
    const p = parseQuery(query);
    return ALL.filter(q =>
      (unit === "all" || unit === "fav" || q.unit === unit) &&
      (!(favOnly || unit === "fav") || favs.includes(q.id)) &&
      (p.u === null || q.unit === p.u) && (p.qn === null || q.q === p.qn) &&
      p.terms.every(t => q.hay.includes(t)));
  }
  function mark(text) {
    const terms = parseQuery(query).terms;
    let out = esc(text);
    terms.forEach(t => { const e = esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); out = out.replace(new RegExp("(" + e + ")(?![^<]*>)", "gi"), "<mark>$1</mark>"); });
    return out;
  }

  /* ---------- rendering ---------- */
  function block(name, code, lang, label) {
    const id = "c" + (++copyN); COPY[id] = code;
    return '<div class="blk"><div class="blk-h"><span class="fn">' + (label ? esc(label) + " — " : "") + mark(name) +
      '</span><button class="copy" data-copy="' + id + '">Copy Code</button></div><pre><code>' + codeHTML(code, lang) + "</code></pre></div>";
  }
  function cardHTML(q) {
    const post = q.cmds.filter(c => /^run/i.test(c.label)), pre = q.cmds.filter(c => !/^run/i.test(c.label));
    let h = '<article class="card' + (openSet.has(q.id) ? " open" : "") + '" id="' + q.id + '" data-id="' + q.id + '">' +
      '<div class="card-head" tabindex="0"><span class="tag">Unit ' + q.unit + " · Q" + q.q + "</span><h3>" + mark(q.title) + "</h3>" +
      '<span class="files-mini">' + q.files.filter(f => !f.noFile).map(f => esc(f.name)).filter((v, i, a) => a.indexOf(v) === i).join(", ") + "</span>" +
      '<button class="star' + (favs.includes(q.id) ? " on" : "") + '" aria-label="Toggle favourite">' + (favs.includes(q.id) ? "★" : "☆") + '</button><span class="chev">▸</span></div><div class="card-body">';
    h += '<div class="qtext"><small>Original question</small>' + mark(q.question) + "</div>";
    if (q.tree) h += '<span class="lbl">Project structure</span><div class="tree">' + esc(q.tree) + "</div>";
    if (q.steps) h += '<span class="lbl">Execution sequence</span><ol class="steps">' + q.steps.map(s => "<li>" + esc(s) + "</li>").join("") + "</ol>";
    pre.forEach(c => { h += '<span class="lbl">' + esc(c.label) + "</span>" + block("terminal", c.code, c.lang); });
    if (q.files.length > 1) {
      h += '<div class="tabs">' + q.files.map((f, i) => '<button class="tab' + (i ? "" : " on") + '" data-tab="' + i + '">' + esc(f.label || f.name) + "</button>").join("");
      if (q.project) { const id = "c" + (++copyN); COPY[id] = q.files.map(f => "===== FILE: " + f.name + " =====\n" + f.code).join("\n\n"); h += '<button class="copy all" style="margin-left:auto" data-copy="' + id + '">Copy All Files</button>'; }
      h += "</div>" + q.files.map((f, i) => '<div class="pane' + (i ? "" : " on") + '">' + block(f.name, f.code, f.lang, f.label) + "</div>").join("");
    } else q.files.forEach(f => { h += block(f.name, f.code, f.lang); });
    post.forEach(c => { h += '<span class="lbl">' + esc(c.label) + "</span>" + block("terminal", c.code, c.lang); });
    if (q.url) h += '<div class="meta">Browser: <code>' + esc(q.url) + "</code></div>";
    if (q.notes) h += '<div class="meta">' + esc(q.notes) + "</div>";
    return h + "</div></article>";
  }
  function render() {
    const list = visible();
    let h = "", cur = 0;
    list.forEach(q => { if (q.unit !== cur) { cur = q.unit; h += '<h2 class="unit-h">Unit ' + q.unit + " – " + esc(q.unitTitle) + "</h2>"; } h += cardHTML(q); });
    $("#cards").innerHTML = h;
    $("#empty").hidden = list.length > 0;
    $("#counter").textContent = "Showing " + list.length + " of " + ALL.length + " practicals";
    $("#clearSearch").hidden = !query;
    $("#cnt-fav").textContent = favs.length;
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", String(b.dataset.unit) === String(unit)));
    const rl = recent.map(id => BY_ID[id]);
    $("#recentList").innerHTML = rl.length ? rl.map(q => '<button data-recent="' + q.id + '">Unit ' + q.unit + " Q" + q.q + " – " + esc(q.title) + "</button>").join("") : '<div class="none">Nothing yet</div>';
  }
  function buildNav() {
    $("#cnt-all").textContent = ALL.length;
    $("#unitList").innerHTML = UNITS.map(u => '<button class="nav-item" data-unit="' + u.n + '"><span>Unit ' + u.n + " – " + esc(u.title) + "</span><b>" + u.questions.length + "</b></button>").join("");
  }

  /* ---------- actions ---------- */
  function setOpen(card, on) {
    card.classList.toggle("open", on);
    on ? openSet.add(card.dataset.id) : openSet.delete(card.dataset.id);
    if (on) {
      recent = [card.dataset.id, ...recent.filter(x => x !== card.dataset.id)].slice(0, 5);
      store.set("aad.recent", recent);
      const box = $("#recentList");
      box.innerHTML = recent.map(id => { const q = BY_ID[id]; return '<button data-recent="' + id + '">Unit ' + q.unit + " Q" + q.q + " – " + esc(q.title) + "</button>"; }).join("");
      const code = card.querySelector(".pane.on .blk, .card-body > .blk, .blk");
      setTimeout(() => (code || card).scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    }
  }
  function toast() { const t = $("#toast"); t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800); }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext !== false) return navigator.clipboard.writeText(text).catch(() => fallback(text));
    return Promise.resolve(fallback(text));
  }
  function fallback(text) {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0;top:0";
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    try { document.execCommand("copy"); } finally { ta.remove(); }
  }
  function closeDrawer() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }

  $("#cards").addEventListener("click", e => {
    const cp = e.target.closest(".copy");
    if (cp) {
      copyText(COPY[cp.dataset.copy]).then(() => {
        const old = cp.dataset.label || cp.textContent; cp.dataset.label = old;
        cp.textContent = "Copied!"; cp.classList.add("done"); toast();
        clearTimeout(cp.t); cp.t = setTimeout(() => { cp.textContent = old; cp.classList.remove("done"); }, 1600);
      });
      return;
    }
    const st = e.target.closest(".star");
    if (st) {
      const id = st.closest(".card").dataset.id;
      favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
      store.set("aad.fav", favs);
      if (favOnly || unit === "fav") return render();
      st.classList.toggle("on", favs.includes(id)); st.textContent = favs.includes(id) ? "★" : "☆";
      $("#cnt-fav").textContent = favs.length; return;
    }
    const tb = e.target.closest(".tab");
    if (tb) {
      const card = tb.closest(".card"), i = +tb.dataset.tab;
      card.querySelectorAll(".tab").forEach((t, k) => t.classList.toggle("on", k === i));
      card.querySelectorAll(".pane").forEach((p, k) => p.classList.toggle("on", k === i)); return;
    }
    const hd = e.target.closest(".card-head");
    if (hd) { const c = hd.parentElement; setOpen(c, !c.classList.contains("open")); }
  });
  $("#cards").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card-head")) { e.preventDefault(); e.target.click(); } });

  $("#search").addEventListener("input", e => { query = e.target.value; render(); });
  $("#clearSearch").addEventListener("click", () => { query = ""; $("#search").value = ""; render(); $("#search").focus(); });
  $("#favOnly").addEventListener("change", e => { favOnly = e.target.checked; if (!favOnly && unit === "fav") unit = "all"; render(); });
  document.addEventListener("click", e => {
    const nb = e.target.closest(".nav-item");
    if (nb) {
      const v = nb.dataset.unit; unit = (v === "all" || v === "fav") ? v : +v;
      favOnly = unit === "fav"; $("#favOnly").checked = favOnly; render(); closeDrawer(); window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const rc = e.target.closest("[data-recent]");
    if (rc) {
      unit = "all"; query = ""; favOnly = false; $("#search").value = ""; $("#favOnly").checked = false;
      openSet.add(rc.dataset.recent); render(); closeDrawer();
      const c = document.getElementById(rc.dataset.recent);
      if (c) { setOpen(c, true); c.classList.add("flash"); setTimeout(() => c.classList.remove("flash"), 1500); }
    }
  });
  $("#expandAll").addEventListener("click", () => { document.querySelectorAll(".card").forEach(c => { c.classList.add("open"); openSet.add(c.dataset.id); }); });
  $("#collapseAll").addEventListener("click", () => { document.querySelectorAll(".card").forEach(c => c.classList.remove("open")); openSet.clear(); });
  $("#menuBtn").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); });
  $("#scrim").addEventListener("click", closeDrawer);
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => { $("#toTop").hidden = window.scrollY < 400; }, { passive: true });

  buildNav(); render();
})();
