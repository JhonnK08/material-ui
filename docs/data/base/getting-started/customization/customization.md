# Customizing Base UI components

<p class="description">There are several ways to customize Base UI components, from applying custom CSS rules to building fully custom components using hooks.</p>

With Base UI, you have the freedom to decide how much you want to customize a component's structure and style.

## Styling the components

This section reviews several methods of customization that are available: applying custom CSS rules, overriding default subcomponent slots, customizing the slot props, and using hooks to build fully custom components.

### Which option to choose?

The multitude of options can be overwhelming, especially if you're new to Base UI.
How to decide which one to use, then?

The first decision to make is whether to use unstyled components or hooks.
Hooks are better suited for making component libraries that can be further customized.
For example, our own Joy UI is implemented using hooks from Base UI.
Hooks also serve as the basis for several Material UI components, and future versions of the library will use them even more extensively.

If you don't need to make your component library customizable (for instance, by exposing `slotProps`), then the unstyled components may be a better option thanks to their simplicity.

After choosing unstyled components, there is one more decision to make: how to style them.
The answer depends on the styling solution used in the project:

#### Plain CSS, Sass, Less

...or anything else that compiles to CSS:

You can either [style the components using the built-in classes](#applying-custom-css-rules) or [specify your own classes](#customizing-slot-props) and reference them in your stylesheets.

#### CSS Modules

When working with [CSS Modules](https://github.com/css-modules/css-modules), the simplest approach is to [specify custom classes using `slotProps`](#customizing-slot-props), as shown below:

```tsx
import clsx from 'clsx';
import classes from './styles.module.css';

export default function Switch(props) {
  const slotProps = {
    root: (ownerState: SwitchUnstyledOwnerState) => ({
      className: clsx(classes.root, {
        [classes.checked]: ownerState.checked,
        [classes.disabled]: ownerState.disabled,
      }),
    }),
    thumb: { className: classes.thumb },
    track: { className: classes.track },
    input: { className: classes.input },
  };

  return <SwitchUnstyled {...props} slotProps={slotProps} />;
}
```

In this example we're using the [clsx](https://www.npmjs.com/package/clsx) utility to reduce the effort needed to apply class names conditionally.

#### Tailwind CSS

Use [`slotProps`](#customizing-slot-props) to apply custom styles using [Tailwind CSS](https://www.tailwindcss.com/), as shown below:

```tsx
export default function Switch(props) {
  const slotProps = {
    root: (ownerState: SwitchUnstyledOwnerState) => ({
      className: `inline-block w-8 h-5 rounded-full cursor-pointer relative ${
        ownerState.checked ? 'bg-cyan-500' : 'bg-zinc-400'
      }`,
    }),
    thumb: (ownerState: SwitchUnstyledOwnerState) => ({
      className: `bg-white block w-3.5 h-3.5 rounded-full relative top-[3px] ${
        ownerState.checked ? 'left-[3px]' : 'left-[14px]'
      }`,
    }),
    input: { className: 'absolute w-full h-full inset-0 opacity-0 z-10 m-0' },
  };

  return <SwitchUnstyled {...props} slotProps={slotProps} />;
}
```

See our [Working with Tailwind CSS guide](/base/guides/working-with-tailwind-css/) for more information about integrating Base UI and Tailwind CSS.

#### Styled components

If you use a CSS-in-JS solution with a styled-components-like API (such as [MUI System](/system/getting-started/overview/) or [Emotion](https://emotion.sh/docs/introduction)), the best method is to provide the styled subcomponents using the [`slots` prop](#overriding-subcomponent-slots), as shown in the [demo below](#overriding-subcomponent-slots).

Alternatively, you can wrap the whole unstyled component in a `styled` utility and target the individual subcomponents using CSS classes:

{{"demo": "StylingSlotsSingleComponent.js", "defaultCodeOpen": true}}

---

### Applying custom CSS rules

If you're happy with the default structure of a component's rendered HTML, you can apply custom styles to the component's classes.

Each component has its own set of classes.
Some classes are **static**, which is to say that they are always present on the component.
Others are applied **conditionally**—like `Mui-disabled`, for example, which is only present when a component is disabled.

Each component's API documentation lists all classes that the component uses.
Additionally, you can import a `[componentName]Classes` object that describes all the classes a given component uses, as the following demo illustrates:

{{"demo": "StylingCustomCss.js", "defaultCodeOpen": true}}

If you don't use these classes, you can clean up the DOM by disabling them.
See [Disabling default CSS classes](#disabling-default-css-classes) for instructions.

### Overriding subcomponent slots

If you want to make changes to a component's rendered HTML structure, you can override the default subcomponents ("slots") using the `slots` and/or `component` prop—see ["Shared props" on the Base Usage page](/base/getting-started/usage/#shared-props) for more details.

The following demo uses [SwitchUnstyled](/base/react-switch/) to show how to create a styled component by applying styles to three of its subcomponent slots: `root`, `thumb`, and `input`.

Note that although this demo uses [MUI System](/system/styled/) as a styling solution, you are free to choose any alternative.

{{"demo": "StylingSlots.js"}}

The components you pass in the `slots` prop receive the `ownerState` prop from the top-level component (the "owner").
By convention, it contains all props passed to the owner, merged with its rendering state.

For example:

```jsx
<SwitchUnstyled slots={{ thumb: MyCustomThumb }} data-foo="42" />
```

In this case, `MyCustomThumb` component receives the `ownerState` object with the following data:

```ts
{
  checked: boolean;
  disabled: boolean;
  focusVisible: boolean;
  readOnly: boolean;
  'data-foo': string;
}
```

You can use this object to style your component.

### Customizing slot props

Use the `slotProps` prop to customize the inner component props.
The most common use case is setting a class name, but you can set any prop, including event handlers.

The following example shows how to add a custom class to two of the Unstyled Switch's slots:

```tsx
function Switch(props: SwitchUnstyledProps) {
  const slotProps: SwitchUnstyledProps['slotProps'] = {
    thumb: {
      className: 'my-thumb',
    },
    track: {
      className: 'my-track',
    },
  };

  return <SwitchUnstyled {...props} slotProps={slotProps} />;
}
```

The `switch:thumb` and `switch:class` are added unconditionally—they will always be present on the Switch component.

You may need to apply a class only when a component is in a particular state.
A good example is adding `on` and `off` classes to a Switch based on its checked state, as shown in the demo below:

{{"demo": "SlotPropsCallback.js", "defaultCodeOpen": true}}

Here, instead of an object with props, the root slot receives a callback function.
Its only parameter is `ownerState`, which is an object that describes the state of the "owner component"—the Unstyled Switch in this case.
The `ownerState` holds all the props of the owner component (with defaults applied where applicable) and is augmented with the internal state of the component.
In the case of the Unstyled Select, the additional information includes the `checked`, `disabled`, `focusVisible`, and `readOnly` boolean fields.

### Creating custom components using hooks

If you need complete control over a component's rendered HTML structure, you can build it with hooks.

Hooks give you access to the _logic_ that a component uses, but without any default structure.
See ["Components vs. hooks" on the Base Usage page](/base/getting-started/usage/#components-vs-hooks) for more details.

Hooks return the current state of the component (e.g. `checked`, `disabled`, `open`, etc.) and provide functions that return props you can apply to your fully custom components.

In the case of [SwitchUnstyled](/base/react-switch/), the component is accompanied by the `useSwitch` hook which gives you all of the functionality without any structure.

It returns the following object:

```ts
{
  checked: Readonly<boolean>;
  disabled: Readonly<boolean>;
  readOnly: Readonly<boolean>;
  focusVisible: Readonly<boolean>;
  getInputProps: (otherProps?: object) => SwitchInputProps;
}
```

The `checked`, `disabled`, `readOnly`, and `focusVisible` fields represent the state of the switch.
Use them to apply styling to your HTML elements.

The `getInputProps` function can be used to get the props to place on an HTML `<input>` to make the switch accessible.

{{"demo": "StylingHooks.js", "defaultCodeOpen": true}}

## Disabling default CSS classes

If you don't need the built-in classes on components, you may disable them.
This will clean up the DOM and can be useful especially if you apply your own classes or style components using a CSS-in-JS solution.
To do this, wrap your components in a ClassNameConfigurator component (imported from `@mui/base/utils`):

```tsx
<ClassNameConfigurator disableDefaultClasses>
  <ButtonUnstyled>I'm classless!</ButtonUnstyled>
</ClassNameConfigurator>
```

Inspect the elements in the following demo to see the difference:

{{"demo": "DisabledDefaultClasses.js"}}
