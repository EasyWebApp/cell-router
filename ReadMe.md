# Cell Router

[Web Component][1] Router based on [WebCell][2] & [Iterable Observer][3]

[![NPM Dependency](https://david-dm.org/EasyWebApp/cell-router.svg)][4]
[![Build Status](https://travis-ci.com/EasyWebApp/cell-router.svg?branch=master)][5]

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)][6]

## Demo

https://web-cell.dev/scaffold/

## Feature

-   [x] **Router Component** as a **Page Container**

-   [x] **Page Link** (support `<a />`, `<area />` & `<form />`)

    -   `<a href="route/path">Page title</a>`
    -   `<a href="route/path" title="Page title" target="_self">Example page</a>`
    -   `<a href="#page-section">Page section</a>` (Scroll to an Anchor smoothly)
    -   `<form method="get" action="route/path" />` (Form Data processed by `URLSearchParams`)

-   [x] **Path Mode**: `location.hash` (default) & `history.pushState()`

-   [x] **Async Loading** (recommend to use with `import()` ECMAScript proposal)

-   [x] CSS based **Page Transition Animation** (example [CSS][7] & [TSX][8])

## Installation

```shell
npm install web-cell cell-router
npm install parcel-bundler -D
```

`tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true,
        "jsx": "react",
        "jsxFactory": "createCell",
        "jsxFragmentFactory": "Fragment"
    }
}
```

## Usage

### Sync Pages

`source/index.tsx`

```jsx
import { documentReady, render, createCell, Fragment } from 'web-cell';
import { History, PageProps, CellRouter } from 'cell-router/source';

const history = new History();

function TestPage({ path, history, defaultSlot, ...data }: PageProps) {
    return (
        <ul>
            <li>Path: {path}</li>
            <li>Data: {JSON.stringify(data)}</li>
        </ul>
    );
}

documentReady.then(() =>
    render(
        <>
            <nav>
                <a href="test?a=1">Test</a>
                <a href="example?b=2">Example</a>
            </nav>
            <CellRouter
                className="router"
                history={history}
                routes={[{ paths: ['test', /^example/], component: TestPage }]}
            />
        </>
    )
);
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

`source/index.tsx`

```jsx
import { documentReady, render, createCell, Fragment } from 'web-cell';
import { History, CellRouter } from 'cell-router/source';

import routes from './page';

const history = new History();

documentReady.then(() =>
    render(
        <>
            <nav>
                <a href="test?a=1">Test</a>
                <a href="example?b=2">Example</a>
            </nav>
            <CellRouter className="router" history={history} routes={routes} />
        </>
    )
);
```

[1]: https://www.webcomponents.org/
[2]: https://web-cell.dev/
[3]: https://web-cell.dev/iterable-observer/
[4]: https://david-dm.org/EasyWebApp/cell-router
[5]: https://travis-ci.com/EasyWebApp/cell-router
[6]: https://nodei.co/npm/cell-router/
[7]: https://github.com/EasyWebApp/cell-router/blob/v2/test/source/index.less#L5
[8]: https://github.com/EasyWebApp/cell-router/blob/v2/test/source/page/index.tsx#L12
