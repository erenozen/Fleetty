# Fleetty Theme

This repository is a VS Code color theme extension generated from the three Fleet
theme JSON files:

- `light-edited.json`
- `dark-edited.json`
- `dark_purple-edited.json`

The source JSON files are not edited by the generator. Generated VS Code theme
files are written to `themes/`.

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

## Kotlin Highlighting

This theme includes Kotlin scope mappings, but VS Code still needs a Kotlin
language extension to tokenize `.kt` files. Install the `fwcd.kotlin` extension
if Kotlin files appear mostly uncolored in the Extension Development Host.
