/* Opt-in storage. The database is not created until the person saves. */
(function (root) {
  "use strict";
  var DB = "netmend-rv";
  var STORE = "years";

  function exists() {
    if (!root.indexedDB) return Promise.resolve(false);
    if (root.indexedDB.databases) {
      return root.indexedDB.databases().then(function (list) {
        return (list || []).some(function (item) { return item && item.name === DB; });
      }).catch(function () { return false; });
    }
    return openDb(false).then(function (db) {
      var yes = !!db;
      if (db) db.close();
      return yes;
    });
  }

  function finish(db) {
    if (db && typeof db.close === "function") db.close();
  }

  function openDb(create) {
    return new Promise(function (resolve, reject) {
      if (!root.indexedDB) { reject(new Error("no-idb")); return; }
      var req = root.indexedDB.open(DB, 1);
      var created = false;
      req.onupgradeneeded = function (event) {
        created = true;
        if (!create) {
          event.target.transaction.abort();
          return;
        }
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: "year" });
      };
      req.onsuccess = function () {
        if (created && !create) {
          req.result.close();
          var del = root.indexedDB.deleteDatabase(DB);
          del.onsuccess = function () { resolve(null); };
          del.onerror = function () { resolve(null); };
          return;
        }
        resolve(req.result);
      };
      req.onerror = function () { reject(req.error); };
    });
  }

  function saveYear(record) {
    return openDb(true).then(function (db) {
      return new Promise(function (resolve, reject) {
        var settled = false;
        function settle(ok, value) {
          if (settled) return;
          settled = true;
          finish(db);
          if (ok) resolve(value);
          else reject(value);
        }
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(record);
        tx.oncomplete = function () { settle(true, record); };
        tx.onerror = function () { settle(false, tx.error); };
        tx.onabort = function () { settle(false, tx.error || new Error("abort")); };
      });
    });
  }

  function latest() {
    return exists().then(function (yes) {
      if (!yes) return null;
      return openDb(false).then(function (db) {
        if (!db) return null;
        return new Promise(function (resolve, reject) {
          var settled = false;
          function settle(ok, value) {
            if (settled) return;
            settled = true;
            finish(db);
            if (ok) resolve(value);
            else reject(value);
          }
          var tx = db.transaction(STORE, "readonly");
          var req = tx.objectStore(STORE).getAll();
          req.onsuccess = function () {
            var rows = req.result || [];
            rows.sort(function (a, b) { return a.year - b.year; });
            settle(true, rows.length ? rows[rows.length - 1] : null);
          };
          req.onerror = function () { settle(false, req.error); };
          tx.onabort = function () { settle(false, tx.error || new Error("abort")); };
        });
      });
    });
  }

  function deleteDb() {
    return new Promise(function (resolve) {
      if (!root.indexedDB) { resolve(); return; }
      var req = root.indexedDB.deleteDatabase(DB);
      req.onsuccess = function () { resolve(); };
      req.onerror = function () { resolve(); };
      req.onblocked = function () { resolve(); };
    });
  }

  root.NM_RV_STORE = { saveYear: saveYear, latest: latest, deleteDb: deleteDb, exists: exists };
})(typeof window !== "undefined" ? window : globalThis);
