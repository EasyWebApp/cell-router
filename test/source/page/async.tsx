import { FC } from 'web-cell';
import { PageProps } from '../../../source';

const AsyncPage: FC<PageProps> = props => (
    <div className={`page ${props.className}`}>
        <h1>Async</h1>
        <pre>
            <code>{JSON.stringify(props, null, 4)}</code>
        </pre>
    </div>
);
export default AsyncPage;
