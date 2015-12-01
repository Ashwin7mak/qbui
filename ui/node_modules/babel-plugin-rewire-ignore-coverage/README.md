# babel-plugin-review-no-cover

Disable rewire injected methods from istanbul coverage.

## Example

**In**

```javascript
__$Getters__['React'] = function () {
    return React;
};
 
__$Setters__['React'] = function (value) {
    React = value;
};
 
__$Resetters__['React'] = function () {
    React = _react2['default'];
}; 

```

**Out**

```javascript

__$Getters__['React'] = 
/* istanbul ignore next */
function () {
    return React;
};
 

__$Setters__['React'] = /* istanbul ignore next */ 
function (value) {
    React = value;
};
 
__$Resetters__['React'] = /* istanbul ignore next */
function () {
    React = _react2['default'];
}; 
```

## Installation

```sh
$ npm install babel-plugin-rewire-ignore-coverage
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["rewire-ignore-coverage"]
}
```

### Via CLI

```sh
$ babel --plugins rewire-ignore-coverage  script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["rewire-ignore-coverage"]
});
```
