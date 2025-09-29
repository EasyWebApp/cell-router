import { JsxProps } from 'dom-renderer';
import { ComponentProps, ComponentType, FC, WebCellProps } from 'web-cell';

import { RouterMode } from './History';
import { CellRoute, CellRouteProps, CellRouter, CellRouterProps } from './Router';

export interface RouterOptions<LinkTagName extends string, LinkTagProps extends { href?: string }> {
    mode?: keyof typeof RouterMode;
    linkTags?: Record<LinkTagName, ComponentType<LinkTagProps>>;
}

export interface LinkProps extends WebCellProps<HTMLAnchorElement> {
    to: string;
}

export type FormProps = JsxProps<HTMLFormElement>;

export function createRouter<LinkTagName extends string, LinkTagProps extends { href?: string }>({
    mode = 'hash',
    linkTags
}: RouterOptions<LinkTagName, LinkTagProps> = {}) {
    const prefix = RouterMode[mode];

    const extraComponentList = Object.entries<ComponentType<LinkTagProps>>(linkTags || {}).map(
        ([name, Component]: [string, ComponentType<{ href?: string }>]) => [
            name,
            ({ href, ...props }: { href?: string }) => (
                <Component {...props} href={prefix + (href || '')} />
            )
        ]
    );
    const extraComponentMap = Object.fromEntries(extraComponentList) as {
        [K in keyof typeof linkTags]: FC<ComponentProps<(typeof linkTags)[K]>>;
    };

    return {
        ...extraComponentMap,

        Router: ({ routes, ...props }: CellRouterProps) => (
            <CellRouter
                {...props}
                routes={routes?.map(({ path, ...route }) => ({
                    ...route,
                    path: path != null ? `${prefix}${path}` : path
                }))}
            />
        ),
        Route: ({ path, ...props }: CellRouteProps) => (
            <CellRoute {...props} path={path != null ? `${prefix}${path}` : path} />
        ),
        Link: ({ to, children, ...props }: LinkProps) => (
            <a {...props} href={prefix + to}>
                {children}
            </a>
        ),
        Form: ({ action, children, ...props }: FormProps) => (
            <form {...props} action={prefix + action}>
                {children}
            </form>
        )
    };
}
