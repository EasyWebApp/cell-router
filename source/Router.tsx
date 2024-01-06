import { computed, observable } from 'mobx';
import {
    ComponentClass,
    FunctionComponent,
    attribute,
    component,
    observer,
    reaction
} from 'web-cell';
import { HTMLProps } from 'web-utility';

import history, { History } from './History';
import { PageProps, nextTick, watchStop } from './utility';

export interface CellRouteProps extends HTMLProps<HTMLElement> {
    path: string;
    component: FunctionComponent<PageProps> | ComponentClass;
    startClass?: string;
    endClass?: string;
}

@component({
    tagName: 'cell-route'
})
@observer
export class CellRoute extends HTMLElement {
    declare props: CellRouteProps;

    @attribute
    @observable
    accessor path: string;

    @observable
    accessor component: CellRouteProps['component'];

    @attribute
    @observable
    accessor startClass = '';

    @attribute
    @observable
    accessor endClass = '';

    @observable
    accessor moveClass = '';

    @observable
    accessor moved = !this.endClass;

    @computed
    get matched() {
        return History.match(this.path, history.path);
    }

    @computed
    get oldMatched() {
        return History.match(this.path, history.oldPath);
    }

    @reaction((element: CellRoute) => element.matched)
    protected async toggleMotion(enter?: any) {
        if (!this.startClass || !this.endClass) return;

        this.moved = false;
        if (enter) {
            this.moveClass = this.startClass;
            await nextTick();
        } else {
            const end = watchStop(this, `.${this.endClass}`);
            this.moveClass = this.endClass;
            await end;
            this.moved = true;
        }
        this.moveClass = undefined;
    }

    render() {
        const { matched, oldMatched, component: Page, moveClass, moved } = this,
            { path, oldPath } = history;

        return matched ? (
            <Page
                className={moveClass}
                {...matched}
                {...History.dataOf(path)}
                {...{ path, history }}
            />
        ) : (
            oldMatched && !moved && (
                <Page
                    className={moveClass}
                    {...oldMatched}
                    {...History.dataOf(oldPath)}
                    path={oldPath}
                    history={history}
                />
            )
        );
    }
}
