import { PropsWithChildren } from 'web-cell';
import { HTMLProps } from 'web-utility';

import { CellRoute, CellRouteProps } from './Router';

export interface RouterOptions
    extends Pick<CellRouteProps, 'startClass' | 'endClass'> {
    mode?: 'hash' | 'history';
}

export type LinkProps = PropsWithChildren<{ to: string }>;

export type FormProps = HTMLProps<HTMLFormElement>;

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
