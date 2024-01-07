# Cell Router

[Web Component][1] Router based on [WebCell][2] & [MobX][3]

[![NPM Dependency](https://img.shields.io/librariesio/github/EasyWebApp/cell-router.svg)][4]
[![CI & CD](https://github.com/EasyWebApp/cell-router/actions/workflows/main.yml/badge.svg)][5]

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)][6]

## Demo

https://web-cell.dev/scaffold/

## Feature

-   [x] `<iframe />`-like **Route Component** as a **Page Container**

-   [x] **Page Link** (support `<a />`, `<area />` & `<form />`)

    -   `<a href="route/path">Page title</a>`
    -   `<a href="route/path" title="Page title">Example page</a>`
    -   `<a href="#page-section">Page section</a>` (Scroll to an Anchor smoothly)
    -   `<form method="get" action="route/path" />` (Form Data processed by `URLSearchParams`)

-   [x] **Path Mode**: `location.hash` (default) & `history.pushState()`

-   [x] **Async Loading** (recommend to use with `import()` ECMAScript syntax)

-   [x] CSS based **Page Transition Animation** (example [CSS][7] & [TSX][8])

## Installation

### Command

```shell
npm install dom-renderer web-cell cell-router
npm install parcel @parcel/config-default @parcel/transformer-typescript-tsc -D
```

### `tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES6",
        "useDefineForClassFields": true,
        "jsx": "react-jsx",
        "jsxImportSource": "dom-renderer"
    }
}
```

### `.parcelrc`

```json
{
    "extends": "@parcel/config-default",
    "transformers": {
        "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
    }
}
```

## Usage

### Sync Pages

#### `source/index.tsx`

```tsx
import { documentReady } from 'web-utility';
import { DOMRenderer } from 'dom-renderer';
import { FC } from 'web-cell';
import { createRouter, PageProps } from 'cell-router';

const { Route, Link } = createRouter();

const TestPage: FC<PageProps> = ({ path, history, defaultSlot, ...data }) => (
    <ul>
        <li>Path: {path}</li>
        <li>Data: {JSON.stringify(data)}</li>
    </ul>
);

documentReady.then(() =>
    new DOMRenderer().render(
        <>
            <nav>
                <Link to="test?a=1">Test</Link>
                <Link to="example?b=2">Example</Link>
            </nav>
            <main className="router">
                <Route path="test" component={TestPage} />
                <Route path="example" component={TestPage} />
            </main>
        </>
    )
);
```

### Async Pages

#### `tsconfig.json`

```json
{
    "compilerOptions": {
        "module": "ESNext"
    }
}
```

#### `source/page/index.ts`

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

#### `source/index.tsx`

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
[3]: https://github.com/mobxjs/mobx/tree/mobx4and5/docs
[4]: https://libraries.io/npm/cell-router
[5]: https://github.com/EasyWebApp/cell-router/actions/workflows/main.yml
[6]: https://nodei.co/npm/cell-router/
[7]: https://github.com/EasyWebApp/cell-router/blob/v2/test/source/index.less#L5
[8]: https://github.com/EasyWebApp/cell-router/blob/v2/test/source/page/index.tsx#L12
