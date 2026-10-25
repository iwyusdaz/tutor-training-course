/* Spot-the-move practice engine.
 *
 * Accessibility contract (verified by evaluation/keyboard-tests.mjs):
 * - One item at a time; answers are radio inputs inside fieldset/legend.
 * - "Check answer" validates BOTH questions and reports missing answers
 *   via role="alert". Feedback renders in a role="status" region and its
 *   heading receives focus (tabindex="-1").
 * - "Next" / "See summary" advance; the item heading receives focus.
 * - Results are text; nothing is stored, sent, or persisted anywhere.
 */
(function () {
  "use strict";

  var root = document.getElementById("spot-the-move");
  if (!root) return;

  var DATA = null;
  var state = { index: 0, checked: false, results: {} };

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function load() {
    return fetch("items.json").then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function renderItem() {
    var item = DATA.items[state.index];
    state.checked = false;
    root.innerHTML = "";

    root.appendChild(el("h2", { id: "item-heading", tabindex: "-1", text: "Exchange " + (state.index + 1) + " of " + DATA.items.length }));
    root.appendChild(el("p", { class: "tool-status", text: "Source: " + item.source }));

    var section = el("section", { "aria-labelledby": "item-heading" });
    var exchange = el("blockquote");
    item.exchange.forEach(function (line) {
      exchange.appendChild(el("p", { text: line }));
    });
    section.appendChild(exchange);

    var form = el("form", { novalidate: true });

    var fsMove = el("fieldset");
    fsMove.appendChild(el("legend", { text: "Which move is the tutor using (or which failure mode replaced it)?" }));
    var optsMove = el("div", { class: "tool-options" });
    item.options.forEach(function (opt, i) {
      var id = item.id + "-move-" + i;
      var label = el("label", { for: id });
      var radio = el("input", { type: "radio", name: "move-" + item.id, id: id, value: String(i) });
      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + opt.text));
      optsMove.appendChild(label);
    });
    fsMove.appendChild(optsMove);
    form.appendChild(fsMove);

    var fsEff = el("fieldset");
    fsEff.appendChild(el("legend", { text: "Did the move work for the student?" }));
    var optsEff = el("div", { class: "tool-options" });
    [["yes", "Effective \u2014 the student kept thinking or produced the work"],
     ["partly", "Partly \u2014 mixed effect"],
     ["no", "No \u2014 the student's thinking stopped or shrank"]].forEach(function (pair, i) {
      var id = item.id + "-eff-" + i;
      var label = el("label", { for: id });
      var radio = el("input", { type: "radio", name: "eff-" + item.id, id: id, value: pair[0] });
      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + pair[1]));
      optsEff.appendChild(label);
    });
    fsEff.appendChild(optsEff);
    form.appendChild(fsEff);

    section.appendChild(form);
    root.appendChild(section);

    var controls = el("div", { class: "tool-controls" });
    if (state.index > 0) {
      var back = el("button", { type: "button", class: "btn", text: "Back" });
      back.addEventListener("click", function () { state.index -= 1; renderItem(); });
      controls.appendChild(back);
    }
    var check = el("button", { type: "button", class: "btn btn-primary", text: "Check answer" });
    check.addEventListener("click", function () { checkAnswer(item); });
    controls.appendChild(check);
    root.appendChild(controls);

    root.appendChild(el("p", { class: "tool-note", text: "Nothing is stored: answers live in this page only and vanish when you close it." }));

    var h = root.querySelector("#item-heading");
    if (h) h.focus();
  }

  function clearAlert() {
    var old = root.querySelector('[role="alert"]');
    if (old) old.remove();
  }

  function checkAnswer(item) {
    if (state.checked) return;
    var moveChoice = root.querySelector('input[name="move-' + item.id + '"]:checked');
    var effChoice = root.querySelector('input[name="eff-' + item.id + '"]:checked');

    clearAlert();
    if (!moveChoice || !effChoice) {
      var missing = !moveChoice && !effChoice ? "a move and whether it worked" : (!moveChoice ? "which move the tutor used" : "whether the move worked");
      var warn = el("p", { role: "alert", class: "tool-alert", text: "Choose " + missing + ", then check your answer." });
      root.insertBefore(warn, root.querySelector(".tool-controls"));
      return;
    }

    state.checked = true;
    var opt = item.options[parseInt(moveChoice.value, 10)];
    state.results[item.id] = { moveCorrect: !!opt.correct, eff: effChoice.value === item.effectiveness };

    var effLabel = { yes: "effective", partly: "partly effective", no: "not effective" }[item.effectiveness];
    var feedback = el("div", { class: "tool-feedback", role: "status", "aria-labelledby": "feedback-heading" });
    var headText;
    if (opt.correct && effChoice.value === item.effectiveness) headText = "Both right \u2014 " + effLabel + ", as you said.";
    else if (opt.correct) headText = "Move identified correctly \u2014 effectiveness: " + effLabel + ".";
    else headText = "Not quite \u2014 the move was: " + (item.options.find(function (o) { return o.correct; }) || {}).text + ". Effectiveness: " + effLabel + ".";
    feedback.appendChild(el("h3", { id: "feedback-heading", tabindex: "-1", text: headText }));
    feedback.appendChild(el("p", { text: item.feedback }));
    var more = el("p");
    more.appendChild(document.createTextNode("Read the full transcript: "));
    var a = el("a", { href: item.transcript, text: item.source.split("\u00b7")[0].trim() });
    more.appendChild(a);
    more.appendChild(document.createTextNode("."));
    feedback.appendChild(more);

    var controls = root.querySelector(".tool-controls");
    root.insertBefore(feedback, controls);
    controls.innerHTML = "";

    var isLast = state.index === DATA.items.length - 1;
    var next = el("button", { type: "button", class: "btn btn-primary", text: isLast ? "See your summary" : "Next exchange" });
    next.addEventListener("click", function () {
      if (isLast) renderSummary();
      else { state.index += 1; renderItem(); }
    });
    controls.appendChild(next);
    feedback.querySelector("#feedback-heading").focus();
  }

  function renderSummary() {
    root.innerHTML = "";
    root.appendChild(el("h2", { id: "summary-heading", tabindex: "-1", text: "Your summary" }));

    var movesRight = 0, effRight = 0, total = DATA.items.length;
    DATA.items.forEach(function (it) { if (state.results[it.id]) { if (state.results[it.id].moveCorrect) movesRight++; if (state.results[it.id].eff) effRight++; } });

    var table = el("table");
    var cap = el("caption", { text: "Moves named correctly and effectiveness judged correctly, by item" });
    table.appendChild(cap);
    var thead = el("thead"); var hr = el("tr");
    ["Exchange", "Source", "Move", "Effectiveness"].forEach(function (t) { hr.appendChild(el("th", { scope: "col", text: t })); });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = el("tbody");
    DATA.items.forEach(function (it, i) {
      var row = el("tr");
      row.appendChild(el("td", { text: String(i + 1) }));
      row.appendChild(el("td", { text: it.source }));
      var r = state.results[it.id];
      row.appendChild(el("td", { text: r ? (r.moveCorrect ? "identified" : "missed") : "skipped" }));
      row.appendChild(el("td", { text: r ? (r.eff ? "judged right" : "judged differently") : "skipped" }));
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    root.appendChild(table);

    root.appendChild(el("p", { text: "You named " + movesRight + " of " + total + " moves correctly and judged " + effRight + " of " + total + " effectiveness ratings as the annotations do." }));
    root.appendChild(el("p", { text: "Lower scores are information, not verdicts: re-read the linked transcript for any missed exchange, then the module it trains \u2014 questioning moves live in Module 3, feedback moves in Module 4." }));
    root.appendChild(el("p", { class: "tool-note", text: "Nothing is stored: closing this page forgets everything. Re-running the practice is encouraged \u2014 naming moves gets faster with reps, which is the point." }));

    var controls = el("div", { class: "tool-controls" });
    var again = el("button", { type: "button", class: "btn btn-primary", text: "Start over" });
    again.addEventListener("click", function () { state = { index: 0, checked: false, results: {} }; renderItem(); });
    controls.appendChild(again);
    root.appendChild(controls);

    root.querySelector("#summary-heading").focus();
  }

  load()
    .then(function (data) { DATA = data; renderItem(); })
    .catch(function () {
      root.innerHTML = "";
      root.appendChild(el("p", { class: "tool-status", text: "The practice tool could not load. It needs JavaScript and the items.json file next to this page \u2014 the offline alternative is reading the transcripts and naming the moves against the numbered annotations." }));
    });
})();
