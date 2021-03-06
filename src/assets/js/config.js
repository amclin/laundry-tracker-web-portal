module.exports = {
  "gateway": "https://c5x6853pnc.execute-api.us-east-2.amazonaws.com/beta",
  "apikey": "1UDYntK3hY8JS1sNcZZKb45YClhVKDLV3vuFdOIs",
  "locationid": "74e7af9e-2c22-4dd0-83c1-ef21963f0248",
  "locationname": "Cambridge House",
  "machines": [
    {
      "id": "d56d76b2-d6e2-4426-b895-265e530f3fd5",
      "name": "Left Washer",
      "type": "washer",
      "images": {
        "on": "assets/img/machines/IMG_3513.JPG",
        "off": "assets/img/machines/IMG_3519.JPG"
      }
    },{
      "id": "c3498095-753f-4fd8-8087-ce4ba54652c4",
      "name": "Center Washer",
      "type": "washer",
      "images": {
        "on": "assets/img/machines/IMG_3512.JPG",
        "off": "assets/img/machines/IMG_3518.JPG"
      }
    },{
      "id": "3adc93b3-35b4-4007-bab1-b8f83b484d1d",
      "name": "Right Washer",
      "type": "washer",
      "images": {
        "on": "assets/img/machines/IMG_3511.JPG",
        "off": "assets/img/machines/IMG_3517.JPG"
      }
    },{
      "id": "a5b22962-41fa-48eb-b4d0-9f3455267a2a",
      "name": "Left Dryer",
      "type": "dryer",
      "images": {
        "on": "assets/img/machines/IMG_3514.JPG",
        "off": "assets/img/machines/IMG_3520.JPG"
      }
    },{
      "id": "dfbd26f1-8f13-4b7a-99bb-f1aaf78ff18b",
      "name": "Center Dryer",
      "type": "dryer",
      "images": {
        "on": "assets/img/machines/IMG_3515.JPG",
        "off": "assets/img/machines/IMG_3521.JPG"
      }
    },{
      "id": "ba898178-3675-440f-aab6-79e48de3c977",
      "name": "Right Dryer",
      "type": "dryer",
      "images": {
        "on": "assets/img/machines/IMG_3516.JPG",
        "off": "assets/img/machines/IMG_3522.JPG"
      }
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
          "assets/img/my-icons-collection/png/001-dryer.png",
          "assets/img/my-icons-collection/png/001-dryer-on.png",
          "assets/img/my-icons-collection/png/001-dryer-off.png",
          "assets/img/my-icons-collection/png/002-washing-machine.png",
          "assets/img/my-icons-collection/png/002-washing-machine-on.png",
          "assets/img/my-icons-collection/png/002-washing-machine-off.png",
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
          on: 'assets/img/my-icons-collection/png/002-washing-machine-on.png',
          off: 'assets/img/my-icons-collection/png/002-washing-machine-off.png'
        },
        dryer: {
          default: 'assets/img/my-icons-collection/png/001-dryer.png',
          on: 'assets/img/my-icons-collection/png/001-dryer-on.png',
          off: 'assets/img/my-icons-collection/png/001-dryer-off.png'
        }
      }
    }
  }
};