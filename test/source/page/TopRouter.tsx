import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from '../../../source';

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
    protected routes = [
        { paths: ['test'], component: Test },
        {
            paths: ['example'],
            component: () => Promise.resolve(Example)
        }
    ];

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
                <div>{super.render()}</div>
            </main>
        );
    }
}
