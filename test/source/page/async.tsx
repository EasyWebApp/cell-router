import { FC } from 'web-cell';
import { PageProps } from '../../../source';

const AsyncPage: FC<PageProps> = ({ path, id, edit, ...props }) => (
    <div {...props}>
        <h1>Async</h1>
        <pre>
            <code>{JSON.stringify({ path, id, edit, ...props }, null, 4)}</code>
        </pre>
    </div>
);
export default AsyncPage;
