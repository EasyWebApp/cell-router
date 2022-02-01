import { documentReady, render, createCell, Fragment } from 'web-cell';
import { CellRouter } from '../../../dist';

import { history } from '../model';
import { NavBar, TestPage } from './example';

documentReady.then(() =>
    render(
        <Fragment>
            <NavBar />

            <CellRouter
                className="router"
                pageClass="page"
                startClass="start"
                endClass="end"
                history={history}
                routes={[
                    { paths: ['test'], component: TestPage },
                    { paths: [/^example/], component: async () => TestPage }
                ]}
            />
        </Fragment>
    )
);
