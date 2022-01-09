![Node.js Package](https://github.com/boxpositron/moment-logger/workflows/Node.js%20Package/badge.svg)

# Moment Logger
>Fancy terminal logging with timestamps


## Installing

Using npm: 

```bash
$ npm install moment-logger
```


Using yarn:

```bash
$ yarn add moment-logger
```


## Example

**CommonJS Usage**

>In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with require() use the following approach:

```js
const logger = require('moment-logger').default;

# Display hello world

logger.log('Hello world');

# Display world object

const worldObject = {
    earth: ['Water', 'Earth', 'Air', 'Fire']
};

logger.log(worldObject);

```

**ES6 Usage**
```ts
import logger from 'moment-logger';

# Display hello world

logger.log('Hello world');

# Display world object

const worldObject = {
    earth: ['Water', 'Earth', 'Air', 'Fire']
};

logger.log(worldObject);


```
