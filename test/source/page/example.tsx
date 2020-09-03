import { createCell } from 'web-cell';
import { PageProps } from '../../../source';

export function NavBar() {
    return (
        <nav>
            <a href="test?a=1">Test</a>
            <a href="example?b=2">Example</a>
        </nav>
    );
}

export function TestPage({ path, params }: PageProps) {
    return (
        <ul>
            <li>Path: {path}</li>
            <li>Data: {JSON.stringify(params)}</li>
        </ul>
    );
}
