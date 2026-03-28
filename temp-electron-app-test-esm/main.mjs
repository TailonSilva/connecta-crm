import { app } from 'electron';
console.log('app?', app);
if (app) {
  app.whenReady().then(() => app.quit());
}
