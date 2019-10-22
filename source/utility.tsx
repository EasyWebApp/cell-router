import { createCell } from 'web-cell';

export function parsePathData(URI: string) {
    const [path, data] = URI.split('?'),
        params = {};
    // @ts-ignore
    for (let [key, value] of Array.from(new URLSearchParams(data).entries())) {
        const item = params[key];

        try {
            value = JSON.parse(value);
        } catch (error) {
            /**/
        }

        if (!(item != null)) {
            params[key] = value;
            continue;
        }

        if (!(item instanceof Array)) params[key] = [item];

        params[key].push(value);
    }

    return { path, params };
}

interface Route {
    paths: (string | RegExp)[];
    component: Function;
}

export function matchRoutes(list: Route[], path: string) {
    for (const { paths, component: Component } of list)
        for (const item of paths)
            if (
                typeof item === 'string'
                    ? path.startsWith(item)
                    : item.exec(path)
            )
                return <Component {...parsePathData(path)} />;
}
