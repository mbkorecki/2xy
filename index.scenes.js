
  var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD != 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != 'renderer';
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'index.scenes.data';
      var REMOTE_PACKAGE_BASE = 'index.scenes.data';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        if (isNode) {
          var contents = require('fs').readFileSync(packageName);
          return new Uint8Array(contents).buffer;
        }
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
Module['FS_createPath']("/", "src", true, true);
Module['FS_createPath']("/src", "res", true, true);
Module['FS_createPath']("/src/res", "scenes", true, true);

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
          }
          Module['removeRunDependency']('datafile_index.scenes.data');
      }
      Module['addRunDependency']('datafile_index.scenes.data');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);

    }
    // Detect whether the module JS file has already been loaded.
    if (Module['FS_createPath']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/src/res/scenes/.DS_Store", "start": 0, "end": 10244}, {"filename": "/src/res/scenes/1.ssf", "start": 10244, "end": 11059}, {"filename": "/src/res/scenes/10.ssf", "start": 11059, "end": 12181}, {"filename": "/src/res/scenes/11.ssf", "start": 12181, "end": 12905}, {"filename": "/src/res/scenes/12.ssf", "start": 12905, "end": 14135}, {"filename": "/src/res/scenes/12a.ssf", "start": 14135, "end": 14638}, {"filename": "/src/res/scenes/12b.ssf", "start": 14638, "end": 15162}, {"filename": "/src/res/scenes/13.ssf", "start": 15162, "end": 15325}, {"filename": "/src/res/scenes/13a.ssf", "start": 15325, "end": 15621}, {"filename": "/src/res/scenes/14.ssf", "start": 15621, "end": 16005}, {"filename": "/src/res/scenes/15.ssf", "start": 16005, "end": 16702}, {"filename": "/src/res/scenes/16.ssf", "start": 16702, "end": 17394}, {"filename": "/src/res/scenes/16a.ssf", "start": 17394, "end": 17658}, {"filename": "/src/res/scenes/17.ssf", "start": 17658, "end": 18081}, {"filename": "/src/res/scenes/18.ssf", "start": 18081, "end": 18640}, {"filename": "/src/res/scenes/18a.ssf", "start": 18640, "end": 19414}, {"filename": "/src/res/scenes/19.ssf", "start": 19414, "end": 20122}, {"filename": "/src/res/scenes/19a.ssf", "start": 20122, "end": 20349}, {"filename": "/src/res/scenes/19b.ssf", "start": 20349, "end": 20545}, {"filename": "/src/res/scenes/1a.ssf", "start": 20545, "end": 21033}, {"filename": "/src/res/scenes/1b.ssf", "start": 21033, "end": 21273}, {"filename": "/src/res/scenes/1c.ssf", "start": 21273, "end": 22114}, {"filename": "/src/res/scenes/1d.ssf", "start": 22114, "end": 22713}, {"filename": "/src/res/scenes/2.ssf", "start": 22713, "end": 23593}, {"filename": "/src/res/scenes/20.ssf", "start": 23593, "end": 24299}, {"filename": "/src/res/scenes/20a.ssf", "start": 24299, "end": 24785}, {"filename": "/src/res/scenes/21.ssf", "start": 24785, "end": 25226}, {"filename": "/src/res/scenes/22.ssf", "start": 25226, "end": 26643}, {"filename": "/src/res/scenes/23.ssf", "start": 26643, "end": 27261}, {"filename": "/src/res/scenes/24.ssf", "start": 27261, "end": 27916}, {"filename": "/src/res/scenes/24a.ssf", "start": 27916, "end": 28184}, {"filename": "/src/res/scenes/25.ssf", "start": 28184, "end": 29138}, {"filename": "/src/res/scenes/26.ssf", "start": 29138, "end": 29731}, {"filename": "/src/res/scenes/27.ssf", "start": 29731, "end": 30532}, {"filename": "/src/res/scenes/27a.ssf", "start": 30532, "end": 30912}, {"filename": "/src/res/scenes/28.ssf", "start": 30912, "end": 31465}, {"filename": "/src/res/scenes/29.ssf", "start": 31465, "end": 31991}, {"filename": "/src/res/scenes/3.ssf", "start": 31991, "end": 33531}, {"filename": "/src/res/scenes/30.ssf", "start": 33531, "end": 33704}, {"filename": "/src/res/scenes/31.ssf", "start": 33704, "end": 33851}, {"filename": "/src/res/scenes/32.ssf", "start": 33851, "end": 33998}, {"filename": "/src/res/scenes/3a.ssf", "start": 33998, "end": 34290}, {"filename": "/src/res/scenes/4.ssf", "start": 34290, "end": 35561}, {"filename": "/src/res/scenes/4a.ssf", "start": 35561, "end": 36158}, {"filename": "/src/res/scenes/5.ssf", "start": 36158, "end": 37286}, {"filename": "/src/res/scenes/6.ssf", "start": 37286, "end": 38297}, {"filename": "/src/res/scenes/7.ssf", "start": 38297, "end": 39413}, {"filename": "/src/res/scenes/8.ssf", "start": 39413, "end": 40164}, {"filename": "/src/res/scenes/9.ssf", "start": 40164, "end": 41221}, {"filename": "/src/res/scenes/9a.ssf", "start": 41221, "end": 41706}, {"filename": "/src/res/scenes/feng_shui.ssf", "start": 41706, "end": 43595}, {"filename": "/src/res/scenes/i_ching.ssf", "start": 43595, "end": 45954}], "remote_package_size": 45954});

  })();
