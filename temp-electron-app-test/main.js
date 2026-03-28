const { app } = require('electron');
console.log('app?', app);
if (app) {
  app.whenReady().then(() => app.quit());
}
