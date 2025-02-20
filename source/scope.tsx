import { JsxProps } from 'dom-renderer';
import { WebCellProps } from 'web-cell';

import { History, RouterMode } from './History';
import { CellRoute, CellRouteProps } from './Router';

export interface RouterOptions {
    mode?: keyof typeof RouterMode;
    basePath?: string;
}

export interface LinkProps extends WebCellProps<HTMLAnchorElement> {
    to: string;
}

export type FormProps = JsxProps<HTMLFormElement>;

export function createRouter({
    mode = 'hash',
    basePath = '',
    ...scopeProps
}: RouterOptions = {}) {
    const prefix = RouterMode[mode],
        history = new History(
            (new URL(basePath, location.origin) + '').replace(/\/$/, ''),
            RouterMode[mode]
        );
    return {
        Route: ({ path, ...props }: CellRouteProps) => (
            <CellRoute
                {...props}
                {...scopeProps}
                history={history}
                path={prefix + path}
            />
        ),
        Link: ({ to, children, ...props }: LinkProps) => (
            <a {...props} href={prefix + to}>
                {children}
            </a>
        ),
        // @ts-ignore
        Form: ({ action, children, ...props }: FormProps) => (
            // @ts-ignore
            <form {...props} action={prefix + action}>
                {children}
            </form>
        )
    };
}
