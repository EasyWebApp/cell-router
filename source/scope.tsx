import { JsxProps } from 'dom-renderer';
import { PropsWithChildren } from 'web-cell';

import { CellRoute, CellRouteProps } from './Router';

export interface RouterOptions {
    mode?: 'hash' | 'history';
}

export type LinkProps = PropsWithChildren<{ to: string }>;

export type FormProps = JsxProps<HTMLFormElement>;

export function createRouter({
    mode = 'hash',
    ...scopeProps
}: RouterOptions = {}) {
    const prefix = mode === 'hash' ? '#' : '';

    return {
        Route: ({ path, ...props }: CellRouteProps) => (
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
