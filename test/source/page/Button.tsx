import { FC, PropsWithChildren } from 'web-cell';

export const Button: FC<PropsWithChildren<{ href?: string }>> = ({
    children,
    ...props
}) => <a {...props}>{children}</a>;
