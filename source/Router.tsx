import { DOMRenderer } from 'dom-renderer';
import { observable } from 'mobx';
import {
    ClassComponent,
    FC,
    WebCell,
    WebCellProps,
    attribute,
    component,
    observer,
    reaction
} from 'web-cell';

import { History } from './History';
import { PageProps } from './utility';

export interface Route {
    path: string;
    component: FC<PageProps> | ClassComponent;
}

export type CellRouteProps = Route & WebCellProps;

export interface CellRoute extends WebCell<CellRouteProps> {}

@component({ tagName: 'cell-route' })
@observer
export class CellRoute extends HTMLElement implements WebCell<CellRouteProps> {
    @attribute
    @observable
    accessor path: string;

    component: Route['component'];
}

export interface CellRouterProps extends WebCellProps {
    history?: History;
    routes?: Route[];
}

export interface CellRouter extends WebCell<CellRouterProps> {}

@component({ tagName: 'cell-router', mode: 'open' })
@observer
export class CellRouter extends HTMLElement implements WebCell<CellRouterProps> {
    @observable.shallow
    accessor history: History | undefined;

    @observable.shallow
    accessor routes: Route[] = [];

    #renderer = new DOMRenderer();

    mountedCallback() {
        this.history ||= new History();

        this.renderChildren();
    }

    handleSlotChange = ({ currentTarget }: Event) => {
        const routes = (currentTarget as HTMLSlotElement)
            .assignedElements()
            .filter((node): node is CellRoute => node instanceof CellRoute)
            .map(({ path, component }) => ({ path, component }));

        if (routes[0]) this.routes = routes;
    };

    @reaction(({ history }) => history?.path)
    async renderChildren() {
        const { history, routes } = this;

        if (!history) return;

        const { path } = history;
        const [{ component: Tag, ...matched } = {}] = [...routes]
            .sort(({ path: a }, { path: b }) => b.split('/').length - a.split('/').length)
            .map(({ path, component }) => {
                const matched = history.match(path);

                return matched && { component, ...matched };
            })
            .filter(Boolean);

        const vNode = Tag ? (
            <Tag {...matched} {...History.dataOf(path)} {...{ path, history }} />
        ) : (
            <></>
        );
        const render = () => {
            this.#renderer.render(vNode, this);
            return {};
        };
        const { finished, updateCallbackDone } =
            document.startViewTransition?.(render) || (render() as ViewTransition);
        try {
            await finished;
        } catch {
            return updateCallbackDone;
        }
    }

    render() {
        return <slot onSlotChange={this.handleSlotChange} />;
    }
}
