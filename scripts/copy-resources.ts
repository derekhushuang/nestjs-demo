import * as shell from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';

const out = path.join(__dirname, '..', 'dist');
createFolderIfNotExist(out);

shell.cp('-R', 'src/config', 'dist');
//shell.cp('-R', 'src/schema', 'dist');
//shell.cp('-R', 'src/staticAsset', 'dist');

function createFolderIfNotExist(outDir: string): void {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
}
