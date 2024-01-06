import { DOMRenderer } from 'dom-renderer';
import { configure } from 'mobx';
import { documentReady } from 'web-utility';

import { createRouter } from '../../../source';
import TestPage from './example';

configure({ enforceActions: 'never' });

const { Route, Link } = createRouter({
    startClass: 'start',
    endClass: 'end'
});

documentReady.then(() =>
    new DOMRenderer().render(
        <>
            <nav>
                <Link to="list/1">List page</Link>
                <Link to="detail/2?edit=true">Detail page</Link>
            </nav>
            <main className="router">
                <Route path="list/:id" component={TestPage} />
                <Route path="detail/:id" component={TestPage} />
            </main>
        </>
    )
);
