import { createCell } from 'web-cell';
import { PageProps } from '../../../dist';

export interface TestPageProps extends PageProps {
    edit: boolean;
}

export default function TestPage({ className, path, id, edit }: TestPageProps) {
    return (
        <ul className={`page ${className}`}>
            <li>Path: {path}</li>
            <li>Data: {JSON.stringify({ id, edit })}</li>
        </ul>
    );
}
