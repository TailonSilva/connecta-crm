import modulo from 'electron/main';
console.log(typeof modulo, Object.keys(modulo).slice(0, 30));
console.log(Boolean(modulo.app), Boolean(modulo.BrowserWindow));
process.exit(0);
