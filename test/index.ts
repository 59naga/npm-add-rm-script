const { parse } = require("shell-quote");
import assert = require("assert");
import { writeFileSync, readFileSync } from "fs";

import { ADD, REMOVE } from "../src";

const target = `${__dirname}/package.json`;
const options = { cwd: __dirname, silent: true };
beforeEach(() => {
  writeFileSync(target, "{}");
});
it("should be add `test` script to empty json", async () => {
  const command = parse(`test "mocha 'test --watch {test}/*.js'"`);
  await ADD(command, options);
  const actual = JSON.parse(readFileSync(target, "utf8"));

  assert.deepEqual(actual, {
    scripts: {
      test: "mocha 'test --watch {test}/*.js'"
    }
  });
});

it("should not be add invalid script to empty json", async () => {
  await ADD(parse(``), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {});

  await ADD(parse(`foo`), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {});

  await ADD(parse(`foo bar`), options);
  await ADD(parse(`foo baz`), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {
    scripts: { foo: "bar" }
  });
});

it("should be remove if exists script name", async () => {
  await ADD(parse(`foo bar`), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {
    scripts: { foo: "bar" }
  });

  await REMOVE(parse(`bar`), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {
    scripts: { foo: "bar" }
  });

  await REMOVE(parse(`foo`), options);
  assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), {
    scripts: {}
  });
});
