export function parseURL(path: string) {
    const data = {},
        searchParams = {},
        URI = new URL(path, window.location.href);

    for (const key in URI)
        if (typeof URI[key] !== 'function') data[key] = URI[key];
    // @ts-ignore
    for (let [key, value] of Array.from(URI.searchParams.entries())) {
        const item = searchParams[key];

        try {
            value = JSON.parse(value);
        } catch (error) {
            /**/
        }

        if (!(item != null)) {
            searchParams[key] = value;
            continue;
        }

        if (!(item instanceof Array)) searchParams[key] = [item];

        searchParams[key].push(value);
    }

    return { ...data, searchParams };
}
