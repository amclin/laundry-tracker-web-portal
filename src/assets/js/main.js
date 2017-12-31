'use strict';

const applicationServerPublicKey = 'BBUqRw8CqtCgLZ9ve8xPAesZZUdpdWUW775r4RHFPOkeZQj5pyGj1G2EbP3hE4wylQyOCb7wOIhMzRNth3MNchQ';
const pushButton = document.querySelector('.button.notifications');
const config = require('./config');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function removeSubscriptionOnServer(subscriptionId) {
  if(subscriptionId) {
    $.ajax({
      method: 'DELETE',
      url: config.gateway + '/notification/' + encodeURIComponent(subscriptionId),
      headers: {
        "x-api-key": config.apikey
      },
      success: function() {
        console.log('removed subscription from server');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting status:', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
      }
    })
  }

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
  document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionDetails.classList.add('hide');
  }
}

function updateSubscriptionOnServer(subscription) {

  if(subscription) {
    $.ajax({
      method: 'POST',
      url: config.gateway + '/notification',
      headers: {
        "x-api-key": config.apikey
      },
      contentType: 'application/json',
      data: JSON.stringify(subscription),
      success: function() {
        console.log('registered subscription with server');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting status:', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
      }
    });
  }


  // TODO: Remove showing subscription in page
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
  document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('hide');
  } else {
    subscriptionDetails.classList.add('hide');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  var subscriptionId = '';
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      subscriptionId = subscription.endpoint;
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    removeSubscriptionOnServer(subscriptionId);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

// Register service worker for notifications
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('service-worker.js')
    .then(function(swReg) {
      console.log('Service Worker registration successful with scope: ',
      swReg.scope, swReg);

      swRegistration = swReg;

      initializeUI();
    })
    .catch(function(error) {
      console.log('Service Worker registration failed: ', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
