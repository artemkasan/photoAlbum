import * as Workbox from 'workbox-sw';

if (Workbox.default) {
    console.log(`Yay! Workbox is loaded 🎉`);
  } else {
    console.log(`Boo! Workbox didn't load 😬`);
}