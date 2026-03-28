const { spawn } = require('node:child_process');
const path = require('node:path');
const electron = require('electron');

const argumentos = process.argv.slice(2);
const diretorioAplicacao = argumentos.length > 0 ? argumentos : [path.resolve(__dirname, '..')];
const ambiente = { ...process.env };

delete ambiente.ELECTRON_RUN_AS_NODE;

const processoElectron = spawn(electron, diretorioAplicacao, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: ambiente,
  windowsHide: false
});

processoElectron.on('exit', (codigo, sinal) => {
  if (sinal) {
    process.kill(process.pid, sinal);
    return;
  }

  process.exit(codigo ?? 0);
});
