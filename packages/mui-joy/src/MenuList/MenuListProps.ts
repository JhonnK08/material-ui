import * as React from 'react';
import { OverrideProps, OverridableStringUnion } from '@mui/types';
import { MenuUnstyledActions } from '@mui/base/MenuUnstyled';
import { ColorPaletteProp, VariantProp, SxProps, ApplyColorInversion } from '../styles/types';
import { SlotProps, CreateSlotsAndSlotProps } from '../utils/types';

export type MenuListSlot = 'root';

export interface MenuListSlots {
  /**
   * The component that renders the root.
   * @default 'ul'
   */
  root: React.ElementType;
}

export type MenuListSlotsAndSlotProps = CreateSlotsAndSlotProps<
  MenuListSlots,
  {
    root: SlotProps<'ul', {}, MenuListOwnerState>;
  }
>;

export interface MenuListPropsSizeOverrides {}
export interface MenuListPropsColorOverrides {}
export interface MenuListPropsVariantOverrides {}

export interface MenuActions extends MenuUnstyledActions {}

export interface MenuListTypeMap<P = {}, D extends React.ElementType = 'ul'> {
  props: P & {
    /**
     * A ref with imperative actions.
     * It allows to select the first or last menu item.
     */
    actions?: React.Ref<MenuUnstyledActions>;
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     * @default 'neutral'
     */
    color?: OverridableStringUnion<ColorPaletteProp, MenuListPropsColorOverrides>;
    /**
     * The size of the component (affect other nested list* components because the `Menu` inherits `List`).
     * @default 'md'
     */
    size?: OverridableStringUnion<'sm' | 'md' | 'lg', MenuListPropsSizeOverrides>;
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps;
    /**
     * The [global variant](https://mui.com/joy-ui/main-features/global-variants/) to use.
     * @default 'outlined'
     */
    variant?: OverridableStringUnion<VariantProp, MenuListPropsVariantOverrides>;
  } & MenuListSlotsAndSlotProps;
  defaultComponent: D;
}

export type MenuListProps<
  D extends React.ElementType = MenuListTypeMap['defaultComponent'],
  P = {
    component?: React.ElementType;
  },
> = OverrideProps<MenuListTypeMap<P, D>, D>;

export interface MenuListOwnerState extends ApplyColorInversion<MenuListProps> {}
