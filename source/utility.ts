import { JsxProps } from 'dom-renderer';

import { History } from './History';

export function watchStop<T extends HTMLElement | SVGElement>(
    root: T,
    targetSelector: string
) {
    return new Promise<MotionEvent>(resolve => {
        function end(event: MotionEvent) {
            if (!(event.target as Element).matches(targetSelector)) return;

            root.removeEventListener('transitionend', end);
            root.removeEventListener('transitioncancel', end);
            root.removeEventListener('animationend', end);
            root.removeEventListener('animationcancel', end);

            resolve(event);
        }

        root.addEventListener('transitionend', end);
        root.addEventListener('transitioncancel', end);
        root.addEventListener('animationend', end);
        root.addEventListener('animationcancel', end);
    });
}

export interface PageProps extends JsxProps<HTMLElement> {
    path: string;
    history: History;
    [key: string]: any;
}

export type MotionEvent = TransitionEvent | AnimationEvent;

export function nextTick() {
    return new Promise(resolve => self.requestAnimationFrame(resolve));
}
