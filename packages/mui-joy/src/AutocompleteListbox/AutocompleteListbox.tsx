import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { OverridableComponent } from '@mui/types';
import { unstable_capitalize as capitalize } from '@mui/utils';
import composeClasses from '@mui/base/composeClasses';
import { StyledList } from '../List/List';
import { styled, useThemeProps } from '../styles';
import { getAutocompleteListboxUtilityClass } from './autocompleteListboxClasses';
import {
  AutocompleteListboxOwnerState,
  AutocompleteListboxTypeMap,
} from './AutocompleteListboxProps';
import listItemClasses from '../ListItem/listItemClasses';
import listClasses from '../List/listClasses';
import { scopedVariables } from '../List/ListProvider';
import { useColorInversion } from '../styles/ColorInversion';
import useSlot from '../utils/useSlot';

const useUtilityClasses = (ownerState: AutocompleteListboxOwnerState) => {
  const { variant, color, size } = ownerState;
  const slots = {
    root: [
      'root',
      variant && `variant${capitalize(variant)}`,
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
    ],
  };

  return composeClasses(slots, getAutocompleteListboxUtilityClass, {});
};

const excludePopperProps = <T extends Record<string, any>>({
  anchorEl,
  direction,
  disablePortal,
  modifiers,
  open,
  placement,
  popperOptions,
  popperRef,
  TransitionProps,
  ...other
}: T) => other;

export const StyledAutocompleteListbox = styled(StyledList)<{
  ownerState: AutocompleteListboxOwnerState;
}>(({ theme, ownerState }) => {
  const variantStyle = theme.variants[ownerState.variant!]?.[ownerState.color!];
  return {
    '--focus-outline-offset': `calc(${theme.vars.focus.thickness} * -1)`, // to prevent the focus outline from being cut by overflow
    '--List-radius': theme.vars.radius.sm,
    '--ListItem-stickyBackground':
      variantStyle?.backgroundColor ||
      variantStyle?.background ||
      theme.vars.palette.background.popup,
    '--ListItem-stickyTop': 'calc(var(--List-padding, var(--ListDivider-gap)) * -1)',
    ...scopedVariables,
    boxShadow: theme.shadow.md,
    ...(!variantStyle?.backgroundColor && {
      backgroundColor: theme.vars.palette.background.popup,
    }),
    zIndex: theme.vars.zIndex.popup,
    overflow: 'auto',
    maxHeight: '40vh',
    position: 'relative', // to make sure that the listbox is positioned for grouped options to work.
    '&:empty': {
      visibility: 'hidden',
    },
    [`& .${listItemClasses.nested}, & .${listItemClasses.nested} .${listClasses.root}`]: {
      // For grouped options autocomplete:
      // Force the position to make the scroll into view logic works because the `element.offsetTop` should reference to the listbox, not the grouped list.
      // See the implementation of the `useAutocomplete` line:370
      //
      // Resource: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop
      position: 'initial',
    },
  };
});

const AutocompleteListboxRoot = styled(StyledAutocompleteListbox, {
  name: 'JoyAutocompleteListbox',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});
/**
 *
 * Demos:
 *
 * - [Autocomplete](https://mui.com/joy-ui/react-autocomplete/)
 *
 * API:
 *
 * - [AutocompleteListbox API](https://mui.com/joy-ui/api/autocomplete-listbox/)
 */
const AutocompleteListbox = React.forwardRef(function AutocompleteListbox(inProps, ref) {
  const props = useThemeProps<typeof inProps & { component?: React.ElementType }>({
    props: inProps,
    name: 'JoyAutocompleteListbox',
  });

  const {
    children,
    className,
    component,
    color: colorProp = 'neutral',
    variant = 'outlined',
    size = 'md',
    ...otherProps
  } = props;
  const { getColor } = useColorInversion(variant);
  const color = getColor(inProps.color, colorProp);

  const ownerState = {
    ...props,
    size,
    color,
    variant,
    nesting: false,
    row: false,
    wrap: false,
  };

  const other = excludePopperProps(otherProps);

  const classes = useUtilityClasses(ownerState);

  const [SlotRoot, rootProps] = useSlot('root', {
    ref,
    className: clsx(classes.root, className),
    elementType: AutocompleteListboxRoot,
    externalForwardedProps: { ...other, component },
    ownerState,
    additionalProps: {
      role: 'listbox',
    },
  });

  return <SlotRoot {...rootProps}>{children}</SlotRoot>;
}) as OverridableComponent<AutocompleteListboxTypeMap>;

AutocompleteListbox.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'neutral'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'info', 'neutral', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The size of the component (affect other nested list* components).
   * @default 'md'
   */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The [global variant](https://mui.com/joy-ui/main-features/global-variants/) to use.
   * @default 'outlined'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['contained', 'light', 'outlined', 'text']),
    PropTypes.string,
  ]),
} as any;

export default AutocompleteListbox;
