# Cell Router

[Web Component][1] Router based on [WebCell][2] & [MobX][3]

[![NPM Dependency](https://img.shields.io/librariesio/github/EasyWebApp/cell-router.svg)][4]
[![CI & CD](https://github.com/EasyWebApp/cell-router/actions/workflows/main.yml/badge.svg)][5]

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)][6]

## Demo

https://web-cell.dev/cell-router/preview/

## Feature

- [x] `<iframe />`-like **Route Component** as a **Page Container**

- [x] **Page Link** (support `<a />`, `<area />` & `<form />`)
    - `<a href="route/path">Page title</a>`
    - `<a href="route/path" title="Page title">Example page</a>`
    - `<a href="#page-section">Page section</a>` (Scroll to an Anchor smoothly)
    - `<form method="get" action="route/path" />` (Form Data processed by `URLSearchParams`)

- [x] **Path Mode**: `location.hash` (default) & `history.pushState()`

- [x] **Async Loading** (based on `async`/`await` or `import()` ECMAScript syntax)

- [x] [View Transition API][7] based **Page Transition Animation**

## Version

|        SemVer        | status | WebCell |               API                | async page | page transition | nested router |
| :------------------: | :----: | :-----: | :------------------------------: | :--------: | :-------------: | :-----------: |
|        `4.x`         |   ✅   | `>=3.1` |        HTML tags (+ JSON)        |     ✅     |       ✅        |      ❌       |
|        `3.x`         |   ❌   |  `3.x`  |            HTML tags             |     ✅     |       ✅        |      ❌       |
|        `2.x`         |   ❌   |  `2.x`  |         HTML tag + JSON          |     ✅     |       ✅        |      ✅       |
| `>=2.0.0-alpha.0 <2` |   ❌   |  `2.x`  |     `abstract class` + JSON      |     ✅     |       ❌        |      ✅       |
|        `1.x`         |   ❌   |  `1.x`  | `abstract class` + ES decorators |     ❌     |       ❌        |      ❌       |
|     `>=0.9 <1.0`     |   ❌   |  `0.x`  | `abstract class` + ES decorators |     ❌     |       ❌        |      ❌       |
|        `<0.9`        |   ❌   |  `0.x`  |       `class` + HTML tags        |     ❌     |       ❌        |      ❌       |

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
import { DOMRenderer } from 'dom-renderer';
import { FC } from 'web-cell';
import { CellRouter, createRouter, PageProps } from 'cell-router';

const { Route, Link } = createRouter();

const TestPage: FC<PageProps> = ({ className, style, path, history, ...data }) => (
    <ul {...{ className, style }}>
        <li>Path: {path}</li>
        <li>Data: {JSON.stringify(data)}</li>
    </ul>
);

new DOMRenderer().render(
    <>
        <nav>
            <Link to="test?a=1">Test</Link>
            <Link to="example/2">Example</Link>
        </nav>
        <CellRouter className="router">
            <Route path="" component={props => <div {...props}>Home Page</div>} />
            <Route path="test" component={TestPage} />
            <Route path="example/:id" component={TestPage} />
        </CellRouter>
    </>
);
```

### Async Pages

#### `tsconfig.json`

```json
{
    "compilerOptions": {
        "module": "ES2020"
    }
}
```

#### `source/Dynamic.tsx`

```tsx
import { FC } from 'web-cell';
import { PageProps } from 'cell-router';

const DynamicPage: FC<PageProps> = ({ path, id, ...props }) => (
    <div {...props}>
        <h1>Dynamic</h1>
        <pre>
            <code>{JSON.stringify({ path, id, ...props }, null, 4)}</code>
        </pre>
    </div>
);
export default DynamicPage;
```

#### `source/Async.tsx`

```tsx
import { FC, observer } from 'web-cell';
import { sleep } from 'web-utility';
import { PageProps } from 'cell-router';

export const AsyncPage: FC<PageProps> = observer(async props => {
    await sleep();

    return (
        <div {...props}>
            <h1>Async</h1>
            <pre>
                <code>{JSON.stringify(props, null, 4)}</code>
            </pre>
        </div>
    );
});
```

#### `source/index.tsx`

```tsx
import { DOMRenderer } from 'dom-renderer';
import { FC, lazy } from 'web-cell';
import { CellRouter, createRouter, PageProps } from 'cell-router';

import { AsyncPage } from './Async';

const { Route, Link } = createRouter();

const SyncPage: FC<PageProps> = ({ className, style, path, history, ...data }) => (
    <ul {...{ className, style }}>
        <li>Path: {path}</li>
        <li>Data: {JSON.stringify(data)}</li>
    </ul>
);
const DynamicPage = lazy(() => import('./Dynamic'));

new DOMRenderer().render(
    <>
        <nav>
            <Link to="sync?a=1">Sync</Link>
            <Link to="dynamic/2">Dynamic</Link>
            <Link to="async/3">Async</Link>
        </nav>
        <CellRouter className="router">
            <Route path="" component={props => <div {...props}>Home Page</div>} />
            <Route path="sync" component={SyncPage} />
            <Route path="dynamic/:id" component={DynamicPage} />
            <Route path="async/:id" component={AsyncPage} />
        </CellRouter>
    </>
);
```

[1]: https://www.webcomponents.org/
[2]: https://web-cell.dev/
[3]: https://mobx.js.org/
[4]: https://libraries.io/npm/cell-router
[5]: https://github.com/EasyWebApp/cell-router/actions/workflows/main.yml
[6]: https://nodei.co/npm/cell-router/
[7]: https://developer.chrome.com/docs/web-platform/view-transitions/
