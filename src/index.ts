import pkgUp = require('pkg-up');
import { readFileSync, writeFileSync } from 'fs';
import { join as pathJoin } from 'path';
import prompts = require('prompts');

type Options = { cwd?: string; silent?: boolean };
type Result = { path: string; jsonData: string; original: string };
type PackageJson = { scripts?: Record<string, any> };

/*
  utils
*/
async function getData(options: Options): Promise<{ path: string; data: PackageJson }> {
  let data;
  const cwd = options.cwd || process.cwd();
  let path = await pkgUp({ cwd });
  if (path) {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } else {
    path = pathJoin(cwd, 'package.json');
    data = {};
  }

  return { path, data };
}
export async function addScript(
  name: string,
  script: string,
  options: Options = {}
): Promise<Result | undefined> {
  const { path, data } = await getData(options);
  if (!data.scripts) {
    data.scripts = {};
  }

  let original = data.scripts[name] || '';
  if (typeof data.scripts[name] === 'string') {
    if (options.silent) {
      return;
    }

    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: `script ${name} already defined. override?`,
      initial: true
    });
    if (!confirmed) {
      return;
    }

    original = data.scripts[name];
  }
  data.scripts[name] = script;

  const jsonData = JSON.stringify(data, null, 2);
  return { path, jsonData, original };
}
export async function removeScript(
  name: string,
  script: string,
  options: Options = {}
): Promise<Result | undefined> {
  const { path, data } = await getData(options);
  let original = '';
  if (data.scripts && data.scripts[name] && data.scripts[name].length) {
    original = data.scripts[name];
    delete data.scripts[name];
  }

  const jsonData = JSON.stringify(data, null, 2);
  return { path, jsonData, original };
}

/*
  cli
*/
export async function ADD(argv: string[], options: Options = {}): Promise<void> {
  const [name, ...chunks] = argv;
  const script = chunks.join(' ');
  if (!name) {
    console.log(`‼️  Required the name of the script`);
    return;
  }
  if (!script.length) {
    console.log(`‼️  Required the code of the script`);
    return;
  }

  const result = await addScript(name, script, options);
  if (result) {
    const { path, jsonData, original } = result;
    writeFileSync(path, jsonData);

    if (options.silent) {
      return;
    }

    if (original.length) {
      console.log(`🔧  Overrided ${name} script that was originally "${original}"`);
    } else {
      console.log(`➕  Added ${name} script`);
    }
  }
}
export async function REMOVE(argv: string[], options: Options = {}): Promise<void> {
  const [name, ...chunks] = argv;
  const script = chunks.join(' ');
  if (!name) {
    console.log(`‼️  Required the name of the script`);
    return;
  }

  const result = await removeScript(name, script, options);
  if (result) {
    const { path, jsonData, original } = result;
    writeFileSync(path, jsonData);

    if (options.silent) {
      return;
    }

    if (original.length) {
      console.log(`➖  Removed ${name} script that was originally "${original}"`);
    } else {
      console.log(`‼️  Missing ${name} script`);
    }
  }
}
