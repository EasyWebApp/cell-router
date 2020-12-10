import { createCell } from 'web-cell';
import { PageProps } from '../../../source/utility';

export function NavBar() {
    return (
        <nav>
            <a href="test?a=1">Test</a>
            <a href="example?b=2">Example</a>
        </nav>
    );
}

export function TestPage({ path, history, defaultSlot, ...data }: PageProps) {
    return (
        <ul>
            <li>Path: {path}</li>
            <li>Data: {JSON.stringify(data)}</li>
        </ul>
    );
}
