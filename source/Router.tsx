import { computed, observable } from 'mobx';
import {
    AnimateCSS,
    AnimationType,
    ClassComponent,
    FC,
    WebCell,
    WebCellProps,
    attribute,
    component,
    observer
} from 'web-cell';

import history, { History } from './History';
import { IncludeText, PageProps } from './utility';

export interface CellRouteProps extends WebCellProps {
    path: string;
    component: FC<PageProps> | ClassComponent;
    inAnimation?: IncludeText<AnimationType, 'In'>;
    outAnimation?: IncludeText<AnimationType, 'Out'>;
}

export interface CellRoute extends WebCell {}

@component({ tagName: 'cell-route' })
@observer
export class CellRoute extends HTMLElement implements WebCell {
    declare props: CellRouteProps;

    @attribute
    @observable
    accessor path: string;

    component: CellRouteProps['component'];

    @attribute
    @observable
    accessor inAnimation: CellRouteProps['inAnimation'] = 'fadeIn';

    @attribute
    @observable
    accessor outAnimation: CellRouteProps['outAnimation'] = 'fadeOut';

    @computed
    get matched() {
        return History.match(this.path, history.path);
    }

    @computed
    get oldMatched() {
        return History.match(this.path, history.oldPath);
    }

    pageStyle: WebCellProps['style'] = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%'
    };

    connectedCallback() {
        if (getComputedStyle(this.parentElement).position === 'static')
            this.parentElement.style.position = 'relative';
    }

    render() {
        const { pageStyle, inAnimation, outAnimation, matched, oldMatched } =
                this,
            Tag = this.component,
            { path, oldPath } = history;

        return matched ? (
            <AnimateCSS
                type={inAnimation}
                component={props => (
                    <Tag
                        {...props}
                        style={pageStyle}
                        {...matched}
                        {...History.dataOf(path)}
                        {...{ path, history }}
                    />
                )}
            />
        ) : oldMatched ? (
            <AnimateCSS
                type={outAnimation}
                component={props => (
                    <Tag
                        {...props}
                        style={pageStyle}
                        {...oldMatched}
                        {...History.dataOf(oldPath)}
                        path={oldPath}
                        history={history}
                    />
                )}
            />
        ) : (
            <></>
        );
    }
}
