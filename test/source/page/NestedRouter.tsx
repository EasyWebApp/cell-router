import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from '../../../source';

import { nestedHistory, simpleHistory } from '../model';
import SimpleRouter from './SimpleRouter';

@observer
@component({
    tagName: 'nested-router',
    renderTarget: 'children'
})
export default class NestedRouter extends HTMLRouter {
    protected history = nestedHistory;

    renderPage() {
        if (nestedHistory.path !== 'nested')
            return <div>{nestedHistory.path}</div>;

        simpleHistory.mount();

        return <SimpleRouter />;
    }

    render() {
        return (
            <main>
                <ul>
                    <li>
                        <a href="simple">Simple</a>
                    </li>
                    <li>
                        <a href="nested">Nested</a>
                    </li>
                </ul>
                {this.renderPage()}
            </main>
        );
    }
}
