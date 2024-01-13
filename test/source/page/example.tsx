import { FC } from 'web-cell';
import { PageProps } from '../../../source';

export interface TestPageProps extends PageProps {
    edit: boolean;
}

export const TestPage: FC<TestPageProps> = ({ path, id, edit, ...props }) => (
    <ul {...props}>
        <li>Path: {path}</li>
        <li>Data: {JSON.stringify({ id, edit })}</li>
    </ul>
);
