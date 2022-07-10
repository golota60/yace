import { css } from "@emotion/css";
import clsx from "clsx";
import React from "react";

/**
 * This is a generic <Layout /> component that is to be used throughout the whole app.
 * It obviously doesn't have all the functionalities of all displays - please add functionalities to this component instead of creating your own styled wrappers(unless they are a very specific case).
 * If you want to pass a ref, use the underlying components e.g. <Layout.Grid /> or <Layout.Flex />
 */

type FlexVals = "center" | "flex-start" | "flex-end";
type DisplayVals = "flex" | "block" | "grid"; // | "inline-flex" | "inline-block";
type FlexDirection =
  | "flex-row"
  | "flex-col"
  | "flex-row-reverse"
  | "flex-col-reverse";

interface GenericProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode;
  justify?: FlexVals;
  align?: FlexVals;
  direction?: FlexDirection;
}

/**
 * @memberof Layout
 */
const Block = React.forwardRef(
  ({ className, ...props }: GenericProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={clsx(
          css`
            display: block;
          `,
          className
        )}
        {...props}
      />
    );
  }
);

/**
 * @memberof Layout
 */
const Flex = React.forwardRef(
  ({ className, ...props }: GenericProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={clsx(
          css`
            display: flex;
          `,
          className
        )}
        {...props}
      />
    );
  }
);

/**
 * @memberof Layout
 */
const Grid = React.forwardRef(
  ({ className, ...props }: GenericProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        className={clsx(
          css`
            display: grid;
          `,
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

interface LayoutProps extends GenericProps {
  display?: DisplayVals;
}

function Layout({ display = "block", ...props }: LayoutProps) {
  switch (display) {
    case "flex":
      return <Flex {...props} />;
    case "block":
      return <Block {...props} />;
    case "grid":
      return <Grid {...props} />;
    default:
      return null;
  }
}

Layout.Block = Block;
Layout.Flex = Flex;
Layout.Grid = Grid;

export default Layout;
