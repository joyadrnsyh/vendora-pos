/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";

declare module "@material-tailwind/react" {
  interface EventCapture {
    placeholder?: any;
    onPointerEnterCapture?: (e: React.PointerEvent<any>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<any>) => void;
    onResize?: (e: any) => void;
    onResizeCapture?: (e: any) => void;
  }

  export interface NavbarProps extends EventCapture {}
  export interface CollapseProps extends EventCapture {}
  export interface TypographyProps extends EventCapture {}
  export interface ButtonProps extends EventCapture {}
  export interface IconButtonProps extends EventCapture {}
  export interface ListProps extends EventCapture {}
  export interface ListItemProps extends EventCapture {}
  export interface MenuProps extends EventCapture {}
  export interface MenuHandlerProps extends EventCapture {}
  export interface MenuListProps extends EventCapture {}
  export interface MenuItemProps extends EventCapture {}
}
