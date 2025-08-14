import { DOMRenderer } from 'dom-renderer';
import { configure } from 'mobx';
import { lazy } from 'web-cell';
import { documentReady } from 'web-utility';
import { createRouter } from '../../../source';

import { Button } from './Button';
import { TestPage } from './example';

const AsyncPage = lazy(() => import('./async'));

configure({ enforceActions: 'never' });

const {
    Router,
    Route,
    Link,
    Button: XButton
} = createRouter({ linkTags: { Button } });

documentReady.then(() =>
    new DOMRenderer().render(
        <>
            <nav>
                <Link to="list/1">List page</Link>
                <XButton href="detail/2?edit=true">Detail page</XButton>
                <Link to="async/3?edit=true">Async page</Link>
            </nav>
            <Router className="router">
                <Route
                    path=""
                    component={props => <div {...props}>Home Page</div>}
                />
                <Route path="list/:id" component={TestPage} />
                <Route path="detail/:id" component={TestPage} />
                <Route path="async/:id" component={AsyncPage} />
            </Router>
        </>
    )
);
