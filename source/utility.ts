import { JsxProps } from 'dom-renderer';

import { History } from './History';

export type IncludeText<Raw extends string, Sub extends string> = {
    [K in Raw]: K extends `${string}${Sub}${string}` ? K : never;
}[Raw];

export interface PageProps extends JsxProps<HTMLElement> {
    path: string;
    history: History;
    [key: string]: any;
}
