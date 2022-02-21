import { WebCellProps, createCell } from 'web-cell';

import { CellRouteProps, CellRoute } from './Router';

export interface RouterOptions
    extends Pick<CellRouteProps, 'startClass' | 'endClass'> {
    mode?: 'hash' | 'history';
}

export interface LinkProps extends WebCellProps {
    to: string;
}

export type FormProps = WebCellProps<HTMLFormElement>;

export function createRouter({
    mode = 'hash',
    ...scopeProps
}: RouterOptions = {}) {
    const prefix = mode === 'hash' ? '#' : '';

    return {
        Route: ({ path, ...props }: CellRouteProps) => (
            <CellRoute {...props} {...scopeProps} path={prefix + path} />
        ),
        Link: ({ to, defaultSlot, ...props }: LinkProps) => (
            <a {...props} href={prefix + to}>
                {defaultSlot}
            </a>
        ),
        // @ts-ignore
        Form: ({ action, defaultSlot, ...props }: FormProps) => (
            // @ts-ignore
            <form {...props} action={prefix + action}>
                {defaultSlot}
            </form>
        )
    };
}
