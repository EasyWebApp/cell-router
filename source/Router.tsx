import { computed, observable } from 'mobx';
import {
    ClassComponent,
    FC,
    WebCell,
    WebCellProps,
    attribute,
    component,
    observer
} from 'web-cell';

import { History } from './History';
import { PageProps } from './utility';

export interface CellRouteProps extends WebCellProps {
    history?: History;
    path: string;
    component: FC<PageProps> | ClassComponent;
}

export interface CellRoute extends WebCell {}

@component({
    tagName: 'cell-route',
    transitible: true
})
@observer
export class CellRoute extends HTMLElement implements WebCell {
    declare props: CellRouteProps;

    @observable
    accessor history: History | undefined;

    @attribute
    @observable
    accessor path: string;

    component: CellRouteProps['component'];

    @computed
    get matched() {
        return this.history?.match(this.path);
    }

    connectedCallback() {
        this.history ||= new History();
    }

    render() {
        const { history, component: Tag, matched } = this;
        const { path } = history || {};

        return matched ? (
            <Tag
                {...matched}
                {...History.dataOf(path)}
                {...{ path, history }}
            />
        ) : (
            <></>
        );
    }
}
