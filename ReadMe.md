# Cell Router

[Web Component][1] Router based on [WebCell][2] & [MobX][3]

[![](https://data.jsdelivr.com/v1/package/npm/cell-router/badge?style=rounded)][3]

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)][4]

## Feature

-   [x] **Router Component** as a **Page Container**

-   [x] **Page Link** (support `<a />` & `<area />`)

    -   `<a href="route/path">Page title</a>`
    -   `<a href="route/path" title="Page title" target="_self">Example page</a>`

-   [x] **Path Mode**: `location.hash` (default) & `history.pushState()`

-   [x] (experimental) [Nested Router][5] support

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

`source/model/index.ts`

```typescript
import { History } from 'cell-router/source';

export const history = new History();
```

`source/page/PageRouter.tsx`

```jsx
import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from 'cell-router/source';

import { history } from '../model';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export default class PageRouter extends HTMLRouter {
    protected history = history;

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
                <div>{history.path}</div>
            </main>
        );
    }
}
```

[1]: https://www.webcomponents.org/
[2]: https://github.com/EasyWebApp/WebCell/tree/v2
[3]: https://mobx.js.org/
[4]: https://nodei.co/npm/cell-router/
[5]: ./test/source/page/NestedRouter.tsx
