;(function() {
var vwoUtils_utils_storage = {}, shared_crossStore_crossStoreStorageInterface = {}, shared_crossStore_crossStoreInject = {};
vwoUtils_utils_storage = function (exports) {
  exports.__esModule = true;
  exports.StorageService = void 0;
  var ssStoreName = '_vis_opt_ss', lsStoreName = '_vis_opt_ls';
  var Storage = function (isLocalStorage) {
    this._getWebStore = function () {
      try {
        var storage = localStorage, storeName = lsStoreName, data;
        if (!isLocalStorage) {
          storage = sessionStorage;
          storeName = ssStoreName;
        }
        storeName = storeName + this.uniqueId;
        data = storage.getItem(storeName);
        if (data) {
          return JSON.parse(data);
        }
        return null;
      } catch (err) {
        return null;
      }
    };
    this._setWebStore = function (data) {
      try {
        var storage = localStorage, storeName = lsStoreName;
        if (!isLocalStorage) {
          storage = sessionStorage;
          storeName = ssStoreName;
        }
        storeName = storeName + this.uniqueId;
        storage.setItem(storeName, JSON.stringify(data));
      } catch (err) {
        return null;
      }
    };
    this.set = function (name, value) {
      var store = this._getWebStore();
      store = store || {};
      store[name] = value;
      this._setWebStore(store);
    };
    this.remove = function (name) {
      var store = this._getWebStore();
      store = store || {};
      delete store[name];
      this._setWebStore(store);
    };
    this.removeAll = function () {
      if (isLocalStorage) {
        localStorage.clear();
      }
    };
    this.get = function (name) {
      var store = this._getWebStore();
      if (store) {
        return store[name] || null;
      }
      return null;
    };
    this.init = function (uniqueId) {
      this.uniqueId = uniqueId || '';
    };
  };
  exports.StorageService = {
    ls: new Storage(true),
    ss: new Storage()
  };
  return exports;
}(vwoUtils_utils_storage);
shared_crossStore_crossStoreStorageInterface = function (exports, storage_1) {
  exports.__esModule = true;
  exports.crossStoreStorageInterface = void 0;
  var localStoreLS = storage_1.StorageService.ls;
  var storageInterfaceInitiated = false;
  function postBack(data) {
    return data;
  }
  function init(config) {
    if (storageInterfaceInitiated) {
      return;
    }
    localStoreLS.init(config.uniqueId);
    storageInterfaceInitiated = true;
  }
  function get(data) {
    var values = [];
    if (data.key && data.key.constructor === Array) {
      for (var i = 0; i < data.key.length; i++) {
        values.push(localStoreLS.get(data.key[i]));
      }
      data.value = values;
    } else {
      data.value = localStoreLS.get(data.key);
    }
    return postBack(data);
  }
  function set(data) {
    localStoreLS.set(data.key, data.value);
    return postBack(data);
  }
  function remove(data) {
    localStoreLS.remove(data.key);
    return postBack(data);
  }
  function removeAll(data) {
    localStoreLS.removeAll();
    return postBack(data);
  }
  exports.crossStoreStorageInterface = {
    takeAction: function (data) {
      if (data && data.action) {
        switch (data.action) {
        case 'get':
          return get(data);
        case 'set':
          return set(data);
        case 'remove':
          return remove(data);
        case 'removeAll':
          return removeAll(data);
        default: {
            break;
          }
        }
      }
    },
    init: init
  };
  return exports;
}(shared_crossStore_crossStoreStorageInterface, vwoUtils_utils_storage);
shared_crossStore_crossStoreInject = function (exports, crossStoreStorageInterface_1) {
  exports.__esModule = true;
  function getUrlVars(url) {
    var vars = {};
    var hash, i;
    if (-1 !== url.indexOf('#')) {
      url = url.slice(0, url.indexOf('#'));
    }
    var hashes = url.slice(url.indexOf('?') + 1).split('&').reverse();
    i = hashes.length;
    while (i--) {
      hash = hashes[i].split('=');
      if ('undefined' === typeof vars[hash[0]]) {
        vars[hash[0]] = hash[1];
      } else {
        vars[hash[0]] = vars[hash[0]] + '&' + hash[0] + '=' + hash[1];
      }
    }
    return vars;
  }
  function onReady() {
    window.parent.postMessage({
      id: 'isWorkerReady',
      namespace: 'VWO_CROSS_STORE'
    }, '*');
  }
  function onMessage(params) {
    var data = params.data;
    if (data && data.length && Object.prototype.toString.call(data) === '[object Array]') {
      for (var i = 0; i < data.length; i++) {
        onMessage({ data: data[i] });
      }
    }
    window.parent.postMessage(crossStoreStorageInterface_1.crossStoreStorageInterface.takeAction(params.data) || {}, '*');
  }
  function init() {
    var urlVars = getUrlVars(window.location.href);
    var uniqueId = urlVars && urlVars.a;
    crossStoreStorageInterface_1.crossStoreStorageInterface.init({ uniqueId: uniqueId });
    window.addEventListener('message', onMessage);
    onReady();
  }
  init();
  return exports;
}(shared_crossStore_crossStoreInject, shared_crossStore_crossStoreStorageInterface);
}());