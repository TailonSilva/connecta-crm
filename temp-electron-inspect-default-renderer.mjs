import modulo from 'electron/renderer';
console.log(typeof modulo, Object.keys(modulo).slice(0, 30));
console.log(Boolean(modulo.contextBridge));
process.exit(0);
