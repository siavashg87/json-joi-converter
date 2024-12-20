# Json Joi

[![Build Status](https://travis-ci.org/rundef/json-joi-converter.svg?branch=master)](https://travis-ci.org/rundef/json-joi-converter)
[![Node version required](https://img.shields.io/node/v/json-joi-converter.svg)](https://www.npmjs.com/package/json-joi-converter)
[![Latest Stable Version](https://img.shields.io/npm/v/json-joi-converter.svg)](https://www.npmjs.com/package/json-joi-converter)

# json-Joi-converter

**json-Joi-converter** is a robust TypeScript module built on top of the popular [Joi](https://www.npmjs.com/package/joi) library. This package seamlessly converts Joi schemas to JSON and back, enabling effortless creation of Joi schemas to and from JSON.

## Why Choose json-Joi-converter?

Do you need to share the same Joi schema between your backend and frontend? This module makes it simple!
- Generate a JSON representation of your Joi schema on the backend.
- Use that JSON to recreate the Joi schema on the frontend, ensuring consistent validation across your application.

## About Joi

Joi is known as "the most powerful schema description language and data validator for JavaScript." json-Joi-converter extends its capabilities to make schema sharing and reuse even more efficient.


See [Joi API](https://joi.dev/api/?v=17.2.1) for documentation and api.

## Try demo

https://siavashg.com/json-joi-demo/


## Installation

```bash
npm install json-joi-converter
```

### Usage

```js
import Joi, {fromJson, toJson, Schema} from 'json-joi-converter';

const json: Schema = {
  type: "object",
  properties: {
    a: {
      type: "number",
      min: 100,
      max: 1000,
      required: true
    }
  }
};

// fromJson(json) is equal to following

const joi = Joi.object({
  a: Joi.number().min(100).max(1000).required()
});

// VALID
assert.deepEqual(toJson(joi), toJson(fromJson(json)));


```

### Joi Reference & Functions
```js
{
  a: {
    type: "number"
  },
  b: {
    type: "number",
    min: {
      $ref: "a",
      adjust: "value => value + 1"
    }
  }
}

// where adjust is a stringed function

// is equal to
Joi.object({
  a: Joi.number(),
  b: Joi.number.min(Joi.ref("a", {
    adjust: value => value + 1
  }))
})
```

### Joi RegExp
```js
let json: ObjectSchema = {
  type: "object",
  properties: {
    a: {
      type: "string",
      pattern: "/a/"
    },
    b: {
      type: "string",
      regex: {$regex: "/a/", flags: "i"}
    },
    c: {
      type: "string",
      regex: {pattern: {$regex: "/a/"}}
    }
  }
};

const converted = (toJson(fromJson(json)) as any);

assert.equal(converted.properties?.a?.pattern?.regex?.$regex, '\\/a\\/');
assert.equal(converted.properties?.b?.pattern?.regex?.$regex, '\\/a\\/');
assert.equal(converted.properties?.b?.pattern?.regex?.flags, 'i');
assert.equal(converted.properties?.c?.pattern?.regex?.$regex, '\\/a\\/');
```

### Joi Replace
```js
{
  type: "string",
  replace: {find: {$regex: "a", flags: "gi"}, replace: "b"}
}

// is equal to
Joi.string().replace(/a/gi, "b")

{
  type: "string",
  replace: [
    {find: {$regex: "a", flags: "gi"}, replace: "b"},
    {find: "a", replace: "b"}
  ]
}

// is equal to
Joi.string().replace(/a/gi, "b").replace("a", "b")

```
