![Node.js Package](https://github.com/boxpositron/moment-logger/workflows/Node.js%20Package/badge.svg)

# Moment Logger
Fancy terminal logging with timestamps

## Installation

NPM

`npm install moment-logger`

Yarn

`yarn add moment-logger`


## Usage

```js
const logger = require('moment-logger')

# Display hello world

logger.log('Hello world')

# Display world object

const worldObject = {
    earth: ['Water', 'Earth', 'Air', 'Fire']
}

logger.log(worldObject)

```

