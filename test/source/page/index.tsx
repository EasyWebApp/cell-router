import { DOMRenderer } from 'dom-renderer';
import { configure } from 'mobx';
import { lazy } from 'web-cell';
import { documentReady } from 'web-utility';
import { createRouter } from '../../../source';

import { Button } from './Button';
import { AsyncPage, SyncPage } from './example';

const DynamicPage = lazy(() => import('./dynamic'));

configure({ enforceActions: 'never' });

const { Router, Route, Link, Button: XButton } = createRouter({ linkTags: { Button } });

documentReady.then(() =>
    new DOMRenderer().render(
        <>
            <nav>
                <Link to="list/1">List page</Link>
                <XButton href="detail/2?edit=true">Detail page</XButton>
                <Link to="dynamic/3?edit=true">Dynamic page</Link>
                <Link to="async/4?edit=true">Async page</Link>
                <Link to="not-found">404 page</Link>
            </nav>
            <Router className="router">
                <Route path="" component={() => <h1>Home</h1>} />
                <Route path="list/:id" component={SyncPage} />
                <Route path="detail/:id" component={SyncPage} />
                <Route path="dynamic/:id" component={DynamicPage} />
                <Route path="async/:id" component={AsyncPage} />
                <Route path="*" component={() => <h1>404 Not Found</h1>} />
            </Router>
        </>
    )
);
