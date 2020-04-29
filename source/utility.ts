import { parseURLData } from 'web-utility/source/URL';

export interface Route {
    paths: (string | RegExp)[];
    component: Function | (() => Promise<Function>);
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
