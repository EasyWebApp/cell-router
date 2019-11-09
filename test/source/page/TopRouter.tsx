import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter, matchRoutes } from '../../../source';

import { topHistory } from '../model';
import SubRouter from './SubRouter';

function Test({ path }) {
    return <span>{path}</span>;
}

function Example({ path }) {
    return (
        <div>
            {path}
            <SubRouter />
        </div>
    );
}

@observer
@component({
    tagName: 'top-router',
    renderTarget: 'children'
})
export default class TopRouter extends HTMLRouter {
    protected history = topHistory;

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
                <div>
                    {matchRoutes(
                        [
                            { paths: ['test'], component: Test },
                            { paths: ['example'], component: Example }
                        ],
                        topHistory.path
                    )}
                </div>
            </main>
        );
    }
}
