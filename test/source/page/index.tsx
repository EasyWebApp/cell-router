import { DOMRenderer } from 'dom-renderer';
import { configure } from 'mobx';
import { lazy } from 'web-cell';
import { documentReady } from 'web-utility';
import { CellRouter, createRouter } from '../../../source';

import { TestPage } from './example';

const AsyncPage = lazy(() => import('./async'));

configure({ enforceActions: 'never' });

const { Route, Link } = createRouter();

documentReady.then(() =>
    new DOMRenderer().render(
        <>
            <nav>
                <Link to="list/1">List page</Link>
                <Link to="detail/2?edit=true">Detail page</Link>
                <Link to="async/3?edit=true">Async page</Link>
            </nav>
            <CellRouter className="router">
                <Route
                    path=""
                    component={props => <div {...props}>Home Page</div>}
                />
                <Route path="list/:id" component={TestPage} />
                <Route path="detail/:id" component={TestPage} />
                <Route path="async/:id" component={AsyncPage} />
            </CellRouter>
        </>
    )
);
