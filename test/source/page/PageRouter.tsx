import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from '../../../source/';

import { history } from '../model';

@observer
@component({
    tagName: 'page-router',
    renderTarget: 'children'
})
export default class PageRouter extends HTMLRouter {
    protected history = history;

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
                <div>{history.path}</div>
            </main>
        );
    }
}
