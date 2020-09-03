import {
    WebCellProps,
    WebCellElement,
    component,
    mixin,
    watch,
    attribute,
    createCell
} from 'web-cell';

import { Route, matchRoutes, watchStop } from './utility';
import { History } from './History';

export interface CellRouterProps extends WebCellProps {
    routes: Route[];
    path?: string;
    history?: History;
    pageClass?: string;
    startClass?: string;
    endClass?: string;
    onPageLoad?: (event: CustomEvent<string>) => any;
    onPageRender?: (event: CustomEvent<string>) => any;
}

interface CellRouterState {
    newPath: string;
    oldPath: string;
}

@component({
    tagName: 'cell-router',
    renderTarget: 'children'
})
export class CellRouter extends mixin<CellRouterProps, CellRouterState>() {
    static arrange(routes: Route[]) {
        return routes
            .reduce(
                (routes, { paths, component }) => [
                    ...routes,
                    ...paths.map(path => ({ paths: [path], component }))
                ],
                [] as Route[]
            )
            .sort(({ paths: [a] }, { paths: [b] }) =>
                (b + '').localeCompare(a + '')
            );
    }

    state = {
        newPath: '',
        oldPath: ''
    };

    @watch
    set routes(routes: Route[]) {
        this.setProps({ routes: CellRouter.arrange(routes) });
    }

    @attribute
    @watch
    set path(path: string) {
        this.setPath(path);
    }

    private setPath(path: string) {
        return Promise.all([
            this.setState({ oldPath: this.props.path, newPath: path }),
            this.setProps({ path })
        ]);
    }

    @watch
    set history(history: History) {
        this.setProps({ history }).then(async () => {
            history.listen(this.ownerDocument.body);

            for await (const {
                data,
                defer: { resolve }
            } of history) {
                await this.setPath(data);
                resolve();
            }
        });
    }

    @attribute
    @watch
    pageClass = '';

    @attribute
    @watch
    startClass = '';

    @attribute
    @watch
    endClass = '';

    pageOf(path: string): WebCellElement | undefined {
        const { component: Page, path: pathname, params, ...rest } =
            matchRoutes(this.routes, path) || {};

        if (!Page) return;

        const page = (
            <Page
                {...rest}
                path={pathname}
                params={params}
                history={this.history}
            />
        );
        if (!(page instanceof Promise)) return page;

        this.emit('pageload', path);

        page.then(AsyncPage => {
            const route = this.routes.find(
                ({ component }) => component === Page
            );
            if (!route) return;

            route.component = AsyncPage;

            this.update();
        });
    }

    connectedCallback() {
        this.style.display = 'block';
    }

    updatedCallback() {
        const { newPath } = this.state;

        if (newPath) this.setState({ newPath: '' });
        else this.emit('pagerender', this.path);
    }

    watchAnimation = async (box: HTMLElement) => {
        await watchStop(box);

        await this.setState({ oldPath: '' });
    };

    render(
        { path = '', pageClass, startClass, endClass }: CellRouterProps,
        { newPath, oldPath }: CellRouterState
    ) {
        [startClass, endClass] = [endClass, startClass].sort(() =>
            this.history.compare(oldPath, newPath)
        );

        return (
            <div>
                {startClass && newPath ? (
                    <div
                        className={`${pageClass} ${startClass}`}
                        key={newPath}
                        ref={this.watchAnimation}
                    >
                        {this.pageOf(newPath)}
                    </div>
                ) : (
                    <div className={pageClass} key={path}>
                        {this.pageOf(path)}
                    </div>
                )}
                {endClass && oldPath && (
                    <div className={`${pageClass} ${endClass}`} key={oldPath}>
                        {this.pageOf(oldPath)}
                    </div>
                )}
            </div>
        );
    }
}
