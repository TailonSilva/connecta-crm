import { app } from 'electron/main';
console.log('app?', app);
if (app) {
  app.whenReady().then(() => app.quit());
}
