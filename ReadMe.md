# Cell Router

[Web Component][1] Router based on [WebCell][2] & [MobX][3]

[![NPM Dependency](https://david-dm.org/EasyWebApp/cell-router.svg)][4]
[![Build Status](https://travis-ci.com/EasyWebApp/cell-router.svg?branch=master)][5]

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)][6]

## Demo

https://web-cell.dev/scaffold/

## Feature

-   [x] **Router Component** as a **Page Container**

-   [x] **Page Link** (support `<a />` & `<area />`)

    -   `<a href="route/path">Page title</a>`
    -   `<a href="route/path" title="Page title" target="_self">Example page</a>`
    -   `<a href="#page-section">Page section</a>` (Scroll to an Anchor smoothly)

-   [x] **Path Mode**: `location.hash` (default) & `history.pushState()`

-   [x] **Async Loading** (recommend to use with `import()` ECMAScript proposal)

-   [x] (experimental) [Nested Router][7] support

## Installation

```shell
npm install web-cell@next mobx mobx-web-cell cell-router@next
npm install parcel-bundler -D
```

`tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "es5",
        "experimentalDecorators": true,
        "jsx": "react",
        "jsxFactory": "createCell"
    }
}
```

## Usage

### Sync Pages

`source/model/index.ts`

```typescript
import { History } from 'cell-router/source';

export const history = new History();
```

`source/page/PageRouter.tsx`

```javascript
import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';

import { history } from '../model';

function Test({ path }) {
    return <span>{path}</span>;
}

function Example({ path }) {
    return <span>{path}</span>;
}

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export default class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = [
        { paths: ['test'], component: Test },
        { paths: ['example'], component: Example }
    ];

    render() {
        return (
            <main>
                <ul>
                    <li>
                        <a href="test">Test</a>
                    </li>
                    <li>
                        <a href="example">Example</a>
                    </li>
                </ul>
                <div>{super.render()}</div>
            </main>
        );
    }
}
```

### Async Pages

`tsconfig.json`

```json
{
    "compilerOptions": {
        "module": "ESNext"
    }
}
```

`source/page/index.ts`

```javascript
export default [
    {
        paths: ['', 'home'],
        component: async () => (await import('./Home.tsx')).default
    },
    {
        paths: ['list'],
        component: async () => (await import('./List.tsx')).default
    }
];
```

`source/component/PageRouter.tsx`

```javascript
import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';

import { history } from '../model';
import routes from '../page';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export default class PageRouter extends HTMLRouter {
    protected history = history;
    protected routes = routes;

    render() {
        return (
            <main>
                <ul>
                    <li>
                        <a href="home">Home</a>
                    </li>
                    <li>
                        <a href="list">List</a>
                    </li>
                </ul>
                <div>{super.render()}</div>
            </main>
        );
    }
}
```

[1]: https://www.webcomponents.org/
[2]: https://web-cell.dev/
[3]: https://mobx.js.org/
[4]: https://david-dm.org/EasyWebApp/cell-router
[5]: https://travis-ci.com/EasyWebApp/cell-router
[6]: https://nodei.co/npm/cell-router/
[7]: ./test/source/page/TopRouter.tsx
