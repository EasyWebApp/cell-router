import { WebCellProps, WebCellElement } from 'web-cell';
import { watchMotion, durationOf } from 'web-utility/source/animation';
import { parseURLData } from 'web-utility/source/URL';

import { History } from './History';

export function watchStop(element: HTMLElement) {
    return watchMotion(
        durationOf('transition', element) ? 'transition' : 'animation',
        element
    );
}
export interface PageProps extends WebCellProps {
    path: string;
    history?: History;
    [key: string]: any;
}

export type PageComponent<P extends PageProps = PageProps> = (
    props: P
) => WebCellElement;

export interface Route {
    paths: (string | RegExp)[];
    component: Function | (() => Promise<PageComponent>);
}

export function matchRoutes(list: Route[], path: string) {
    for (const { paths, ...rest } of list)
        for (const item of paths)
            if (
                typeof item === 'string'
                    ? path.startsWith(item)
                    : item.exec(path)
            ) {
                const data = path.split('?');

                return {
                    ...rest,
                    path: data[0],
                    params: data[1] && parseURLData(data[1])
                };
            }
}
