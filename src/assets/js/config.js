module.exports = {
  "gateway": "https://c5x6853pnc.execute-api.us-east-2.amazonaws.com/beta",
  "apikey": "1UDYntK3hY8JS1sNcZZKb45YClhVKDLV3vuFdOIs",
  "locationid": "74e7af9e-2c22-4dd0-83c1-ef21963f0248",
  "locationname": "Cambridge House",
  "machines": [
    {
      "id": "d56d76b2-d6e2-4426-b895-265e530f3fd5",
      "name": "Left Washer",
      "type": "washer"
    },{
      "id": "c3498095-753f-4fd8-8087-ce4ba54652c4",
      "name": "Center Washer",
      "type": "washer"
    },{
      "id": "3adc93b3-35b4-4007-bab1-b8f83b484d1d",
      "name": "Right Washer",
      "type": "washer"
    },{
      "id": "a5b22962-41fa-48eb-b4d0-9f3455267a2a",
      "name": "Left Dryer",
      "type": "dryer"
    },{
      "id": "dfbd26f1-8f13-4b7a-99bb-f1aaf78ff18b",
      "name": "Center Dryer",
      "type": "dryer"
    },{
      "id": "ba898178-3675-440f-aab6-79e48de3c977",
      "name": "Right Dryer",
      "type": "dryer"
    }
  ],
  "serviceworker": {
    "cache": {
      "staticCacheName": "pages-cache-v3",
      "filesToCache": [
          "/",
          "assets/css/app.css",
          "assets/img/my-icons-collection/svg/001-dryer.svg",
          "assets/img/my-icons-collection/svg/002-washing-machine.svg",
          "assets/js/app.js",
          "assets/js/main.js",
          "assets/templates/machines.html",
          "index.html",
          "404.html",
          "offline.html"
      ],
      "pages": {
        "404": "404.html",
        "offline": "offline.html"
      }
    },
    notifications: {
      title: 'Laundry Watcher',
      messages: {
        on: '%s is in use',
        off: '%s is available',
        default: 'A laundry machine is finished or now in use'
      },
      icons: {
        washer: {
          default: 'assets/img/my-icons-collection/png/002-washing-machine.png',
          inUse: 'assets/img/my-icons-collection/png/002-washing-machine.png',
          available: 'assets/img/my-icons-collection/png/002-washing-machine.png'
        },
        dryer: {
          default: 'assets/img/my-icons-collection/png/001-dryer.png',
          on: 'assets/img/my-icons-collection/png/001-dryer.png',
          off: 'assets/img/my-icons-collection/png/001-dryer.png'
        }
      }
    }
  }
};