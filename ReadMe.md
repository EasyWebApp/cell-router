# Cell Router

Decorator-based Router component framework, powered by [WebCell](https://web-cell.tk/)

[![NPM Dependency](https://david-dm.org/EasyWebApp/cell-router.svg)](https://david-dm.org/EasyWebApp/cell-router)
[![Build Status](https://travis-ci.com/EasyWebApp/cell-router.svg?branch=master)](https://travis-ci.com/EasyWebApp/cell-router)
[![](https://data.jsdelivr.com/v1/package/npm/cell-router/badge?style=rounded)](https://www.jsdelivr.com/package/npm/cell-router)

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cell-router/)



## Feature

 - [x] **Page link**
   - `<a href="route/path">Page title</a>`
   - `<a href="route/path" title="Page title" target="_self">Example page</a>`

 - [x] **Path mode**: `location.hash` (default) & `history.pushState()`

 - [x] **Page container**: Router component as a Page container

 - [x] **Route match**: Decorator based Register pattern ([Express path style][1])

 - [ ] **Nested routers**

 - [x] **Page loader**: auto detect **UMD** & **ES module**

 - [x] **DOM cache**



## Example

[`source/app-router/index.js`](https://github.com/EasyWebApp/cell-router/blob/master/test/source/app-router/index.js)

```JavaScript
import { component } from 'web-cell';

import HTMLRouter, { load, back } from 'cell-router';


@component()
export default class AppRouter extends HTMLRouter {

    @load('/index')
    indexPage() {  return '<page-index />';  }

    @load('/secret/:id')
    secretPage(id) {  return `<h1>Secret ${id}</h1>`;  }

    @back('/secret')
    burnAfterRead() {  return false;  }
}
```

`index.html`

```HTML
<!DocType HTML>
<html>
    <head>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2CDocumentFragment.prototype.append%2CElement.prototype.append"></script>
        <script src="https://cdn.jsdelivr.net/npm/@babel/polyfill/dist/polyfill.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs"></script>
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/dom-renderer"></script>
        <script src="https://cdn.jsdelivr.net/npm/web-cell"></script>
        <script src="https://cdn.jsdelivr.net/npm/cell-router"></script>

        <script src="dist/app-router.js"></script>
    </head>
    <body>
        <a href="/index">Index</a>
        <a href="/secret">Secret</a>

        <app-router></app-router>
    </body>
</html>
```

`package.json`

```JSON
{
    "directories": {
        "lib": "source/",
        "test": "."
    },
    "scripts": {
        "build": "web-cell pack",
        "dev": "web-cell preview"
    },
    "devDependencies": {
        "@babel/plugin-proposal-decorators": "^7.3.0",
        "@babel/preset-env": "^7.3.4",
        "web-cell-cli": "^0.9.1"
    },
    "babel": {
        "presets": [
            "@babel/preset-env"
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators",
                {
                    "decoratorsBeforeExport": true
                }
            ]
        ]
    }
}
```


## API Document

 - Online: [URL](https://web-cell.tk/cell-router/) or `npm docs`

 - Offline: `npm run help`



 [1]: https://expressjs.com/en/guide/routing.html#route-parameters
