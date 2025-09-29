import { FC, observer } from 'web-cell';
import { sleep } from 'web-utility';
import { PageProps } from '../../../source';

export interface TestPageProps extends PageProps {
    edit: boolean;
}

export const SyncPage: FC<TestPageProps> = ({ path, id, edit, ...props }) => (
    <ul {...props}>
        <li>Path: {path}</li>
        <li>Data: {JSON.stringify({ id, edit })}</li>
    </ul>
);

export const AsyncPage: FC<TestPageProps> = observer(async props => {
    await sleep();

    return (
        <div {...props}>
            <h1>Async</h1>
            <pre>
                <code>{JSON.stringify(props, null, 4)}</code>
            </pre>
        </div>
    );
});
