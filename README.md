npm-add-rm-script
---

<p align="right">
  <a href="https://www.npmjs.com/package/npm-add-rm-script">
    <img alt="Npm version" src="https://badge.fury.io/js/npm-add-rm-script.svg">
  </a>
  <a href="https://travis-ci.org/59naga/npm-add-rm-script">
    <img alt="Build Status" src="https://travis-ci.org/59naga/npm-add-rm-script.svg?branch=master">
  </a>
</p>

CLI: customize your npm-scripts in package.json.

Installation
---
```bash
yarn global add @59naga/npm-add-rm-script
```

Usage
---

## `npms-add name code...`
Add the script-code as `name` in the closest package.json scripts. If already defined, confirm overwriting.

## `npms-rm name`
Delete the specified script `name` in the closest package.json scripts.

License
---
MIT