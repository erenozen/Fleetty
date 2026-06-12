# Fleetty Theme

This repository is a VS Code color theme extension generated from the three Fleet
theme JSON files:

- `Fleetty-Light.json`
- `Fleetty-Dark.json`
- `Fleetty-Dark-Purple.json`

The generator reads those source files and writes VS Code theme files to
`themes/`:

- `themes/fleetty-light-color-theme.json`
- `themes/fleetty-dark-color-theme.json`
- `themes/fleetty-dark-purple-color-theme.json`

Source color values are preserved; the generator only resolves existing palette
tokens and literal hex values into VS Code-compatible theme files.

## Build

```sh
npm run build
```

## Validate

```sh
npm run validate
```

## Try In VS Code

Open this folder in VS Code, press `F5`, then choose one of the Fleetty themes
from `Preferences: Color Theme` in the Extension Development Host window.

## Coverage

The generated themes include workbench colors, TextMate token scopes, and
semantic token mappings for common VS Code UI surfaces and language extensions.

## Manual Regression Fixture

Open the files in `test-fixtures/theme-regression/` in the Extension Development
Host to compare editor backgrounds and syntax tokens against Fleet. Use
`Developer: Inspect Editor Tokens and Scopes` on Python `if` to confirm it uses
the Fleet keyword color.
For HTML/CSS parity checks, open `privacy-policy.html` and inspect `--bg`,
`#0f1117`, `@media`, `:root`, `body`, `font-family`, and `<meta>`.

For screenshot comparisons against Fleet, open
`test-fixtures/theme-regression/fleet-comparison.code-workspace` or apply these
workspace settings:

```json
{
  "breadcrumbs.enabled": false,
  "editor.minimap.enabled": false
}
```

VS Code layout cannot be made identical to Fleet through a theme alone. Activity
bar placement, title bar controls, Explorer/Files structure, extension icons, and
some panel chrome are controlled by VS Code and installed extensions.

## Kotlin Highlighting

This theme includes Kotlin scope mappings, but VS Code still needs a Kotlin
language extension to tokenize `.kt` files. Install the `fwcd.kotlin` extension
if Kotlin files appear mostly uncolored in the Extension Development Host.
