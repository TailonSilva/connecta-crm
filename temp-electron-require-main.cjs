try {
  const modulo = require('electron/main');
  console.log('modulo', modulo);
  console.log('app', modulo.app);
  console.log('BrowserWindow', modulo.BrowserWindow);
} catch (erro) {
  console.error(erro);
}
