npm-add-rm-script
---
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

## `npms-rm name scripts...`
Delete the specified script `name` in the closest package.json scripts.

License
---
MIT