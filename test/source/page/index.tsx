import { documentReady } from 'web-utility';
import { render, createCell, Fragment } from 'web-cell';

import { createRouter } from '../../../dist';
import TestPage from './example';

const { Route, Link } = createRouter({
    startClass: 'start',
    endClass: 'end'
});

documentReady.then(() =>
    render(
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
