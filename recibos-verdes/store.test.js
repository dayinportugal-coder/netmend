/* Proves a save/read closes IndexedDB, so deleteDatabase is not blocked
   and a later save in the same page works. */
var assert = require("assert");

function installFakeIndexedDB() {
  var databases = Object.create(null);

  function record(name) {
    if (!databases[name]) databases[name] = { version: 0, stores: Object.create(null), connections: 0 };
    return databases[name];
  }

  function later(fn) {
    process.nextTick(fn);
  }

  function makeDb(rec) {
    var db = {
      _closed: false,
      objectStoreNames: {
        contains: function (store) { return !!rec.stores[store]; }
      },
      createObjectStore: function (store) {
        rec.stores[store] = new Map();
      },
      transaction: function (store) {
        var map = rec.stores[store];
        var tx = { oncomplete: null, onerror: null, onabort: null };
        tx.objectStore = function () {
          return {
            put: function (value) { map.set(value.year, JSON.parse(JSON.stringify(value))); },
            getAll: function () {
              var req = { result: Array.from(map.values()), onsuccess: null, onerror: null };
              later(function () { if (req.onsuccess) req.onsuccess(); });
              return req;
            }
          };
        };
        later(function () { if (!db._closed && tx.oncomplete) tx.oncomplete(); });
        return tx;
      },
      close: function () {
        if (db._closed) return;
        db._closed = true;
        rec.connections = Math.max(0, rec.connections - 1);
      }
    };
    return db;
  }

  globalThis.indexedDB = {
    openCount: function (name) { return record(name).connections; },
    databases: function () {
      return Promise.resolve(Object.keys(databases).filter(function (name) {
        return databases[name].version > 0;
      }).map(function (name) { return { name: name, version: databases[name].version }; }));
    },
    open: function (name, version) {
      var req = { result: null, error: null, onsuccess: null, onerror: null, onupgradeneeded: null };
      req.transaction = { abort: function () { req.error = new Error("abort"); req._aborted = true; } };
      later(function () {
        var rec = record(name);
        if (rec.version < version) {
          req.result = makeDb(rec);
          if (req.onupgradeneeded) req.onupgradeneeded({ target: req });
          if (req._aborted) {
            delete databases[name];
            if (req.onerror) req.onerror();
            return;
          }
          rec.version = version;
        }
        var db = makeDb(rec);
        req.result = db;
        rec.connections += 1;
        if (req.onsuccess) req.onsuccess();
      });
      return req;
    },
    deleteDatabase: function (name) {
      var req = { onsuccess: null, onerror: null, onblocked: null };
      later(function () {
        var rec = databases[name];
        if (rec && rec.connections > 0) {
          if (req.onblocked) req.onblocked();
          return;
        }
        delete databases[name];
        if (req.onsuccess) req.onsuccess();
      });
      return req;
    }
  };
}

installFakeIndexedDB();
require("./store.js");
var store = globalThis.NM_RV_STORE;

store.saveYear({ year: 2026, rows: [{ referencia: "FR/1" }] }).then(function () {
  assert.strictEqual(globalThis.indexedDB.openCount("netmend-rv"), 0);
  return store.latest();
}).then(function (saved) {
  assert.strictEqual(saved.rows[0].referencia, "FR/1");
  assert.strictEqual(globalThis.indexedDB.openCount("netmend-rv"), 0);
  return store.deleteDb();
}).then(function () {
  return store.latest();
}).then(function (gone) {
  assert.strictEqual(gone, null);
  return store.saveYear({ year: 2026, rows: [{ referencia: "FR/2" }] });
}).then(function () {
  return store.latest();
}).then(function (again) {
  assert.strictEqual(again.rows[0].referencia, "FR/2");
  assert.strictEqual(globalThis.indexedDB.openCount("netmend-rv"), 0);
  console.log("store.test.js ok");
}).catch(function (err) {
  console.error(err);
  process.exit(1);
});
