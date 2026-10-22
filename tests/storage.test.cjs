const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Run the actual TypeScript storage service against an isolated browser store.
function setup() {
  const data = new Map();
  const localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
  const context = vm.createContext({ localStorage, console });
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });
    const execute = new vm.Script(
      `(function(require, module, exports) {${outputText}\n})`,
      { filename: file },
    ).runInContext(context);
    execute(
      (name) => load(path.resolve(path.dirname(file), name + ".ts")),
      module,
      module.exports,
    );
    return module.exports;
  }
  return {
    load,
    localStorage,
    service: load(path.resolve(__dirname, "../src/services/storageService.ts"))
      .StorageService,
  };
}

test("initialization and reset preserve unrelated browser data", () => {
  const { localStorage, service } = setup();
  localStorage.setItem("another-app", "keep me");
  service.init();
  assert.equal(localStorage.getItem("another-app"), "keep me");
  assert.ok(service.getNotices().length > 0);
  service.resetToDefaults();
  assert.equal(localStorage.getItem("another-app"), "keep me");
});

test("logout stays logged out after application initialization", () => {
  const { service } = setup();
  service.init();
  assert.ok(service.getCurrentUserId());
  service.clearCurrentUser();
  service.init();
  assert.equal(service.getCurrentUserId(), null);
  const user = service.getUsers()[0];
  service.setCurrentUserId(user.id);
  assert.equal(service.getCurrentUserId(), user.id);
});

test("initialization preserves saved content and bookmarks", () => {
  const { service } = setup();
  service.init();
  const notice = {
    ...service.getNotices()[0],
    id: "test-notice",
    title: "Saved notice",
  };
  service.saveNotice(notice);
  service.toggleBookmark({
    id: "test-bookmark",
    userId: "test-user",
    itemId: notice.id,
    itemType: "NOTICE",
  });
  service.init();
  assert.equal(
    service.getNotices().find((item) => item.id === notice.id).title,
    "Saved notice",
  );
  assert.equal(service.isBookmarked("test-user", notice.id), true);
});

test("registration is idempotent when the final seat is taken", () => {
  const { service } = setup();
  service.init();
  const event = {
    ...service.getEvents()[0],
    id: "future-event",
    status: "APPROVED",
    date: "2099-12-31",
    registrationDeadline: "2099-12-30",
    availableSeats: 1,
    registeredUserIds: [],
  };
  service.saveEvent(event);
  const user = service.getUsers()[0];
  const first = service.registerForEvent(event, user);
  assert.ok(first);
  assert.equal(service.registerForEvent(event, user).id, first.id);
  assert.equal(
    service.getEvents().find((e) => e.id === event.id).availableSeats,
    0,
  );
});

test("past, expired and unapproved events reject registration", () => {
  const { service } = setup();
  service.init();
  const base = {
    ...service.getEvents()[0],
    id: "closed-event",
    status: "APPROVED",
    date: "2099-12-31",
    registrationDeadline: "2099-12-30",
    availableSeats: 10,
    registeredUserIds: [],
  };
  for (const patch of [
    { date: "2000-01-01" },
    { registrationDeadline: "2000-01-01" },
    { status: "PENDING_APPROVAL" },
  ]) {
    const event = { ...base, ...patch };
    service.saveEvent(event);
    assert.equal(service.registerForEvent(event, service.getUsers()[0]), null);
  }
});

test("Sunday has no substituted Monday class and unknown departments stay empty", () => {
  const { load } = setup();
  const { calculateCurrentAndNextClass } = load(
    path.resolve(__dirname, "../src/data/timetableData.ts"),
  );
  const sunday = calculateCurrentAndNextClass(
    "CCET",
    new Date(2026, 9, 25, 10, 0),
  );
  assert.equal(sunday.currentClass, null);
  assert.equal(sunday.todayClasses.length, 0);
  assert.ok(sunday.nextClassDayOffset > 0);
  const missing = calculateCurrentAndNextClass(
    "UNKNOWN",
    new Date(2026, 9, 26, 10, 0),
  );
  assert.equal(missing.nextClass, null);
  assert.equal(missing.todayClasses.length, 0);
});

test("campus guide uses only approved scoped data and does not invent exams", () => {
  const { load } = setup();
  const { answerCampusQuery } = load(
    path.resolve(__dirname, "../src/services/campusGuide.ts"),
  );
  const data = {
    user: { departmentCode: "CCET", semester: 1 },
    notices: [
      {
        title: "Visible",
        status: "APPROVED",
        departmentCode: "CCET",
        publishedAt: "2026-10-01",
      },
      { title: "Private draft", status: "DRAFT", departmentCode: "CCET" },
      { title: "Other department", status: "APPROVED", departmentCode: "CFT" },
    ],
    events: [],
    exams: [],
    career: [],
    facilities: [],
  };
  assert.equal(answerCampusQuery("notices", data).text, "Visible");
  assert.match(answerCampusQuery("exams", data).text, /No upcoming exams/);
  assert.match(
    answerCampusQuery("events", data).text,
    /No upcoming approved events/,
  );
});
