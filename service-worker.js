importScripts('./ngsw-worker.js');
importScripts('./CryptoJS.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'post-data') {
    event.waitUntil(getDataAndSend());
  }
});

function addData(data) {
  var contentType = {
    'Content-Type': 'application/json',
  }
  var headers = {
    ...contentType, ...data.apiHeaders
  };

  fetch(data.apiUrl, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(data)
  }
  ).then(() =>
    Promise.resolve()
  ).catch(() =>
    Promise.reject()
  );
}
//constants_1.designerApiHeaders(this.rParams),
function getDataAndSend() {
  let db;
  const request = indexedDB.open('my-db');

  request.onerror = (event) => {

  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db);
  };
};

function getData(db) {
  const transation = db.transaction(['data-store'], "readwrite");
  const objectStore = transation.objectStore('data-store');
  const getall = objectStore.getAll();

  //var getallkey = objectStore.getAllKeys();
  //const request = objectStore.get('wfRecordSubmit');
  getall.onerror = (event) => {

  };
  getall.onsuccess = async(event) => {
    var resultData = getall.result;
    for (var i = resultData.length - 1; i >= 0; i--) {
      await new Promise((resolve) => {
        setTimeout(() => {
          var Normaltext = CryptoJS.AES.decrypt(resultData[i], 'secret key 123');
          var decryptedData = JSON.parse(Normaltext.toString(CryptoJS.enc.Utf8));
          addData(decryptedData);
          resolve();
        }, 3000);
      });
    }
  };
  db.close();
  objectStore.clear();
};


