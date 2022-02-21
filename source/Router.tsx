import {
    WebCellProps,
    FunctionComponent,
    WebCellClass,
    component,
    WebCell,
    observer,
    attribute,
    reaction,
    createCell
} from 'web-cell';
import { observable, computed } from 'mobx';

import { PageProps, nextTick, watchStop } from './utility';
import history, { History } from './History';

export interface CellRouteProps extends WebCellProps {
    path: string;
    component: FunctionComponent<PageProps> | WebCellClass<PageProps>;
    startClass?: string;
    endClass?: string;
}

@component({
    tagName: 'cell-route'
})
@observer
export class CellRoute extends WebCell<CellRouteProps>() {
    @attribute
    @observable
    path: string;

    @observable
    component: CellRouteProps['component'];

    @attribute
    @observable
    startClass?: string;

    @attribute
    @observable
    endClass?: string;

    @observable
    moveClass?: string;

    @observable
    moved = !this.endClass;

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
