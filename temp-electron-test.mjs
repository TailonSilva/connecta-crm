import { app, BrowserWindow } from 'electron/main';
console.log('esm', Boolean(app), Boolean(BrowserWindow));
app.quit();
