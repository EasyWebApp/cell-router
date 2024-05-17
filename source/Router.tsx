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

import history, { History } from './History';
import { PageProps } from './utility';

export interface CellRouteProps extends WebCellProps {
    path: string;
    component: FC<PageProps> | ClassComponent;
}

export interface CellRoute extends WebCell {}

@component({ tagName: 'cell-route' })
@observer
export class CellRoute extends HTMLElement implements WebCell {
    declare props: CellRouteProps;

    @attribute
    @observable
    accessor path: string;

    component: CellRouteProps['component'];

    @computed
    get matched() {
        return History.match(this.path, history.path);
    }

    render() {
        const { component: Tag, matched } = this,
            { path } = history;

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
