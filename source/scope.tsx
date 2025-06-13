import { JsxProps } from 'dom-renderer';
import { WebCellProps } from 'web-cell';

import { RouterMode } from './History';
import { CellRoute, Route } from './Router';

export interface RouterOptions {
    mode?: keyof typeof RouterMode;
}

export interface LinkProps extends WebCellProps<HTMLAnchorElement> {
    to: string;
}

export type FormProps = JsxProps<HTMLFormElement>;

export function createRouter({
    mode = 'hash',
    ...scopeProps
}: RouterOptions = {}) {
    const prefix = RouterMode[mode];

    return {
        Route: ({ path, ...props }: Route) => (
            <CellRoute {...props} {...scopeProps} path={prefix + path} />
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
