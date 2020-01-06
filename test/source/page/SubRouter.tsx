import { createCell, component } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { HTMLRouter } from '../../../source';

import { subHistory } from '../model';

function Sample({ path }) {
    return <span>{path}</span>;
}

function Temp({ path }) {
    return <span>{path}</span>;
}

@observer
@component({
    tagName: 'sub-router',
    renderTarget: 'children'
})
export default class SubRouter extends HTMLRouter {
    protected history = subHistory;
    protected routes = [
        { paths: ['sample'], component: Sample },
        { paths: ['temp'], component: Temp }
    ];

    render() {
        return (
            <main>
                <ul>
                    <li>
                        <a href="sample">Sample</a>
                    </li>
                    <li>
                        <a href="temp">Temp</a>
                    </li>
                </ul>
                <div>{super.render()}</div>
            </main>
        );
    }
}
