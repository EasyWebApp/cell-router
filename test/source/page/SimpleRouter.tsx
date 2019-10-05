import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from '../../../source';

import { simpleHistory } from '../model';

@observer
@component({
    tagName: 'simple-router',
    renderTarget: 'children'
})
export default class SimpleRouter extends HTMLRouter {
    protected history = simpleHistory;

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
                <div>{simpleHistory.path}</div>
            </main>
        );
    }
}
