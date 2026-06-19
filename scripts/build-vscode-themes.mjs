#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

// `type` here is the color-theme file's "type" field, whose valid values are
// "light" | "dark" | "hcLight" | "hcDark" (NOT the package.json `uiTheme` values
// "vs"/"vs-dark"). It tells VS Code which base defaults to use for any unspecified
// colors. The package.json contributes.themes `uiTheme` is a separate concern.
const sources = [
  {
    source: "Fleetty-Light.json",
    output: "themes/fleetty-light-color-theme.json",
    type: "light"
  },
  {
    source: "Fleetty-Dark.json",
    output: "themes/fleetty-dark-color-theme.json",
    type: "dark"
  },
  {
    source: "Fleetty-Dark-Purple.json",
    output: "themes/fleetty-dark-purple-color-theme.json",
    type: "dark"
  }
];

const workbenchMappings = [
  ["focusBorder", ["border.focused"]],
  ["foreground", ["text.primary"]],
  ["descriptionForeground", ["text.secondary"]],
  ["disabledForeground", ["text.disabled"]],
  ["errorForeground", ["text.dangerous"]],
  ["icon.foreground", ["icon.primary", "text.primary"]],
  ["selection.background", ["inputField.selectionBackground.default", "editor.currentLine.background.focused"]],
  ["textLink.foreground", ["link.text.default", "completion.match.text"]],
  ["textLink.activeForeground", ["link.text.visited", "link.text.default", "completion.match.text"]],
  ["textSeparator.foreground", ["separator.default", "border"]],
  ["textBlockQuote.background", ["banner.inline.background", "banner.background.inline", "background.secondary"]],
  ["textBlockQuote.border", ["banner.inline.border", "border"]],
  ["textCodeBlock.background", ["shortcut.background", "background.secondary"]],

  ["window.activeBorder", ["border.focused"]],
  ["window.inactiveBorder", ["border"]],

  ["activityBar.background", ["background.primary"]],
  ["activityBar.foreground", ["text.primary"]],
  ["activityBar.inactiveForeground", ["text.secondary"]],
  ["activityBar.border", ["border"]],
  ["activityBar.activeBorder", ["border.focused"]],
  ["activityBar.activeBackground", ["listItem.background.selected", "background.primary"]],
  ["activityBarBadge.background", ["button.primary.background.default"]],
  ["activityBarBadge.foreground", ["button.primary.text.default"]],

  ["sideBar.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["sideBar.foreground", ["text.primary"]],
  ["sideBar.border", ["border"]],
  ["sideBarTitle.foreground", ["text.primary"]],
  ["sideBarSectionHeader.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["sideBarSectionHeader.foreground", ["text.primary"]],
  ["sideBarSectionHeader.border", ["border"]],

  ["editorGroup.border", ["border"]],
  ["editorGroup.dropBackground", ["dragAndDrop.background"]],
  ["editorGroupHeader.tabsBackground", ["background.primary"]],
  ["editorGroupHeader.noTabsBackground", ["background.primary"]],
  ["editorGroupHeader.tabsBorder", ["border"]],
  ["editorGroupHeader.border", ["border"]],

  ["tab.activeBackground", ["tab.background.selectedFocused", "tab.background.selected"]],
  ["tab.unfocusedActiveBackground", ["tab.background.selected"]],
  ["tab.inactiveBackground", ["tab.background.default"]],
  ["tab.unfocusedInactiveBackground", ["tab.background.default"]],
  ["tab.hoverBackground", ["tab.background.hovered"]],
  ["tab.unfocusedHoverBackground", ["tab.background.hovered"]],
  ["tab.activeForeground", ["tab.text.selectedFocused", "tab.text.selected"]],
  ["tab.inactiveForeground", ["tab.text.default"]],
  ["tab.unfocusedActiveForeground", ["tab.text.selected"]],
  ["tab.unfocusedInactiveForeground", ["tab.hint.default", "text.secondary"]],
  ["tab.border", ["tab.border.default"]],
  ["tab.activeBorder", ["tab.border.selectedFocused", "tab.border.selected"]],
  ["tab.unfocusedActiveBorder", ["tab.border.selected"]],
  ["tab.hoverBorder", ["tab.border.hovered"]],
  ["tab.activeModifiedBorder", ["settings.modified.indicator", "editor.gitDiff.text.modified"]],
  ["tab.inactiveModifiedBorder", ["settings.modified.indicator", "editor.gitDiff.text.modified"]],

  ["titleBar.activeBackground", ["background.primary"]],
  ["titleBar.activeForeground", ["text.primary"]],
  ["titleBar.inactiveBackground", ["background.primary"]],
  ["titleBar.inactiveForeground", ["text.secondary"]],
  ["titleBar.border", ["border"]],

  ["statusBar.background", ["background.primary"]],
  ["statusBar.foreground", ["statusBar.text.default", "text.primary"]],
  ["statusBar.border", ["border"]],
  ["statusBar.debuggingBackground", ["button.warning.background.default"]],
  ["statusBar.debuggingForeground", ["button.warning.text.default"]],
  ["statusBar.noFolderBackground", ["background.primary", "button.secondary.background.default"]],
  ["statusBar.noFolderForeground", ["statusBar.text.default", "text.primary"]],
  ["statusBarItem.hoverBackground", ["ghostButton.off.background.hovered", "listItem.background.hovered"]],
  ["statusBarItem.remoteBackground", ["button.primary.background.default"]],
  ["statusBarItem.remoteForeground", ["button.primary.text.default"]],
  ["statusBarItem.errorBackground", ["button.dangerous.background.default"]],
  ["statusBarItem.errorForeground", ["button.dangerous.text.default"]],
  ["statusBarItem.warningBackground", ["button.warning.background.default"]],
  ["statusBarItem.warningForeground", ["button.warning.text.default"]],

  ["panel.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["panel.border", ["border"]],
  ["panelTitle.activeForeground", ["text.primary"]],
  ["panelTitle.inactiveForeground", ["text.secondary"]],
  ["panelTitle.activeBorder", ["border.focused"]],
  ["panelInput.border", ["inputField.border.default", "border"]],
  ["panelSection.border", ["border"]],
  ["panelSectionHeader.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["panelSectionHeader.foreground", ["text.primary"]],
  ["panelSectionHeader.border", ["border"]],

  ["breadcrumb.foreground", ["text.secondary"]],
  ["breadcrumb.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["breadcrumb.focusForeground", ["text.primary"]],
  ["breadcrumb.activeSelectionForeground", ["text.primary"]],
  ["breadcrumbPicker.background", ["popup.background"]],

  ["list.activeSelectionBackground", ["listItem.background.selected"]],
  ["list.activeSelectionForeground", ["listItem.text.selected"]],
  ["list.inactiveSelectionBackground", ["listItem.background.selected", "listItem.background.focused"]],
  ["list.inactiveSelectionForeground", ["listItem.text.focused", "listItem.text.selected"]],
  ["list.focusBackground", ["listItem.background.selected", "listItem.background.focused"]],
  ["list.focusForeground", ["listItem.text.focused"]],
  ["list.hoverBackground", ["listItem.background.hovered"]],
  ["list.hoverForeground", ["listItem.text.hovered"]],
  ["list.dropBackground", ["dragAndDrop.background"]],
  ["list.highlightForeground", ["completion.match.text"]],
  ["list.focusHighlightForeground", ["completion.match.text"]],
  ["list.invalidItemForeground", ["text.dangerous"]],
  ["list.warningForeground", ["banner.border.warning"]],
  ["list.errorForeground", ["text.dangerous"]],
  ["listFilterWidget.background", ["popup.background"]],
  ["listFilterWidget.outline", ["border.focused"]],
  ["listFilterWidget.noMatchesOutline", ["button.dangerous.border.default"]],
  ["listFilterWidget.shadow", ["shadow.background.medium"]],
  ["tree.indentGuidesStroke", ["tree.compactFolder.separator", "border"]],
  ["tree.tableColumnsBorder", ["border"]],
  ["tree.tableOddRowsBackground", ["listItem.background.hovered", "background.secondary"]],

  ["input.background", ["inputField.background.default"]],
  ["input.foreground", ["inputField.text.default"]],
  ["input.border", ["inputField.border.default"]],
  ["input.placeholderForeground", ["inputField.hint.default"]],
  ["inputOption.activeBackground", ["toggleButton.on.background.default", "button.secondary.background.hovered"]],
  ["inputOption.activeForeground", ["toggleButton.on.text.default", "text.primary"]],
  ["inputOption.activeBorder", ["toggleButton.on.border.default", "border.focused"]],
  ["inputValidation.errorBackground", ["layout.error", "inputField.background.error", "banner.background.dangerous"]],
  ["inputValidation.errorForeground", ["inputField.text.error", "text.dangerous"]],
  ["inputValidation.errorBorder", ["inputField.border.error"]],
  ["inputValidation.warningBackground", ["banner.background.warning"]],
  ["inputValidation.warningForeground", ["banner.text", "text.primary"]],
  ["inputValidation.warningBorder", ["banner.border.warning"]],
  ["inputValidation.infoBackground", ["banner.background.info"]],
  ["inputValidation.infoForeground", ["banner.text", "text.primary"]],
  ["inputValidation.infoBorder", ["banner.border.info"]],

  ["dropdown.background", ["dropdown.background.default"]],
  ["dropdown.foreground", ["dropdown.text.default"]],
  ["dropdown.border", ["dropdown.border.default"]],
  ["dropdown.listBackground", ["popup.background", "dropdown.background.default"]],

  ["button.background", ["button.primary.background.default"]],
  ["button.foreground", ["button.primary.text.default"]],
  ["button.hoverBackground", ["button.primary.background.hovered"]],
  ["button.border", ["button.primary.border.default"]],
  ["button.secondaryBackground", ["button.secondary.background.default"]],
  ["button.secondaryForeground", ["button.secondary.text.default"]],
  ["button.secondaryHoverBackground", ["button.secondary.background.hovered"]],
  ["checkbox.background", ["checkbox.off.background.default"]],
  ["checkbox.foreground", ["checkbox.text.default"]],
  ["checkbox.border", ["checkbox.off.border.default"]],
  ["checkbox.selectBackground", ["checkbox.on.background.default"]],
  ["checkbox.selectBorder", ["checkbox.on.border.default"]],

  ["badge.background", ["tag.color.default.neutral.background", "button.primary.background.default"]],
  ["badge.foreground", ["tag.color.default.neutral.text", "button.primary.text.default"]],
  ["progressBar.background", ["progressBar.indeterminate.foreground", "progressBar.determinate.foreground"]],

  ["scrollbar.shadow", ["shadow.background.small"]],
  ["scrollbarSlider.background", ["scrollbar.thumb.default"]],
  ["scrollbarSlider.hoverBackground", ["scrollbar.thumb.hovered"]],
  ["scrollbarSlider.activeBackground", ["scrollbar.thumb.pressed"]],

  ["editor.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editor.foreground", ["editor.text", "text.primary"]],
  ["editorLineNumber.foreground", ["editor.lineNumber.default"]],
  ["editorLineNumber.activeForeground", ["editor.lineNumber.current"]],
  ["editorCursor.foreground", ["editor.caret.border", "editor.caret.background"]],
  ["editorCursor.background", ["editor.caret.background"]],
  ["editor.selectionBackground", ["editor.selection.focused", "editor.currentLine.background.focused"]],
  ["editor.inactiveSelectionBackground", ["editor.selection", "editor.currentLine.background.default"]],
  ["editor.selectionHighlightBackground", ["editor.currentLine.background.focused"]],
  ["editor.wordHighlightBackground", ["identifier.underCaret", "editor.currentLine.background.default"]],
  ["editor.wordHighlightStrongBackground", ["identifier.underCaret", "editor.currentLine.background.focused"]],
  ["editor.findMatchBackground", ["search.match.background"]],
  ["editor.findMatchForeground", ["search.match.text"]],
  ["editor.findMatchHighlightBackground", ["editor.search.results", "search.match.background"]],
  ["editor.findRangeHighlightBackground", ["editor.currentLine.background.default"]],
  ["editor.hoverHighlightBackground", ["editor.currentLine.background.focused"]],
  ["editor.lineHighlightBackground", ["editor.currentLine.background.focused", "editor.currentLine.background.default"]],
  ["editor.lineHighlightBorder", ["editor.currentLine.background.focused", "border"]],
  ["editorWhitespace.foreground", ["editor.whitespaceIndicator"]],
  ["editorIndentGuide.background1", ["editor.indentGuide"]],
  ["editorIndentGuide.activeBackground1", ["editor.indentGuide.current"]],
  ["editorRuler.foreground", ["border"]],
  ["editorBracketMatch.background", ["editor.brace.match"]],
  ["editorBracketMatch.border", ["border.focused"]],
  ["editorCodeLens.foreground", ["text.tertiary"]],
  ["editorLink.activeForeground", ["link.text.default", "completion.match.text"]],

  ["editorOverviewRuler.border", ["border"]],
  ["editorOverviewRuler.findMatchForeground", ["search.match.background"]],
  ["editorOverviewRuler.rangeHighlightForeground", ["editor.currentLine.scrollbarMark"]],
  ["editorOverviewRuler.selectionHighlightForeground", ["editor.currentLine.scrollbarMark"]],
  ["editorOverviewRuler.wordHighlightForeground", ["editor.currentLine.scrollbarMark"]],
  ["editorOverviewRuler.wordHighlightStrongForeground", ["editor.currentLine.scrollbarMark"]],
  ["editorOverviewRuler.modifiedForeground", ["editor.gitDiff.background.modified"]],
  ["editorOverviewRuler.addedForeground", ["editor.gitDiff.background.added"]],
  ["editorOverviewRuler.deletedForeground", ["editor.gitDiff.background.deleted"]],
  ["editorOverviewRuler.errorForeground", ["layout.error", "button.dangerous.background.default"]],
  ["editorOverviewRuler.warningForeground", ["button.warning.background.default"]],
  ["editorOverviewRuler.infoForeground", ["button.primary.background.default"]],

  ["editorGutter.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editorGutter.modifiedBackground", ["editor.gitDiff.background.modified"]],
  ["editorGutter.addedBackground", ["editor.gitDiff.background.added"]],
  ["editorGutter.deletedBackground", ["editor.gitDiff.background.deleted"]],
  ["editorGutter.commentRangeForeground", ["text.tertiary"]],
  ["editorGutter.foldingControlForeground", ["editor.foldIndicator.icon.default"]],

  ["editorError.foreground", ["problemsWidget.tag.error.text.default", "text.dangerous"]],
  ["editorError.background", ["problemsWidget.card.expanded.error.background", "banner.background.dangerous"]],
  ["editorError.border", ["problemsWidget.card.expanded.error.border", "banner.border.dangerous"]],
  ["editorWarning.foreground", ["problemsWidget.tag.warning.text.default", "banner.border.warning"]],
  ["editorWarning.background", ["problemsWidget.card.expanded.warning.background", "banner.background.warning"]],
  ["editorWarning.border", ["problemsWidget.card.expanded.warning.border", "banner.border.warning"]],
  ["editorInfo.foreground", ["button.primary.background.default"]],
  ["editorInfo.background", ["banner.background.info"]],
  ["editorInfo.border", ["banner.border.info"]],
  ["editorHint.foreground", ["text.secondary"]],
  ["editorUnnecessaryCode.opacity", ["text.disabled"]],
  ["editorUnnecessaryCode.border", ["text.disabled"]],

  ["diffEditor.insertedTextBackground", ["diff.added.word"]],
  ["diffEditor.removedTextBackground", ["diff.deleted.word"]],
  ["diffEditor.insertedLineBackground", ["diff.added"]],
  ["diffEditor.removedLineBackground", ["diff.deleted"]],
  ["diffEditor.border", ["border"]],
  ["diffEditor.diagonalFill", ["border"]],
  ["diffEditorOverview.insertedForeground", ["editor.gitDiff.background.added"]],
  ["diffEditorOverview.removedForeground", ["editor.gitDiff.background.deleted"]],

  ["gitDecoration.addedResourceForeground", ["editor.gitDiff.text.added"]],
  ["gitDecoration.modifiedResourceForeground", ["editor.gitDiff.text.modified"]],
  ["gitDecoration.deletedResourceForeground", ["editor.gitDiff.text.deleted"]],
  ["gitDecoration.renamedResourceForeground", ["editor.gitDiff.text.modified"]],
  ["gitDecoration.stageModifiedResourceForeground", ["editor.gitDiff.text.modified"]],
  ["gitDecoration.stageDeletedResourceForeground", ["editor.gitDiff.text.deleted"]],
  ["gitDecoration.untrackedResourceForeground", ["editor.gitDiff.text.added"]],
  ["gitDecoration.ignoredResourceForeground", ["text.disabled"]],
  ["gitDecoration.conflictingResourceForeground", ["editor.gitDiff.text.conflict"]],
  ["gitDecoration.submoduleResourceForeground", ["text.secondary"]],

  ["peekView.border", ["border.focused"]],
  ["peekViewEditor.background", ["popup.editor.background", "background.secondary"]],
  ["peekViewEditor.matchHighlightBackground", ["search.match.background"]],
  ["peekViewResult.background", ["popup.background"]],
  ["peekViewResult.fileForeground", ["text.primary"]],
  ["peekViewResult.lineForeground", ["text.secondary"]],
  ["peekViewResult.matchHighlightBackground", ["search.match.background"]],
  ["peekViewResult.selectionBackground", ["listItem.background.selected"]],
  ["peekViewResult.selectionForeground", ["listItem.text.selected"]],
  ["peekViewTitle.background", ["popup.background"]],
  ["peekViewTitleDescription.foreground", ["text.secondary"]],
  ["peekViewTitleLabel.foreground", ["text.primary"]],

  ["quickInput.background", ["popup.background"]],
  ["quickInput.foreground", ["popup.text", "text.primary"]],
  ["quickInputTitle.background", ["popup.goto.background", "popup.footer.background", "background.secondary"]],
  ["quickInputList.focusBackground", ["listItem.background.focused"]],
  ["quickInputList.focusForeground", ["listItem.text.focused"]],
  ["quickInputList.focusIconForeground", ["icon.primary", "text.primary"]],
  ["pickerGroup.border", ["border"]],
  ["pickerGroup.foreground", ["text.secondary"]],
  ["keybindingLabel.background", ["shortcut.background"]],
  ["keybindingLabel.foreground", ["shortcut.text"]],
  ["keybindingLabel.border", ["border"]],
  ["keybindingLabel.bottomBorder", ["shadow.border", "border"]],

  ["menu.background", ["popup.background"]],
  ["menu.foreground", ["popup.text", "text.primary"]],
  ["menu.selectionBackground", ["listItem.background.selected"]],
  ["menu.selectionForeground", ["listItem.text.selected"]],
  ["menu.selectionBorder", ["listItem.border.selected"]],
  ["menu.separatorBackground", ["popup.separator", "separator.default"]],
  ["menu.border", ["popup.border"]],
  ["menubar.selectionBackground", ["listItem.background.hovered"]],
  ["menubar.selectionForeground", ["listItem.text.hovered"]],
  ["menubar.selectionBorder", ["listItem.border.hovered"]],

  ["notificationCenter.border", ["border"]],
  ["notificationCenterHeader.background", ["notification.background.default"]],
  ["notificationCenterHeader.foreground", ["notification.text.primary"]],
  ["notificationToast.border", ["toast.border"]],
  ["notifications.background", ["notification.background.default"]],
  ["notifications.foreground", ["notification.text.primary"]],
  ["notifications.border", ["notification.separator", "border"]],
  ["notificationLink.foreground", ["link.text.default"]],
  ["notificationsErrorIcon.foreground", ["text.dangerous"]],
  ["notificationsWarningIcon.foreground", ["banner.border.warning"]],
  ["notificationsInfoIcon.foreground", ["button.primary.background.default"]],

  ["editorWidget.background", ["popup.background"]],
  ["editorWidget.foreground", ["popup.text", "text.primary"]],
  ["editorWidget.border", ["popup.border"]],
  ["editorWidget.resizeBorder", ["highlight.resize.border.edge.hovered", "border.focused"]],
  ["editorSuggestWidget.background", ["popup.background"]],
  ["editorSuggestWidget.foreground", ["popup.text", "text.primary"]],
  ["editorSuggestWidget.border", ["popup.border"]],
  ["editorSuggestWidget.highlightForeground", ["completion.match.text"]],
  ["editorSuggestWidget.selectedBackground", ["listItem.background.selected"]],
  ["editorSuggestWidget.selectedForeground", ["listItem.text.selected"]],
  ["editorHoverWidget.background", ["tooltip.background", "popup.background"]],
  ["editorHoverWidget.foreground", ["tooltip.text.primary", "popup.text"]],
  ["editorHoverWidget.border", ["tooltip.border", "popup.border"]],
  ["editorMarkerNavigation.background", ["popup.background"]],
  ["editorMarkerNavigationError.background", ["button.dangerous.background.default"]],
  ["editorMarkerNavigationWarning.background", ["button.warning.background.default"]],
  ["editorMarkerNavigationInfo.background", ["button.primary.background.default"]],

  ["terminal.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["terminal.foreground", ["text.primary"]],
  ["terminal.selectionBackground", ["editor.selection.focused"]],
  ["terminalCursor.foreground", ["editor.caret.border", "editor.caret.background"]],
  ["terminalCursor.background", ["editor.caret.background"]],
  ["terminal.border", ["border"]],
  ["terminalCommandDecoration.defaultBackground", ["text.tertiary"]],
  ["terminalCommandDecoration.successBackground", ["text.positive"]],
  ["terminalCommandDecoration.errorBackground", ["text.dangerous"]],

  ["terminal.ansiBlack", ["terminal.ansiColors.foreground.ansiBlack"]],
  ["terminal.ansiRed", ["terminal.ansiColors.foreground.ansiRed"]],
  ["terminal.ansiGreen", ["terminal.ansiColors.foreground.ansiGreen"]],
  ["terminal.ansiYellow", ["terminal.ansiColors.foreground.ansiYellow"]],
  ["terminal.ansiBlue", ["terminal.ansiColors.foreground.ansiBlue"]],
  ["terminal.ansiMagenta", ["terminal.ansiColors.foreground.ansiMagenta"]],
  ["terminal.ansiCyan", ["terminal.ansiColors.foreground.ansiCyan"]],
  ["terminal.ansiWhite", ["terminal.ansiColors.foreground.ansiWhite"]],
  ["terminal.ansiBrightBlack", ["terminal.ansiColors.foreground.ansiBrightBlack"]],
  ["terminal.ansiBrightRed", ["terminal.ansiColors.foreground.ansiBrightRed"]],
  ["terminal.ansiBrightGreen", ["terminal.ansiColors.foreground.ansiBrightGreen"]],
  ["terminal.ansiBrightYellow", ["terminal.ansiColors.foreground.ansiBrightYellow"]],
  ["terminal.ansiBrightBlue", ["terminal.ansiColors.foreground.ansiBrightBlue"]],
  ["terminal.ansiBrightMagenta", ["terminal.ansiColors.foreground.ansiBrightMagenta"]],
  ["terminal.ansiBrightCyan", ["terminal.ansiColors.foreground.ansiBrightCyan"]],
  ["terminal.ansiBrightWhite", ["terminal.ansiColors.foreground.ansiBrightWhite"]],

  ["settings.headerForeground", ["text.primary"]],
  ["settings.modifiedItemIndicator", ["settings.modified.indicator"]],
  ["settings.dropdownBackground", ["dropdown.background.default"]],
  ["settings.dropdownForeground", ["dropdown.text.default"]],
  ["settings.dropdownBorder", ["dropdown.border.default"]],
  ["settings.dropdownListBorder", ["popup.border"]],
  ["settings.checkboxBackground", ["checkbox.off.background.default"]],
  ["settings.checkboxForeground", ["checkbox.text.default"]],
  ["settings.checkboxBorder", ["checkbox.off.border.default"]],
  ["settings.textInputBackground", ["inputField.background.default"]],
  ["settings.textInputForeground", ["inputField.text.default"]],
  ["settings.textInputBorder", ["inputField.border.default"]],
  ["settings.numberInputBackground", ["inputField.background.default"]],
  ["settings.numberInputForeground", ["inputField.text.default"]],
  ["settings.numberInputBorder", ["inputField.border.default"]],
  ["settings.focusedRowBackground", ["listItem.background.focused"]],
  ["settings.rowHoverBackground", ["listItem.background.hovered"]],
  ["settings.focusedRowBorder", ["listItem.border.focused"]],
  ["settings.headerBorder", ["border"]],
  ["settings.sashBorder", ["border"]]
];

const additionalWorkbenchMappings = [
  ["widget.border", ["popup.border", "border"]],
  ["widget.shadow", ["shadow.background.medium", "shadow.background.small"]],
  ["sash.hoverBorder", ["border.focused"]],
  ["textPreformat.foreground", ["text.primary"]],
  // Inline `code` / fenced code blocks in rendered markdown (hovers, previews, chat) need a
  // chip that stands out on any surface. Use Fleet's translucent keycap background instead of
  // snippet.content.background, which resolved to the same color as the surrounding surface.
  ["textPreformat.background", ["shortcut.background", "background.secondary"]],
  ["textPreformat.border", ["snippet.content.border", "border"]],

  ["toolbar.hoverBackground", ["ghostButton.off.background.hovered", "button.secondary.background.hovered"]],
  ["toolbar.hoverOutline", ["border.focused"]],
  ["toolbar.activeBackground", ["ghostButton.off.background.pressed", "button.secondary.background.pressed"]],
  ["editorActionList.background", ["popup.background"]],
  ["editorActionList.foreground", ["popup.text", "text.primary"]],
  ["editorActionList.focusForeground", ["listItem.text.focused", "text.primary"]],
  ["editorActionList.focusBackground", ["listItem.background.focused"]],

  ["button.separator", ["button.primary.separator.default"]],
  ["button.secondaryBorder", ["button.secondary.border.default", "border"]],
  ["checkbox.disabled.background", ["checkbox.off.background.disabled", "checkbox.on.background.disabled"]],
  ["checkbox.disabled.foreground", ["checkbox.text.disabled"]],
  ["radio.activeForeground", ["toggleButton.on.text.default", "text.primary"]],
  ["radio.activeBackground", ["toggleButton.on.background.default", "checkbox.on.background.default"]],
  ["radio.activeBorder", ["toggleButton.on.border.default", "border.focused"]],
  ["radio.inactiveForeground", ["toggleButton.off.text.default", "text.primary"]],
  ["radio.inactiveBackground", ["toggleButton.off.background.default", "checkbox.off.background.default"]],
  ["radio.inactiveBorder", ["toggleButton.off.border.default", "checkbox.off.border.default"]],
  ["radio.inactiveHoverBackground", ["toggleButton.off.background.hovered", "listItem.background.hovered"]],
  ["inputOption.hoverBackground", ["toggleButton.off.background.hovered", "button.secondary.background.hovered"]],

  ["scrollbar.background", ["scrollbar.track.default", "island.background", "background.primary"]],
  ["list.activeSelectionIconForeground", ["icon.primary", "listItem.text.selected"]],
  ["list.inactiveSelectionIconForeground", ["icon.secondary", "listItem.text.focused"]],
  ["list.inactiveFocusBackground", ["listItem.background.selected", "listItem.background.focused"]],
  ["list.inactiveFocusOutline", ["listItem.focusBorder", "border.focused"]],
  ["list.focusOutline", ["listItem.focusBorder", "border.focused"]],
  ["list.focusAndSelectionOutline", ["listItem.focusBorder", "border.focused"]],
  ["list.filterMatchBackground", ["completion.match.background", "search.match.background"]],
  ["list.filterMatchBorder", ["completion.match.text", "border.focused"]],
  ["list.deemphasizedForeground", ["text.tertiary", "text.secondary"]],
  ["list.dropBetweenBackground", ["dragAndDrop.border.highlight", "border.focused"]],
  ["tree.inactiveIndentGuidesStroke", ["tree.compactFolder.separator", "border"]],

  ["activityBar.dropBorder", ["dragAndDrop.border.highlight", "border.focused"]],
  ["activityBar.activeFocusBorder", ["border.focused"]],
  ["activityBarTop.foreground", ["text.primary"]],
  ["activityBarTop.activeBorder", ["border.focused"]],
  ["activityBarTop.inactiveForeground", ["text.secondary"]],
  ["activityBarTop.dropBorder", ["dragAndDrop.border.highlight", "border.focused"]],
  ["activityBarTop.background", ["background.primary"]],
  ["activityBarTop.activeBackground", ["listItem.background.selected", "background.primary"]],
  ["activityWarningBadge.foreground", ["button.warning.text.default"]],
  ["activityWarningBadge.background", ["button.warning.background.default"]],
  ["activityErrorBadge.foreground", ["button.dangerous.text.default"]],
  ["activityErrorBadge.background", ["button.dangerous.background.default"]],
  ["profileBadge.background", ["tag.color.default.neutral.background", "button.secondary.background.default"]],
  ["profileBadge.foreground", ["tag.color.default.neutral.text", "button.secondary.text.default"]],
  ["profiles.sashBorder", ["border"]],
  ["sideBar.dropBackground", ["dragAndDrop.background"]],
  ["sideBarActivityBarTop.border", ["border"]],
  ["sideBarTitle.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["sideBarTitle.border", ["border"]],
  ["sideBarStickyScroll.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["sideBarStickyScroll.border", ["border"]],
  ["sideBarStickyScroll.shadow", ["shadow.background.small"]],

  ["minimap.findMatchHighlight", ["search.match.background"]],
  ["minimap.selectionHighlight", ["editor.selection.focused", "editor.currentLine.background.focused"]],
  ["minimap.errorHighlight", ["button.dangerous.background.default"]],
  ["minimap.warningHighlight", ["button.warning.background.default"]],
  ["minimap.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["minimap.selectionOccurrenceHighlight", ["editor.currentLine.background.focused"]],
  ["minimap.foregroundOpacity", ["text.tertiary"]],
  ["minimapSlider.background", ["scrollbar.thumb.default"]],
  ["minimapSlider.hoverBackground", ["scrollbar.thumb.hovered"]],
  ["minimapSlider.activeBackground", ["scrollbar.thumb.pressed"]],
  ["minimapGutter.addedBackground", ["editor.gitDiff.background.added"]],
  ["minimapGutter.modifiedBackground", ["editor.gitDiff.background.modified"]],
  ["minimapGutter.deletedBackground", ["editor.gitDiff.background.deleted"]],

  ["editorGroup.emptyBackground", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editorGroup.focusedEmptyBorder", ["border.focused"]],
  ["editorGroup.dropIntoPromptForeground", ["text.primary"]],
  ["editorGroup.dropIntoPromptBackground", ["popup.background"]],
  ["editorGroup.dropIntoPromptBorder", ["popup.border", "border.focused"]],
  ["editorPane.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["sideBySideEditor.horizontalBorder", ["border"]],
  ["sideBySideEditor.verticalBorder", ["border"]],

  ["editor.selectionForeground", ["text.primary"]],
  ["editor.foldBackground", ["editor.foldedMark.background"]],
  ["editor.rangeHighlightBackground", ["editor.currentLine.background.default"]],
  ["editor.rangeHighlightBorder", ["border"]],
  ["editor.symbolHighlightBackground", ["editor.currentLine.background.focused"]],
  ["editor.symbolHighlightBorder", ["border.focused"]],
  ["editorUnicodeHighlight.border", ["button.warning.border.default"]],
  ["editorUnicodeHighlight.background", ["banner.background.warning"]],
  ["editor.foldPlaceholderForeground", ["editor.foldedMark.text"]],
  ["editor.wordHighlightTextBackground", ["editor.currentLine.background.default"]],
  ["editor.wordHighlightTextBorder", ["border"]],
  ["editor.wordHighlightBorder", ["border"]],
  ["editor.wordHighlightStrongBorder", ["border.focused"]],
  ["editor.snippetTabstopHighlightBackground", ["snippet.background.default"]],
  ["editor.snippetTabstopHighlightBorder", ["snippet.border.default", "border"]],
  ["editor.snippetFinalTabstopHighlightBorder", ["border.focused"]],
  ["editor.inlineValuesForeground", ["text.secondary"]],
  ["editor.inlineValuesBackground", ["background.secondary"]],
  ["editor.linkedEditingBackground", ["editor.currentLine.background.focused"]],

  // Fleet does not rainbow-colorize bracket nesting: brackets/punctuation use the
  // plain editor text color (Fleet `punctuation` = Neutral_140). Map every nesting
  // level to the editor text color so VSCode bracket-pair colorization matches Fleet.
  ["editorBracketHighlight.foreground1", ["editor.text"]],
  ["editorBracketHighlight.foreground2", ["editor.text"]],
  ["editorBracketHighlight.foreground3", ["editor.text"]],
  ["editorBracketHighlight.foreground4", ["editor.text"]],
  ["editorBracketHighlight.foreground5", ["editor.text"]],
  ["editorBracketHighlight.foreground6", ["editor.text"]],
  ["editorBracketHighlight.unexpectedBracket.foreground", ["text.dangerous"]],
  ["editorBracketPairGuide.activeBackground1", ["BlueTint_40", "AccentTint_40"]],
  ["editorBracketPairGuide.activeBackground2", ["PurpleTint_40", "VioletTint_40"]],
  ["editorBracketPairGuide.activeBackground3", ["GreenTint_40", "GreenTint_20"]],
  ["editorBracketPairGuide.background1", ["BlueTint_20", "AccentTint_20"]],
  ["editorBracketPairGuide.background2", ["PurpleTint_20", "VioletTint_20"]],
  ["editorBracketPairGuide.background3", ["GreenTint_20", "GreenTint_15"]],

  ["editorStickyScroll.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editorStickyScrollHover.background", ["listItem.background.hovered"]],
  ["editorStickyScroll.border", ["border"]],
  ["editorStickyScroll.shadow", ["shadow.background.small"]],
  ["editorOverviewRuler.bracketMatchForeground", ["border.focused"]],
  ["editorOverviewRuler.inlineChatInserted", ["editor.gitDiff.background.added"]],
  ["editorOverviewRuler.inlineChatRemoved", ["editor.gitDiff.background.deleted"]],
  ["editorGutter.foldingControlForeground", ["editor.foldIndicator.icon.default"]],
  ["editorCommentsWidget.resolvedBorder", ["border"]],
  ["editorCommentsWidget.unresolvedBorder", ["border.focused"]],
  ["editorCommentsWidget.rangeBackground", ["editor.currentLine.background.default"]],
  ["editorCommentsWidget.rangeActiveBackground", ["editor.currentLine.background.focused"]],
  ["editorCommentsWidget.replyInputBackground", ["inputField.background.default"]],

  ["editorHoverWidget.statusBarBackground", ["popup.footer.background", "background.secondary"]],
  ["editorSuggestWidget.focusHighlightForeground", ["completion.match.text"]],
  ["editorSuggestWidget.selectedIconForeground", ["icon.primary", "text.primary"]],
  ["editorSuggestWidgetStatus.foreground", ["text.secondary"]],
  ["editorGhostText.foreground", ["text.tertiary"]],
  ["editorGhostText.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editorGhostText.border", ["border"]],
  ["editorStickyScrollGutter.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["editorInlayHint.foreground", ["text.tertiary"]],
  ["editorInlayHint.background", ["background.secondary"]],
  ["editorInlayHint.typeForeground", ["text.secondary"]],
  ["editorInlayHint.typeBackground", ["background.secondary"]],
  ["editorInlayHint.parameterForeground", ["text.secondary"]],
  ["editorInlayHint.parameterBackground", ["background.secondary"]],
  ["editorLightBulb.foreground", ["button.warning.background.default"]],
  ["editorLightBulbAutoFix.foreground", ["button.primary.background.default"]],
  ["editorLightBulbAi.foreground", ["text.ai"]],

  ["debugToolBar.background", ["popup.background"]],
  ["debugToolBar.border", ["popup.border", "border"]],
  ["editor.stackFrameHighlightBackground", ["debug.currentFrame", "YellowTint_30", "banner.background.warning"]],
  ["editor.focusedStackFrameHighlightBackground", ["debug.currentFrame", "GreenTint_20", "banner.background.positive"]],
  ["debugView.exceptionLabelForeground", ["button.dangerous.text.default"]],
  ["debugView.exceptionLabelBackground", ["button.dangerous.background.default"]],
  ["debugView.stateLabelForeground", ["text.primary"]],
  ["debugView.stateLabelBackground", ["background.secondary"]],
  ["debugView.valueChangedHighlight", ["editor.gitDiff.background.modified"]],
  ["debugTokenExpression.name", ["identifier.variable", "text.primary"]],
  ["debugTokenExpression.value", ["string", "text.primary"]],
  ["debugTokenExpression.string", ["string"]],
  ["debugTokenExpression.boolean", ["boolean"]],
  ["debugTokenExpression.number", ["number"]],
  ["debugTokenExpression.error", ["text.dangerous"]],
  ["debugIcon.breakpointForeground", ["button.dangerous.background.default"]],
  ["debugIcon.breakpointDisabledForeground", ["text.disabled"]],
  ["debugIcon.breakpointUnverifiedForeground", ["text.tertiary"]],
  ["debugIcon.breakpointCurrentStackframeForeground", ["button.warning.background.default"]],
  ["debugIcon.breakpointStackframeForeground", ["button.primary.background.default"]],
  ["debugIcon.startForeground", ["text.positive"]],
  ["debugIcon.pauseForeground", ["button.warning.background.default"]],
  ["debugIcon.stopForeground", ["text.dangerous"]],
  ["debugIcon.disconnectForeground", ["text.dangerous"]],
  ["debugIcon.restartForeground", ["text.positive"]],
  ["debugIcon.stepOverForeground", ["button.primary.background.default"]],
  ["debugIcon.stepIntoForeground", ["button.primary.background.default"]],
  ["debugIcon.stepOutForeground", ["button.primary.background.default"]],
  ["debugIcon.continueForeground", ["text.positive"]],
  ["debugIcon.stepBackForeground", ["button.primary.background.default"]],

  ["testing.iconFailed", ["text.dangerous"]],
  ["testing.iconErrored", ["text.dangerous"]],
  ["testing.iconPassed", ["text.positive"]],
  ["testing.runAction", ["text.positive"]],
  ["testing.iconQueued", ["button.warning.background.default"]],
  ["testing.iconUnset", ["text.tertiary"]],
  ["testing.iconSkipped", ["text.disabled"]],
  ["testing.peekBorder", ["border.focused"]],
  ["testing.peekHeaderBackground", ["background.secondary"]],
  ["testing.message.error.badgeForeground", ["text.dangerous"]],
  ["testing.message.error.lineBackground", ["banner.background.dangerous"]],
  ["testing.message.info.decorationForeground", ["button.primary.background.default"]],
  ["testing.message.info.lineBackground", ["banner.background.info"]],

  ["notebook.editorBackground", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["notebook.cellBorderColor", ["border"]],
  ["notebook.cellHoverBackground", ["listItem.background.hovered"]],
  ["notebook.cellInsertionIndicator", ["border.focused"]],
  ["notebook.cellStatusBarItemHoverBackground", ["ghostButton.off.background.hovered"]],
  ["notebook.cellToolbarSeparator", ["separator.default", "border"]],
  ["notebook.focusedCellBackground", ["background.primary"]],
  ["notebook.focusedCellBorder", ["border.focused"]],
  ["notebook.focusedEditorBorder", ["border.focused"]],
  ["notebook.inactiveFocusedCellBorder", ["border"]],
  ["notebook.inactiveSelectedCellBorder", ["border"]],
  ["notebook.outputContainerBackgroundColor", ["background.secondary"]],
  ["notebook.outputContainerBorderColor", ["border"]],
  ["notebook.selectedCellBackground", ["listItem.background.selected"]],
  ["notebook.selectedCellBorder", ["border.focused"]],
  ["notebook.symbolHighlightBackground", ["editor.currentLine.background.focused"]],
  ["notebookScrollbarSlider.background", ["scrollbar.thumb.default"]],
  ["notebookScrollbarSlider.hoverBackground", ["scrollbar.thumb.hovered"]],
  ["notebookScrollbarSlider.activeBackground", ["scrollbar.thumb.pressed"]],
  ["notebookStatusErrorIcon.foreground", ["text.dangerous"]],
  ["notebookStatusRunningIcon.foreground", ["button.warning.background.default"]],
  ["notebookStatusSuccessIcon.foreground", ["text.positive"]],

  ["merge.currentHeaderBackground", ["editor.gitDiff.background.modified"]],
  ["merge.currentContentBackground", ["BlueTint_15", "AccentTint_15"]],
  ["merge.incomingHeaderBackground", ["editor.gitDiff.background.added"]],
  ["merge.incomingContentBackground", ["GreenTint_15", "editor.gitDiff.background.added"]],
  ["merge.border", ["border"]],
  ["merge.commonContentBackground", ["YellowTint_15", "banner.background.warning"]],
  ["merge.commonHeaderBackground", ["YellowTint_30", "button.warning.background.default"]],
  ["mergeEditor.change.background", ["BlueTint_15", "AccentTint_15"]],
  ["mergeEditor.change.word.background", ["BlueTint_30", "AccentTint_30"]],
  ["mergeEditor.conflict.unhandledUnfocused.border", ["button.warning.border.default"]],
  ["mergeEditor.conflict.unhandledFocused.border", ["button.warning.focusOutline"]],
  ["mergeEditor.conflict.handledUnfocused.border", ["button.positive.border.default"]],
  ["mergeEditor.conflict.handledFocused.border", ["button.positive.focusOutline"]],
  ["mergeEditor.conflict.handled.minimapOverViewRuler", ["button.positive.background.default"]],
  ["mergeEditor.conflict.unhandled.minimapOverViewRuler", ["button.warning.background.default"]],
  ["mergeEditor.conflictingLines.background", ["YellowTint_15", "banner.background.warning"]],
  ["multiDiffEditor.headerBackground", ["background.primary"]],
  ["multiDiffEditor.background", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["multiDiffEditor.border", ["border"]],

  ["commandCenter.foreground", ["text.primary"]],
  ["commandCenter.activeForeground", ["text.primary"]],
  ["commandCenter.background", ["background.primary", "inputField.background.default"]],
  ["commandCenter.activeBackground", ["inputField.background.hovered", "listItem.background.hovered"]],
  ["commandCenter.border", ["inputField.border.default", "border"]],
  ["commandCenter.inactiveForeground", ["text.secondary"]],
  ["commandCenter.inactiveBorder", ["border"]],
  ["commandCenter.activeBorder", ["border.focused"]],
  ["commandCenter.debuggingBackground", ["button.warning.background.default"]],

  ["extensionButton.prominentForeground", ["button.primary.text.default"]],
  ["extensionButton.prominentBackground", ["button.primary.background.default"]],
  ["extensionButton.prominentHoverBackground", ["button.primary.background.hovered"]],
  ["extensionButton.background", ["button.secondary.background.default"]],
  ["extensionButton.foreground", ["button.secondary.text.default"]],
  ["extensionButton.hoverBackground", ["button.secondary.background.hovered"]],
  ["extensionButton.separator", ["button.secondary.separator.default", "border"]],
  ["extensionBadge.remoteBackground", ["button.primary.background.default"]],
  ["extensionBadge.remoteForeground", ["button.primary.text.default"]],
  ["extensionIcon.starForeground", ["button.warning.background.default"]],
  ["extensionIcon.verifiedForeground", ["button.primary.background.default"]],
  ["extensionIcon.preReleaseForeground", ["text.ai"]],
  ["extensionIcon.sponsorForeground", ["text.dangerous"]],

  ["welcomePage.background", ["background.primary"]],
  ["welcomePage.progress.background", ["progressBar.determinate.background", "background.secondary"]],
  ["welcomePage.progress.foreground", ["progressBar.determinate.foreground", "progressBar.indeterminate.foreground"]],
  ["welcomePage.tileBackground", ["background.secondary"]],
  ["welcomePage.tileHoverBackground", ["listItem.background.hovered"]],
  ["walkThrough.embeddedEditorBackground", ["island.background", "popup.editor.background", "snippet.content.background", "background.primary"]],
  ["walkthrough.stepTitle.foreground", ["text.primary"]],

  ["charts.foreground", ["text.primary"]],
  ["charts.lines", ["border"]],
  ["charts.red", ["text.dangerous"]],
  ["charts.blue", ["button.primary.background.default"]],
  ["charts.yellow", ["button.warning.background.default"]],
  ["charts.orange", ["Yellow_100", "button.warning.background.default"]],
  ["charts.green", ["text.positive"]],
  ["charts.purple", ["text.ai"]],
  ["ports.iconRunningProcessForeground", ["text.positive"]],

  ["symbolIcon.arrayForeground", ["text.primary"]],
  ["symbolIcon.booleanForeground", ["boolean"]],
  ["symbolIcon.classForeground", ["identifier.type.class"]],
  ["symbolIcon.colorForeground", ["propertyValue.css"]],
  ["symbolIcon.constantForeground", ["identifier.constant"]],
  ["symbolIcon.constructorForeground", ["identifier.function.declaration"]],
  ["symbolIcon.enumeratorForeground", ["identifier.type.enum"]],
  ["symbolIcon.enumeratorMemberForeground", ["identifier.constant"]],
  ["symbolIcon.eventForeground", ["identifier.function.call"]],
  ["symbolIcon.fieldForeground", ["identifier.field"]],
  ["symbolIcon.fileForeground", ["text.primary"]],
  ["symbolIcon.folderForeground", ["text.secondary"]],
  ["symbolIcon.functionForeground", ["identifier.function.call"]],
  ["symbolIcon.interfaceForeground", ["identifier.interface"]],
  ["symbolIcon.keyForeground", ["key.json", "key.yaml"]],
  ["symbolIcon.keywordForeground", ["keyword"]],
  ["symbolIcon.methodForeground", ["identifier.function.call"]],
  ["symbolIcon.moduleForeground", ["identifier.package.go", "text.secondary"]],
  ["symbolIcon.namespaceForeground", ["identifier.package.go", "text.secondary"]],
  ["symbolIcon.nullForeground", ["identifier.constant.predefined"]],
  ["symbolIcon.numberForeground", ["number"]],
  ["symbolIcon.objectForeground", ["identifier.type"]],
  ["symbolIcon.operatorForeground", ["punctuation.operator"]],
  ["symbolIcon.packageForeground", ["identifier.package.go", "text.secondary"]],
  ["symbolIcon.propertyForeground", ["identifier.field"]],
  ["symbolIcon.referenceForeground", ["link"]],
  ["symbolIcon.snippetForeground", ["snippet"]],
  ["symbolIcon.stringForeground", ["string"]],
  ["symbolIcon.structForeground", ["identifier.type.struct"]],
  ["symbolIcon.textForeground", ["text.primary"]],
  ["symbolIcon.typeParameterForeground", ["identifier.typeParameter"]],
  ["symbolIcon.unitForeground", ["number.unit.css"]],
  ["symbolIcon.variableForeground", ["identifier.variable", "text.primary"]],

  ["scmGraph.foreground1", ["Blue_110", "Accent_100"]],
  ["scmGraph.foreground2", ["Green_110", "Green_100"]],
  ["scmGraph.foreground3", ["Yellow_110", "Yellow_100"]],
  ["scmGraph.foreground4", ["Purple_110", "Violet_110"]],
  ["scmGraph.foreground5", ["Red_110", "Red_100"]],
  // Inline ref chips in the Source Control Graph. Use Fleet's branch-tag colors so the
  // current/local branch chip is blue and the remote chip is purple (consistent + readable),
  // instead of text.primary which renders as a near-white/near-black solid box.
  ["scmGraph.historyItemRefColor", ["gitBranchTag.local.text", "text.primary"]],
  ["scmGraph.historyItemRemoteRefColor", ["gitBranchTag.remote.text", "text.ai"]],
  ["scmGraph.historyItemBaseRefColor", ["text.positive"]],
  ["scmGraph.historyItemHoverLabelForeground", ["listItem.text.hovered"]],
  ["scmGraph.historyItemHoverDefaultLabelForeground", ["text.primary"]],
  ["scmGraph.historyItemHoverDefaultLabelBackground", ["background.secondary"]]
];

const tokenScopeMappings = {
  "ai.generated": ["markup.inserted.ai", "meta.embedded.ai"],
  "attribute.cpp": ["storage.modifier.attribute.cpp", "entity.other.attribute-name.cpp"],
  "attributeName.css": ["entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css", "entity.other.attribute-name.css"],
  "attributeName.html": ["entity.other.attribute-name.html", "entity.other.attribute-name.xml"],
  "attributeValue.html": ["string.quoted.html", "string.quoted.xml"],
  boolean: ["constant.language.boolean", "constant.language.boolean.kotlin"],
  comment: ["comment", "punctuation.definition.comment", "comment.line.double-slash.kotlin", "comment.block.kotlin"],
  "comment.buildConstraint.go": ["comment.line.double-slash.go"],
  "comment.doc": ["comment.block.documentation", "comment.line.documentation", "comment.block.documentation.kotlin"],
  "comment.doc.tag": ["keyword.other.documentation", "storage.type.class.jsdoc", "entity.name.tag.documentation"],
  "comment.doc.value": ["variable.other.jsdoc", "string.other.link.title.markdown"],
  "comment.todo": ["keyword.other.todo", "comment.line.todo"],
  "entityReference.html": ["constant.character.entity.html", "constant.character.entity.xml"],
  "generic.php": ["storage.type.generic.php"],
  "hex.css": ["constant.other.color.rgb-value.css"],
  // `constant.other.caps[.python]` is MagicPython's ALL_CAPS heuristic. Fleet does not
  // treat Python ALL_CAPS names as constants (it renders them as plain identifiers), so
  // map this more-specific scope to the neutral identifier color. It overrides the violet
  // `identifier.constant` -> `constant.other` rule for Python only; JS/TS ALL_CAPS consts
  // keep their own `variable.other.constant` scope and stay violet, matching Fleet.
  identifier: ["variable", "variable.other.kotlin", "constant.other.caps", "constant.other.caps.python"],
  "identifier.alias.yaml": ["entity.name.type.anchor.yaml"],
  "identifier.anchor.yaml": ["entity.name.type.anchor.yaml"],
  "identifier.constant": ["constant.other", "variable.other.constant", "variable.other.constant.kotlin"],
  "identifier.constant.predefined": ["constant.language", "support.constant", "constant.language.kotlin", "support.constant.kotlin"],
  "identifier.css": ["variable.css"],
  "identifier.dependency.add.amper": ["markup.inserted.amper"],
  "identifier.dependency.annotator.amper": ["entity.name.function.amper"],
  "identifier.dependency.scope.amper": ["entity.name.namespace.amper"],
  "identifier.field": ["variable.other.property", "meta.object-literal.key", "support.variable.property", "variable.other.property.kotlin"],
  "identifier.field.static": ["variable.other.property.static", "support.variable.property.static", "variable.other.property.static.kotlin"],
  "identifier.function.call": ["entity.name.function", "support.function", "variable.function", "entity.name.function.kotlin", "support.function.kotlin"],
  "identifier.function.call.composable": ["entity.name.function.composable"],
  "identifier.function.call.package": ["support.function.package", "entity.name.function.package"],
  "identifier.function.css": ["support.function.misc.css", "entity.name.function.css"],
  "identifier.function.declaration": ["entity.name.function", "meta.function entity.name.function", "entity.name.function.declaration.kotlin"],
  "identifier.function.declaration.js": ["entity.name.function.js", "meta.function.js entity.name.function.js"],
  "identifier.interface": ["entity.name.type.interface", "support.type.interface", "entity.name.type.interface.kotlin"],
  "identifier.method.static": ["entity.name.function.member.static", "support.function.static", "entity.name.function.static.kotlin"],
  "identifier.methodReceiver.go": ["variable.parameter.receiver.go"],
  "identifier.namedArgument": ["variable.parameter.named", "entity.other.attribute-name.named", "variable.parameter.named.kotlin"],
  "identifier.other": ["variable.other"],
  "identifier.package.go": ["entity.name.package.go"],
  "identifier.parameter": ["variable.parameter", "variable.parameter.kotlin"],
  "identifier.parameter.js": ["variable.parameter.js"],
  "identifier.this": ["variable.language.this", "variable.language.self", "variable.language.super", "variable.language.this.kotlin", "variable.language.super.kotlin"],
  "identifier.this.mutable": ["variable.language.this.mutable"],
  "identifier.type": ["entity.name.type", "support.type", "entity.name.type.kotlin", "support.type.kotlin", "support.class.kotlin"],
  "identifier.type.class": ["entity.name.type.class", "support.class", "entity.name.class.kotlin", "entity.name.type.class.kotlin"],
  "identifier.type.enum": ["entity.name.type.enum", "entity.name.type.enum.kotlin"],
  "identifier.type.struct": ["entity.name.type.struct", "storage.type.struct"],
  "identifier.type.valueType": ["support.type.primitive", "storage.type.primitive", "storage.type.primitive.kotlin"],
  "identifier.typeDeclaration.go": ["entity.name.type.go"],
  "identifier.typeParameter": ["entity.name.type.parameter", "support.type.type-parameter", "entity.name.type.parameter.kotlin"],
  "identifier.typeReference.go": ["entity.name.type.go", "support.type.go"],
  "identifier.variable": ["variable.other.readwrite"],
  "identifier.variable.css": ["variable.parameter.url.css", "variable.css"],
  "identifier.variable.mutable": ["variable.other.readwrite.mutable"],
  "identifier.variable.php": ["variable.other.php"],
  "identifier.variable.shadowing.go": ["variable.other.shadowed.go"],
  "interpolation.css": ["source.css.embedded", "meta.embedded.css"],
  "jsCodeDelimiter.css": ["punctuation.section.embedded.begin.css", "punctuation.section.embedded.end.css"],
  "jsCodeInjection.css": ["source.js.embedded.css", "meta.embedded.js.css"],
  "key.json": ["support.type.property-name.json", "meta.structure.dictionary.key.json string.quoted.double.json"],
  "key.yaml": ["entity.name.tag.yaml", "support.type.property-name.yaml"],
  keyword: ["keyword", "storage.type", "storage.modifier", "keyword.control.kotlin", "keyword.other.kotlin", "storage.type.kotlin", "storage.modifier.kotlin"],
  "keyword.css": ["keyword.control.at-rule.css", "keyword.other.css"],
  "keyword.extend.css": ["keyword.control.extend.css"],
  "keyword.global.css": ["keyword.control.global.css"],
  "keyword.important.css": ["keyword.other.important.css"],
  "keyword.typeModifier": ["storage.modifier", "keyword.other.type.modifier", "storage.modifier.kotlin"],
  link: ["markup.underline.link", "string.other.link"],
  "link.always.visible": ["markup.underline.link"],
  "link.hovered": ["markup.underline.link.hovered"],
  "markup.bold": ["markup.bold", "punctuation.definition.bold"],
  "markup.code.block": ["markup.fenced_code.block.markdown", "markup.raw.block.markdown"],
  "markup.heading": ["markup.heading", "entity.name.section.markdown"],
  "markup.href": ["markup.underline.link.markdown", "string.other.link.title.markdown"],
  "markup.italic": ["markup.italic", "punctuation.definition.italic"],
  metadata: ["meta.annotation", "storage.type.annotation", "entity.name.type.annotation.kotlin", "punctuation.definition.annotation.kotlin"],
  "metadata.structTag.arbitraryText.go": ["string.quoted.raw.go"],
  "metadata.structTag.key.go": ["entity.other.attribute-name.go"],
  "metadata.structTag.value.go": ["string.quoted.go"],
  "mixin.css": ["entity.name.function.mixin.css"],
  number: ["constant.numeric", "constant.numeric.kotlin"],
  "number.css": ["constant.numeric.css"],
  "number.unit.css": ["keyword.other.unit.css"],
  "property.php": ["variable.other.property.php"],
  "property.static.php": ["variable.other.property.static.php"],
  "propertyName.css": ["support.type.property-name.css"],
  "propertyValue.css": ["support.constant.property-value.css"],
  punctuation: ["punctuation", "punctuation.kotlin"],
  "punctuation.css": ["punctuation.css"],
  "punctuation.operator": ["keyword.operator", "punctuation.separator", "keyword.operator.kotlin"],
  "punctuation.operator.merge.yaml": ["keyword.operator.merge-key.yaml"],
  "refactoring.modified.code": ["markup.changed"],
  "schema.yaml": ["entity.name.type.yaml"],
  "selector.class.css": ["entity.other.attribute-name.class.css"],
  "selector.css": ["entity.name.tag.css", "entity.other.attribute-name.css"],
  "selector.id.css": ["entity.other.attribute-name.id.css"],
  "selector.pseudo.css": ["entity.other.attribute-name.pseudo-class.css", "entity.other.attribute-name.pseudo-element.css"],
  "selector.tag.css": ["entity.name.tag.css"],
  snippet: ["markup.raw.snippet", "variable.other.snippet"],
  "snippet.selected": ["markup.raw.snippet.selected"],
  string: ["string", "string.quoted.double.kotlin", "string.quoted.triple.kotlin"],
  "string.binary": ["constant.numeric.binary"],
  "string.css": ["string.quoted.css"],
  "string.escape": ["constant.character.escape", "constant.character.escape.kotlin"],
  "string.escape.alternative": ["constant.character.escape.alternative"],
  "string.escape.unicode": ["constant.character.escape.unicode"],
  "string.formatItem": ["constant.other.placeholder", "meta.format-string"],
  "string.regexp": ["string.regexp", "constant.other.character-class.regexp"],
  "tag.html": ["punctuation.definition.tag.html", "punctuation.definition.tag.xml"],
  "tagName.custom.html": ["entity.name.tag.custom.html", "support.class.component.html"],
  "tagName.html": ["entity.name.tag.html", "entity.name.tag.xml"],
  "transparent": ["meta.transparent"],
  "url.css": ["variable.parameter.url.css", "string.other.url.css"],
  "value.yaml": ["string.unquoted.yaml", "constant.language.yaml"]
};

const additionalTokenScopeMappings = {
  comment: [
    "comment.line.double-slash.java",
    "comment.block.java",
    "comment.line.double-slash.js",
    "comment.block.js",
    "comment.line.double-slash.jsx",
    "comment.block.jsx",
    "comment.line.double-slash.ts",
    "comment.block.ts",
    "comment.line.double-slash.tsx",
    "comment.block.tsx",
    "comment.line.number-sign.python",
    "comment.line.double-slash.go",
    "comment.line.double-slash.rust",
    "comment.block.rust",
    "comment.line.double-slash.c",
    "comment.block.c",
    "comment.line.double-slash.cpp",
    "comment.block.cpp",
    "comment.line.double-slash.cs",
    "comment.block.cs",
    "comment.line.double-slash.swift",
    "comment.block.swift",
    "comment.line.number-sign.ruby",
    "comment.line.number-sign.shell",
    "comment.line.double-dash.sql",
    "comment.block.sql",
    "comment.line.number-sign.dockerfile",
    "comment.line.number-sign.toml",
    "comment.line.semicolon.ini",
    "comment.line.number-sign.properties"
  ],
  "comment.doc": [
    "comment.block.documentation.java",
    "comment.block.documentation.js",
    "comment.block.documentation.ts",
    "comment.block.documentation.cs",
    "comment.block.documentation.php",
    "comment.block.documentation.rust",
    "comment.line.documentation.swift",
    "string.quoted.docstring.multi.python",
    "string.quoted.docstring.multi.python punctuation.definition.string.begin.python",
    "string.quoted.docstring.multi.python punctuation.definition.string.end.python"
  ],
  "comment.doc.tag": [
    "keyword.other.documentation.java",
    "keyword.other.documentation.js",
    "keyword.other.documentation.ts",
    "storage.type.class.jsdoc",
    "entity.name.tag.documentation.php"
  ],
  "comment.todo": [
    "keyword.other.todo.java",
    "keyword.other.todo.kotlin",
    "keyword.other.todo.python",
    "keyword.other.todo.rust",
    "keyword.other.todo.go",
    "keyword.other.todo.c",
    "keyword.other.todo.cpp",
    "keyword.other.todo.cs",
    "keyword.other.todo.swift"
  ],
  keyword: [
    "keyword.control.import.java",
    "keyword.control.import.kotlin",
    "keyword.control.import.js",
    "keyword.control.import.ts",
    "keyword.control.from.python",
    "keyword.control.import.python",
    "keyword.control.flow.python",
    "keyword.control.conditional.python",
    "keyword.control.repeat.python",
    "keyword.control.exception.python",
    "keyword.control.return.python",
    "keyword.operator.logical.python",
    "storage.type.function.python",
    "keyword.control.rust",
    "keyword.control.go",
    "keyword.control.c",
    "keyword.control.cpp",
    "keyword.control.cs",
    "keyword.control.swift",
    "keyword.control.php",
    "keyword.control.ruby",
    "keyword.control.shell",
    "keyword.other.DML.sql",
    "keyword.other.DDL.sql",
    "keyword.other.dockerfile",
    "keyword.other.special-method.dockerfile",
    "storage.type.java",
    "storage.type.kotlin",
    "storage.type.cs",
    "storage.type.swift",
    "storage.type.rust",
    "storage.type.go",
    "storage.type.c",
    "storage.type.cpp",
    "storage.type.php",
    "storage.type.sql",
    "storage.modifier.java",
    "storage.modifier.kotlin",
    "storage.modifier.cs",
    "storage.modifier.swift",
    "storage.modifier.rust"
  ],
  "keyword.typeModifier": [
    "storage.modifier.access.java",
    "storage.modifier.access.kotlin",
    "storage.modifier.access.cs",
    "storage.modifier.async.js",
    "storage.modifier.async.ts",
    "storage.modifier.async.cs",
    "storage.modifier.static.java",
    "storage.modifier.static.kotlin",
    "storage.modifier.static.cs",
    "storage.modifier.final.java",
    "storage.modifier.final.kotlin",
    "storage.modifier.readonly.cs",
    "storage.modifier.mut.rust",
    "storage.modifier.unsafe.rust"
  ],
  metadata: [
    "meta.annotation.java",
    "meta.annotation.kotlin",
    "meta.annotation.cs",
    "meta.annotation.rust",
    "meta.decorator.python",
    "meta.decorator.js",
    "meta.decorator.ts",
    "punctuation.decorator.python",
    "entity.name.function.decorator.python",
    "entity.name.type.annotation.java",
    "entity.name.type.annotation.kotlin",
    "entity.name.type.attribute.rust"
  ],
  boolean: [
    "constant.language.boolean.java",
    "constant.language.boolean.js",
    "constant.language.boolean.ts",
    "constant.language.boolean.python",
    "constant.language.boolean.go",
    "constant.language.boolean.rust",
    "constant.language.boolean.c",
    "constant.language.boolean.cpp",
    "constant.language.boolean.cs",
    "constant.language.boolean.swift",
    "constant.language.boolean.php",
    "constant.language.boolean.ruby",
    "constant.language.boolean.yaml",
    "constant.language.boolean.toml"
  ],
  number: [
    "constant.numeric.decimal",
    "constant.numeric.integer",
    "constant.numeric.float",
    "constant.numeric.hex",
    "constant.numeric.binary",
    "constant.numeric.octal",
    "constant.numeric.java",
    "constant.numeric.js",
    "constant.numeric.ts",
    "constant.numeric.python",
    "constant.numeric.go",
    "constant.numeric.rust",
    "constant.numeric.c",
    "constant.numeric.cpp",
    "constant.numeric.cs",
    "constant.numeric.swift",
    "constant.numeric.php",
    "constant.numeric.ruby",
    "constant.numeric.sql",
    "constant.numeric.toml"
  ],
  string: [
    "string.quoted.single",
    "string.quoted.double",
    "string.quoted.triple",
    "string.quoted.raw",
    "string.template",
    "string.interpolated",
    "string.quoted.single.java",
    "string.quoted.double.java",
    "string.quoted.single.js",
    "string.quoted.double.js",
    "string.template.js",
    "string.quoted.single.ts",
    "string.quoted.double.ts",
    "string.template.ts",
    "string.quoted.single.python",
    "string.quoted.double.python",
    "string.quoted.single.go",
    "string.quoted.double.go",
    "string.quoted.double.rust",
    "string.quoted.single.c",
    "string.quoted.double.c",
    "string.quoted.single.cpp",
    "string.quoted.double.cpp",
    "string.quoted.single.cs",
    "string.quoted.double.cs",
    "string.quoted.double.swift",
    "string.quoted.single.php",
    "string.quoted.double.php",
    "string.quoted.single.ruby",
    "string.quoted.double.ruby",
    "string.quoted.single.shell",
    "string.quoted.double.shell",
    "string.quoted.single.sql",
    "string.quoted.double.sql",
    "string.quoted.double.dockerfile",
    "string.quoted.single.toml",
    "string.quoted.double.toml",
    "string.quoted.double.ini",
    "string.unquoted.properties"
  ],
  "string.escape": [
    "constant.character.escape.java",
    "constant.character.escape.js",
    "constant.character.escape.ts",
    "constant.character.escape.python",
    "constant.character.escape.go",
    "constant.character.escape.rust",
    "constant.character.escape.c",
    "constant.character.escape.cpp",
    "constant.character.escape.cs",
    "constant.character.escape.swift",
    "constant.character.escape.php",
    "constant.character.escape.ruby",
    "constant.character.escape.shell"
  ],
  "string.regexp": [
    "string.regexp.js",
    "string.regexp.ts",
    "string.regexp.python",
    "string.regexp.ruby",
    "string.regexp.php",
    "string.regexp.go",
    "constant.other.character-class.regexp",
    "keyword.operator.quantifier.regexp"
  ],
  "identifier.function.call": [
    "meta.function-call",
    "meta.function-call entity.name.function",
    "entity.name.function.java",
    "entity.name.function.method.java",
    "entity.name.function.js",
    "entity.name.function.ts",
    "entity.name.function.python",
    "entity.name.function.go",
    "entity.name.function.rust",
    "entity.name.function.c",
    "entity.name.function.cpp",
    "entity.name.function.cs",
    "entity.name.function.swift",
    "entity.name.function.php",
    "entity.name.function.ruby",
    "support.function.builtin.shell",
    "entity.name.function.sql"
  ],
  "identifier.function.declaration": [
    "meta.function entity.name.function.java",
    "meta.function entity.name.function.kotlin",
    "meta.function entity.name.function.js",
    "meta.function entity.name.function.ts",
    "meta.function entity.name.function.python",
    "meta.function entity.name.function.go",
    "meta.function entity.name.function.rust",
    "meta.function entity.name.function.c",
    "meta.function entity.name.function.cpp",
    "meta.function entity.name.function.cs",
    "meta.function entity.name.function.swift",
    "meta.function entity.name.function.php",
    "meta.function entity.name.function.ruby",
    "entity.name.function.definition.shell"
  ],
  "identifier.method.static": [
    "entity.name.function.static.java",
    "entity.name.function.static.kotlin",
    "entity.name.function.static.cs",
    "entity.name.function.static.swift"
  ],
  "identifier.type": [
    "support.type.builtin",
    "support.type.builtin.java",
    "support.type.builtin.kotlin",
    "support.type.builtin.python",
    "support.type.builtin.go",
    "support.type.builtin.rust",
    "support.type.builtin.c",
    "support.type.builtin.cpp",
    "support.type.builtin.cs",
    "support.type.builtin.swift",
    "support.type.builtin.php",
    "support.type.builtin.ruby"
  ],
  "identifier.type.class": [
    "entity.name.type.class.java",
    "entity.name.type.class.js",
    "entity.name.type.class.ts",
    "entity.name.type.class.python",
    "entity.name.type.class.go",
    "entity.name.type.class.rust",
    "entity.name.type.class.cpp",
    "entity.name.type.class.cs",
    "entity.name.type.class.swift",
    "entity.name.type.class.php",
    "entity.name.type.class.ruby",
    "support.class.component.tsx",
    "support.class.component.jsx"
  ],
  "identifier.interface": [
    "entity.name.type.interface.java",
    "entity.name.type.interface.ts",
    "entity.name.type.interface.cs",
    "entity.name.type.protocol.swift",
    "entity.name.type.trait.rust"
  ],
  "identifier.type.enum": [
    "entity.name.type.enum.java",
    "entity.name.type.enum.kotlin",
    "entity.name.type.enum.cs",
    "entity.name.type.enum.swift",
    "entity.name.type.enum.rust"
  ],
  "identifier.type.struct": [
    "entity.name.type.struct.go",
    "entity.name.type.struct.rust",
    "entity.name.type.struct.c",
    "entity.name.type.struct.cpp",
    "entity.name.type.struct.swift"
  ],
  "identifier.typeParameter": [
    "entity.name.type.parameter.java",
    "entity.name.type.parameter.ts",
    "entity.name.type.parameter.cs",
    "entity.name.type.parameter.rust",
    "entity.name.type.parameter.swift"
  ],
  "identifier.parameter": [
    "variable.parameter.java",
    "variable.parameter.kotlin",
    "variable.parameter.js",
    "variable.parameter.ts",
    "variable.parameter.python",
    "variable.parameter.go",
    "variable.parameter.rust",
    "variable.parameter.c",
    "variable.parameter.cpp",
    "variable.parameter.cs",
    "variable.parameter.swift",
    "variable.parameter.php",
    "variable.parameter.ruby"
  ],
  "identifier.namedArgument": [
    "variable.parameter.function-call.python",
    "variable.parameter.named.cs",
    "variable.parameter.named.swift",
    "variable.parameter.named.ruby"
  ],
  "identifier.field": [
    "variable.other.object.property",
    "variable.other.property.java",
    "variable.other.property.js",
    "variable.other.property.ts",
    "variable.other.property.python",
    "variable.other.property.go",
    "variable.other.property.rust",
    "variable.other.property.cs",
    "variable.other.property.swift",
    "variable.other.member.c",
    "variable.other.member.cpp"
  ],
  "identifier.constant": [
    "variable.other.constant.java",
    "variable.other.constant.kotlin",
    "variable.other.constant.js",
    "variable.other.constant.ts",
    "variable.other.constant.python",
    "variable.other.constant.go",
    "variable.other.constant.rust",
    "variable.other.constant.cs",
    "variable.other.constant.swift",
    "constant.other.symbol.ruby"
  ],
  "identifier.constant.predefined": [
    "constant.language.null",
    "constant.language.null.java",
    "constant.language.null.kotlin",
    "constant.language.null.js",
    "constant.language.null.ts",
    "constant.language.none.python",
    "constant.language.nil.go",
    "constant.language.nil.ruby",
    "constant.language.unit.rust",
    "constant.language.undefined.js",
    "support.constant.math"
  ],
  "identifier.variable": [
    "variable.other.readwrite.java",
    "variable.other.readwrite.kotlin",
    "variable.other.readwrite.js",
    "variable.other.readwrite.ts",
    "variable.other.readwrite.python",
    "variable.other.readwrite.go",
    "variable.other.readwrite.rust",
    "variable.other.readwrite.c",
    "variable.other.readwrite.cpp",
    "variable.other.readwrite.cs",
    "variable.other.readwrite.swift",
    "variable.other.readwrite.php",
    "variable.other.readwrite.ruby",
    "variable.other.normal.shell"
  ],
  "identifier.package.go": [
    "entity.name.namespace",
    "entity.name.namespace.java",
    "entity.name.namespace.kotlin",
    "entity.name.namespace.csharp",
    "entity.name.namespace.cpp",
    "entity.name.package",
    "entity.name.package.java",
    "entity.name.package.kotlin",
    "support.module.node.js",
    "support.module.node.ts"
  ],
  "identifier.this": [
    "variable.language.this.java",
    "variable.language.this.js",
    "variable.language.this.ts",
    "variable.language.self.python",
    "variable.language.self.ruby",
    "variable.language.self.swift"
  ],
  punctuation: [
    "punctuation.definition.parameters",
    "punctuation.definition.arguments",
    "punctuation.definition.block",
    "punctuation.section.block",
    "punctuation.terminator.statement",
    "punctuation.separator.delimiter"
  ],
  "punctuation.operator": [
    "keyword.operator.assignment",
    "keyword.operator.arithmetic",
    "keyword.operator.comparison",
    "keyword.operator.logical",
    "keyword.operator.expression",
    "keyword.operator.optional",
    "keyword.operator.nullable",
    "keyword.operator.spread",
    "keyword.operator.sql",
    "punctuation.separator.key-value"
  ],
  "attributeName.html": [
    "entity.other.attribute-name.jsx",
    "entity.other.attribute-name.tsx",
    "entity.other.attribute-name.vue",
    "entity.other.attribute-name.svelte"
  ],
  "attributeValue.html": [
    "string.quoted.jsx",
    "string.quoted.tsx",
    "string.quoted.vue",
    "string.quoted.svelte"
  ],
  "tagName.html": [
    "entity.name.tag.jsx",
    "entity.name.tag.tsx",
    "entity.name.tag.vue",
    "entity.name.tag.svelte"
  ],
  "tagName.custom.html": [
    "support.class.component.jsx",
    "support.class.component.tsx",
    "entity.name.tag.component.vue",
    "entity.name.tag.component.svelte"
  ],
  "key.json": [
    "support.type.property-name.jsonc",
    "meta.structure.dictionary.key.jsonc string.quoted.double.jsonc"
  ],
  "key.yaml": [
    "entity.name.tag.yaml",
    "support.type.property-name.yaml",
    "support.type.property-name.toml",
    "entity.name.section.group-title.ini",
    "keyword.other.definition.ini",
    "support.type.property-name.properties"
  ],
  "value.yaml": [
    "string.unquoted.toml",
    "constant.language.toml",
    "string.unquoted.ini",
    "string.unquoted.properties"
  ],
  "propertyName.css": [
    "support.type.property-name.scss",
    "support.type.property-name.sass",
    "support.type.property-name.less"
  ],
  "propertyValue.css": [
    "support.constant.property-value.scss",
    "support.constant.property-value.sass",
    "support.constant.property-value.less"
  ],
  "selector.css": [
    "entity.name.tag.scss",
    "entity.name.tag.sass",
    "entity.name.tag.less"
  ],
  "selector.class.css": [
    "entity.other.attribute-name.class.scss",
    "entity.other.attribute-name.class.sass",
    "entity.other.attribute-name.class.less"
  ],
  "selector.id.css": [
    "entity.other.attribute-name.id.scss",
    "entity.other.attribute-name.id.sass",
    "entity.other.attribute-name.id.less"
  ],
  "selector.pseudo.css": [
    "entity.other.attribute-name.pseudo-class.scss",
    "entity.other.attribute-name.pseudo-element.scss",
    "entity.other.attribute-name.pseudo-class.less",
    "entity.other.attribute-name.pseudo-element.less"
  ],
  "number.unit.css": [
    "keyword.other.unit.scss",
    "keyword.other.unit.sass",
    "keyword.other.unit.less"
  ],
  "markup.heading": [
    "punctuation.definition.heading.markdown",
    "markup.heading.setext"
  ],
  "markup.bold": [
    "punctuation.definition.bold.markdown"
  ],
  "markup.italic": [
    "punctuation.definition.italic.markdown"
  ],
  "markup.href": [
    "string.other.link.description.markdown",
    "markup.underline.link.image.markdown"
  ],
  "markup.code.block": [
    "markup.raw.inline.markdown",
    "markup.fenced_code.block.markdown punctuation.definition.markdown"
  ],
  link: [
    "markup.underline.link.http.hyperlink",
    "meta.link.inline.markdown"
  ],
  "diff.added": [
    "markup.inserted.diff",
    "meta.diff.header.to-file"
  ],
  "diff.deleted": [
    "markup.deleted.diff",
    "meta.diff.header.from-file"
  ],
  "diff.modified": [
    "markup.changed.diff",
    "meta.diff.range"
  ],
  "problem.error": [
    "invalid.illegal",
    "invalid.broken"
  ],
  "problem.warning": [
    "invalid.deprecated",
    "markup.warning"
  ]
};

const htmlCssTokenScopeMappings = {
  "tag.html": [
    "meta.tag.html",
    "meta.tag.structure.html",
    "meta.tag.metadata.html",
    "meta.tag.inline.html",
    "meta.tag.block.html",
    "meta.tag.any.html",
    "punctuation.definition.tag.begin.html",
    "punctuation.definition.tag.end.html",
    "punctuation.definition.tag.begin.xml",
    "punctuation.definition.tag.end.xml",
    "punctuation.definition.tag.html",
    "punctuation.definition.tag.xml"
  ],
  "tagName.html": [
    "meta.tag.html entity.name.tag.html",
    "meta.tag.structure.html entity.name.tag.html",
    "meta.tag.metadata.html entity.name.tag.html",
    "meta.tag.inline.html entity.name.tag.html",
    "meta.tag.block.html entity.name.tag.html",
    "meta.tag.any.html entity.name.tag.html",
    "entity.name.tag.html",
    "entity.name.tag.xml"
  ],
  "tagName.custom.html": [
    "meta.tag.html entity.name.tag.custom.html",
    "meta.tag.html support.class.component.html",
    "entity.name.tag.custom.html",
    "support.class.component.html"
  ],
  "attributeName.html": [
    "meta.tag.html entity.other.attribute-name.html",
    "meta.tag.structure.html entity.other.attribute-name.html",
    "meta.tag.metadata.html entity.other.attribute-name.html",
    "meta.tag.inline.html entity.other.attribute-name.html",
    "meta.tag.block.html entity.other.attribute-name.html",
    "meta.tag.any.html entity.other.attribute-name.html",
    "entity.other.attribute-name.html",
    "entity.other.attribute-name.xml"
  ],
  "attributeValue.html": [
    "meta.tag.html string.quoted.html",
    "meta.tag.html string.quoted.double.html",
    "meta.tag.html string.quoted.single.html",
    "meta.tag.structure.html string.quoted.html",
    "meta.tag.metadata.html string.quoted.html",
    "meta.tag.inline.html string.quoted.html",
    "meta.tag.block.html string.quoted.html",
    "meta.tag.any.html string.quoted.html",
    "meta.tag.html punctuation.definition.string.begin.html",
    "meta.tag.html punctuation.definition.string.end.html",
    "string.quoted.html",
    "string.quoted.xml"
  ],
  "entityReference.html": [
    "constant.character.entity.html",
    "constant.character.entity.xml",
    "punctuation.definition.entity.html"
  ],
  "keyword.css": [
    "keyword.control.at-rule.css",
    "keyword.control.at-rule.media.css",
    "keyword.control.at-rule.import.css",
    "keyword.control.at-rule.charset.css",
    "keyword.control.at-rule.supports.css",
    "keyword.control.at-rule.keyframes.css",
    "meta.at-rule.media.css keyword.control.at-rule.media.css",
    "meta.at-rule.css keyword.control.at-rule.css"
  ],
  "selector.css": [
    "source.css entity.name.tag.css",
    "source.css.embedded.html entity.name.tag.css",
    "meta.selector.css entity.name.tag.css",
    "meta.selector.css entity.other.attribute-name.css"
  ],
  "selector.tag.css": [
    "meta.selector.css entity.name.tag.css",
    "source.css.embedded.html meta.selector.css entity.name.tag.css",
    "entity.name.tag.css"
  ],
  "selector.id.css": [
    "meta.selector.css entity.other.attribute-name.id.css",
    "source.css.embedded.html entity.other.attribute-name.id.css",
    "entity.other.attribute-name.id.css",
    "punctuation.definition.entity.css"
  ],
  "selector.class.css": [
    "meta.selector.css entity.other.attribute-name.class.css",
    "source.css.embedded.html entity.other.attribute-name.class.css",
    "entity.other.attribute-name.class.css"
  ],
  "selector.pseudo.css": [
    "meta.selector.css entity.other.attribute-name.pseudo-class.css",
    "meta.selector.css entity.other.attribute-name.pseudo-element.css",
    "source.css.embedded.html entity.other.attribute-name.pseudo-class.css",
    "source.css.embedded.html entity.other.attribute-name.pseudo-element.css",
    "entity.other.attribute-name.pseudo-class.css",
    "entity.other.attribute-name.pseudo-element.css"
  ],
  "propertyName.css": [
    "meta.property-name.css",
    "meta.property-list.css meta.property-name.css",
    "meta.property-list.css support.type.property-name.css",
    "source.css.embedded.html meta.property-name.css",
    "source.css.embedded.html support.type.property-name.css",
    "support.type.property-name.css",
    "support.type.custom-property.name.css",
    "meta.property-name.css support.type.custom-property.name.css",
    "meta.property-list.css support.type.custom-property.name.css",
    "source.css.embedded.html support.type.custom-property.name.css",
    "variable.other.custom-property.css",
    "meta.property-name.css variable.other.custom-property.css"
  ],
  "propertyValue.css": [
    "meta.property-value.css support.constant.property-value.css",
    "meta.property-list.css meta.property-value.css support.constant.property-value.css",
    "source.css.embedded.html meta.property-value.css support.constant.property-value.css",
    "support.constant.property-value.css",
    "constant.language.color.css"
  ],
  "hex.css": [
    "meta.property-value.css constant.other.color.rgb-value.css",
    "meta.property-list.css constant.other.color.rgb-value.css",
    "source.css.embedded.html constant.other.color.rgb-value.css",
    "constant.other.color.rgb-value.css",
    "constant.other.color.rgb-value.hex.css"
  ],
  "number.css": [
    "meta.property-value.css constant.numeric.css",
    "meta.property-list.css constant.numeric.css",
    "source.css.embedded.html constant.numeric.css",
    "constant.numeric.css"
  ],
  "number.unit.css": [
    "meta.property-value.css keyword.other.unit.css",
    "meta.property-list.css keyword.other.unit.css",
    "source.css.embedded.html keyword.other.unit.css",
    "keyword.other.unit.css"
  ],
  "string.css": [
    "meta.property-value.css string.quoted.css",
    "meta.property-list.css string.quoted.css",
    "source.css.embedded.html string.quoted.css",
    "string.quoted.css",
    "string.quoted.double.css",
    "string.quoted.single.css"
  ],
  "identifier.css": [
    "source.css variable.css",
    "source.css.embedded.html variable.css",
    "meta.property-value.css variable.css",
    "meta.property-value.css variable.other.custom-property.css",
    "variable.css"
  ],
  "identifier.function.css": [
    "meta.function-call.css entity.name.function.css",
    "meta.property-value.css support.function.misc.css",
    "source.css.embedded.html support.function.misc.css",
    "support.function.misc.css",
    "entity.name.function.css"
  ],
  "identifier.variable.css": [
    "meta.function-call.css variable.parameter.css",
    "meta.property-value.css variable.parameter.css",
    "meta.property-value.css variable.parameter.url.css",
    "source.css.embedded.html variable.parameter.css",
    "source.css.embedded.html variable.parameter.url.css",
    "variable.parameter.css",
    "variable.parameter.url.css"
  ],
  "punctuation.css": [
    "source.css punctuation.css",
    "source.css.embedded.html punctuation.css",
    "punctuation.section.property-list.begin.bracket.curly.css",
    "punctuation.section.property-list.end.bracket.curly.css",
    "punctuation.separator.key-value.css",
    "punctuation.terminator.rule.css",
    "punctuation.separator.list.comma.css",
    "punctuation.definition.entity.css",
    "punctuation.definition.keyword.css",
    "punctuation.definition.string.begin.css",
    "punctuation.definition.string.end.css"
  ],
  "mixin.css": [
    "entity.name.function.mixin.css",
    "meta.function.mixin.css entity.name.function.css"
  ],
  "url.css": [
    "meta.property-value.css variable.parameter.url.css",
    "meta.property-value.css string.other.url.css",
    "source.css.embedded.html variable.parameter.url.css",
    "source.css.embedded.html string.other.url.css",
    "variable.parameter.url.css",
    "string.other.url.css"
  ],
  "interpolation.css": [
    "source.css.embedded.html",
    "source.css.embedded",
    "meta.embedded.css"
  ]
};

const semanticMappings = {
  namespace: "identifier.package.go",
  type: "identifier.type",
  class: "identifier.type.class",
  enum: "identifier.type.enum",
  interface: "identifier.interface",
  struct: "identifier.type.struct",
  typeParameter: "identifier.typeParameter",
  parameter: "identifier.parameter",
  variable: "identifier.variable",
  property: "identifier.field",
  enumMember: "identifier.constant",
  event: "identifier.function.call",
  function: "identifier.function.call",
  method: "identifier.function.call",
  macro: "identifier.constant.predefined",
  keyword: "keyword",
  modifier: "keyword.typeModifier",
  comment: "comment",
  string: "string",
  number: "number",
  regexp: "string.regexp",
  operator: "punctuation.operator",
  decorator: "metadata",
  "variable.readonly": "identifier.constant",
  "variable.defaultLibrary": "identifier.constant.predefined",
  "property.readonly": "identifier.constant",
  "function.declaration": "identifier.function.declaration",
  "method.declaration": "identifier.function.declaration",
  "method.static": "identifier.method.static",
  "class.declaration": "identifier.type.class",
  "interface.declaration": "identifier.interface",
  "type.defaultLibrary": "identifier.constant.predefined",
  "parameter.declaration": "identifier.parameter",
  "property.static": "identifier.field.static"
};

const additionalSemanticMappings = {
  control: "keyword",
  conditional: "keyword",
  repeat: "keyword",
  exception: "keyword",
  "keyword.control": "keyword",
  "keyword.conditional": "keyword",
  "keyword.repeat": "keyword",
  "keyword.exception": "keyword",
  "keyword.return": "keyword",
  "operator.logical": "keyword",
  "function.builtin": "identifier.constant.predefined",
  "type:html": "tagName.html",
  "class:html": "tagName.custom.html",
  "property:html": "attributeName.html",
  "property.declaration:html": "attributeName.html",
  "string:html": "attributeValue.html",
  "operator:html": "tag.html",
  "type:css": "selector.tag.css",
  "class:css": "selector.class.css",
  "property:css": "propertyName.css",
  "property.declaration:css": "propertyName.css",
  "property.readonly:css": "propertyName.css",
  "variable:css": "identifier.css",
  "variable.declaration:css": "propertyName.css",
  "function:css": "identifier.function.css",
  "keyword:css": "keyword.css",
  "keyword.control:css": "keyword.css",
  "string:css": "string.css",
  "number:css": "number.css",
  "operator:css": "punctuation.css",
  "type:scss": "selector.tag.css",
  "property:scss": "propertyName.css",
  "property.declaration:scss": "propertyName.css",
  "variable:scss": "identifier.css",
  "function:scss": "identifier.function.css",
  "keyword:scss": "keyword.css",
  "string:scss": "string.css",
  "number:scss": "number.css",
  "operator:scss": "punctuation.css",
  "type:less": "selector.tag.css",
  "property:less": "propertyName.css",
  "property.declaration:less": "propertyName.css",
  "variable:less": "identifier.css",
  "function:less": "identifier.function.css",
  "keyword:less": "keyword.css",
  "string:less": "string.css",
  "number:less": "number.css",
  "operator:less": "punctuation.css",
  label: "identifier.other",
  builtinType: "identifier.type.valueType",
  "namespace.declaration": "identifier.package.go",
  "type.declaration": "identifier.type",
  "type.readonly": "identifier.constant",
  "type.static": "identifier.type",
  "type.deprecated": "problem.deprecated",
  "class.abstract": "identifier.type.class",
  "class.static": "identifier.type.class",
  "class.defaultLibrary": "identifier.constant.predefined",
  "class.deprecated": "problem.deprecated",
  "enum.declaration": "identifier.type.enum",
  "enum.defaultLibrary": "identifier.constant.predefined",
  "enum.deprecated": "problem.deprecated",
  "interface.defaultLibrary": "identifier.constant.predefined",
  "interface.deprecated": "problem.deprecated",
  "struct.declaration": "identifier.type.struct",
  "struct.defaultLibrary": "identifier.constant.predefined",
  "struct.deprecated": "problem.deprecated",
  "typeParameter.declaration": "identifier.typeParameter",
  "parameter.readonly": "identifier.constant",
  "parameter.documentation": "comment.doc.value",
  "parameter.deprecated": "problem.deprecated",
  "variable.declaration": "identifier.variable",
  "variable.static": "identifier.constant",
  "variable.async": "identifier.variable",
  "variable.deprecated": "problem.deprecated",
  "variable.documentation": "comment.doc.value",
  "property.declaration": "identifier.field",
  "property.defaultLibrary": "identifier.constant.predefined",
  "property.deprecated": "problem.deprecated",
  "property.documentation": "comment.doc.value",
  "enumMember.readonly": "identifier.constant",
  "enumMember.defaultLibrary": "identifier.constant.predefined",
  "enumMember.deprecated": "problem.deprecated",
  "event.declaration": "identifier.function.declaration",
  "event.defaultLibrary": "identifier.constant.predefined",
  "event.deprecated": "problem.deprecated",
  "function.async": "identifier.function.call",
  "function.static": "identifier.method.static",
  "function.defaultLibrary": "identifier.constant.predefined",
  "function.deprecated": "problem.deprecated",
  "function.documentation": "comment.doc.value",
  "method.async": "identifier.function.call",
  "method.defaultLibrary": "identifier.constant.predefined",
  "method.deprecated": "problem.deprecated",
  "method.documentation": "comment.doc.value",
  "macro.declaration": "identifier.constant.predefined",
  "macro.defaultLibrary": "identifier.constant.predefined",
  "macro.deprecated": "problem.deprecated",
  "keyword.documentation": "comment.doc.tag",
  "modifier.documentation": "comment.doc.tag",
  "comment.documentation": "comment.doc",
  "string.documentation": "comment.doc.value",
  "number.documentation": "comment.doc.value",
  "regexp.documentation": "comment.doc.value",
  "operator.documentation": "comment.doc.tag",
  "decorator.declaration": "metadata",
  "decorator.defaultLibrary": "identifier.constant.predefined",
  "decorator.deprecated": "problem.deprecated"
};

const backgroundTextAttributeWorkbenchColors = new Set([
  "editor.selectionBackground",
  "editor.inactiveSelectionBackground",
  "editor.selectionHighlightBackground",
  "editor.wordHighlightBackground",
  "editor.wordHighlightStrongBackground",
  "editor.findMatchBackground",
  "editor.findMatchHighlightBackground",
  "editor.findRangeHighlightBackground",
  "editor.hoverHighlightBackground",
  "editor.lineHighlightBackground",
  "editor.lineHighlightBorder",
  "editorBracketMatch.background",
  "peekViewEditor.matchHighlightBackground",
  "peekViewResult.matchHighlightBackground",
  "editor.stackFrameHighlightBackground",
  "editor.focusedStackFrameHighlightBackground"
]);

// Fleet separates workbench surfaces with spacing ("islands"), not 1px seam lines.
// Mapping these region-separator borders to Fleet's `border` token drew faint white
// lines between same-colored chrome regions (title bar / activity bar / tabs / side
// bar). Force them transparent so those surfaces blend the way they do in Fleet.
const transparentSeamBorders = new Set([
  "titleBar.border",
  "activityBar.border",
  "sideBar.border",
  "sideBarActivityBarTop.border",
  "editorGroupHeader.tabsBorder",
  "editorGroupHeader.border",
  "panel.border",
  "statusBar.border"
]);

const styleValues = new Set(["ITALIC", "BOLD", "SEMI_BOLD", "LINE_THROUGH", "DASHED"]);
const hexColorPattern = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;

async function main() {
  const generated = [];

  for (const source of sources) {
    const fleetTheme = await readJson(source.source);
    validateSourceTheme(source.source, fleetTheme);

    const context = createThemeContext(source.source, fleetTheme);
    const vscodeTheme = buildVscodeTheme(source, fleetTheme, context);
    validateGeneratedTheme(source.output, vscodeTheme, context);

    const serialized = `${JSON.stringify(vscodeTheme, null, 2)}\n`;
    generated.push({ ...source, serialized });
  }

  if (checkOnly) {
    let hasMismatch = false;
    for (const item of generated) {
      const outputPath = path.join(root, item.output);
      let existing = "";
      try {
        existing = await readFile(outputPath, "utf8");
      } catch {
        hasMismatch = true;
        console.error(`${item.output} is missing. Run npm run build.`);
        continue;
      }
      if (existing !== item.serialized) {
        hasMismatch = true;
        console.error(`${item.output} is out of date. Run npm run build.`);
      }
    }
    if (hasMismatch) {
      process.exitCode = 1;
      return;
    }
    console.log("Generated VS Code themes are up to date.");
    return;
  }

  await mkdir(path.join(root, "themes"), { recursive: true });
  for (const item of generated) {
    await writeFile(path.join(root, item.output), item.serialized);
    console.log(`Wrote ${item.output}`);
  }
}

async function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  return JSON.parse(await readFile(filePath, "utf8"));
}

function validateSourceTheme(source, theme) {
  if (!theme || typeof theme !== "object") {
    throw new Error(`${source} must contain a JSON object.`);
  }
  for (const key of ["meta", "colors", "textAttributes", "palette"]) {
    if (!theme[key] || typeof theme[key] !== "object" || Array.isArray(theme[key])) {
      throw new Error(`${source} must contain an object at ${key}.`);
    }
  }
  if (!theme.meta["theme.name"]) {
    throw new Error(`${source} is missing meta.theme.name.`);
  }
}

function createThemeContext(source, theme) {
  const allowedColors = new Set();
  const resolvedReferences = new Set();

  for (const value of Object.values(theme.palette)) {
    if (!hexColorPattern.test(value)) {
      throw new Error(`${source} palette contains a non-hex color value: ${value}`);
    }
    allowedColors.add(value);
  }

  for (const literal of collectLiteralHexColors(theme.colors)) {
    allowedColors.add(literal);
  }
  for (const literal of collectLiteralHexColors(theme.textAttributes)) {
    allowedColors.add(literal);
  }

  function resolveColor(value, usage) {
    if (typeof value !== "string") {
      throw new Error(`${source}: ${usage} must be a string color reference.`);
    }
    if (hexColorPattern.test(value)) {
      allowedColors.add(value);
      resolvedReferences.add(value);
      return value;
    }
    if (Object.hasOwn(theme.palette, value)) {
      resolvedReferences.add(value);
      return theme.palette[value];
    }
    if (styleValues.has(value)) {
      throw new Error(`${source}: ${usage} is a style value, not a color: ${value}`);
    }
    throw new Error(`${source}: unresolved color reference ${value} at ${usage}`);
  }

  function color(keys) {
    const resolvedKeys = Array.isArray(keys) ? keys : [keys];
    for (const key of resolvedKeys) {
      if (Object.hasOwn(theme.colors, key)) {
        return resolveColor(theme.colors[key], `colors.${key}`);
      }
    }
    return undefined;
  }

  function textAttributeColor(keys, property = "foregroundColor") {
    const resolvedKeys = Array.isArray(keys) ? keys : [keys];
    for (const key of resolvedKeys) {
      const value = theme.textAttributes[key]?.[property];
      if (value !== undefined) {
        return resolveColor(value, `textAttributes.${key}.${property}`);
      }
      if (Object.hasOwn(theme.palette, key)) {
        return resolveColor(key, `palette.${key}`);
      }
    }
    return undefined;
  }

  function bestColor(keys, property = "foregroundColor") {
    const resolvedKeys = Array.isArray(keys) ? keys : [keys];
    for (const key of resolvedKeys) {
      if (Object.hasOwn(theme.colors, key)) {
        return resolveColor(theme.colors[key], `colors.${key}`);
      }
      const value = theme.textAttributes[key]?.[property];
      if (value !== undefined) {
        return resolveColor(value, `textAttributes.${key}.${property}`);
      }
    }
    return undefined;
  }

  return {
    source,
    theme,
    allowedColors,
    resolvedReferences,
    resolveColor,
    color,
    textAttributeColor,
    bestColor
  };
}

function collectLiteralHexColors(value, colors = new Set()) {
  if (typeof value === "string") {
    if (hexColorPattern.test(value)) {
      colors.add(value);
    }
    return colors;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectLiteralHexColors(item, colors);
    }
    return colors;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectLiteralHexColors(item, colors);
    }
  }
  return colors;
}

function buildVscodeTheme(source, fleetTheme, context) {
  return {
    $schema: "vscode://schemas/color-theme",
    name: fleetTheme.meta["theme.name"],
    type: source.type,
    semanticHighlighting: true,
    colors: buildWorkbenchColors(context),
    tokenColors: buildTokenColors(context),
    semanticTokenColors: buildSemanticTokenColors(context)
  };
}

function buildWorkbenchColors(context) {
  const colors = {};

  for (const [vscodeColor, fleetKeys] of [...workbenchMappings, ...additionalWorkbenchMappings]) {
    let value;
    if (backgroundTextAttributeWorkbenchColors.has(vscodeColor)) {
      value = context.bestColor(fleetKeys, "backgroundColor");
    } else if (vscodeColor.startsWith("editorIndentGuide.")) {
      value = context.textAttributeColor(fleetKeys);
    } else if (vscodeColor.startsWith("diffEditor.") && fleetKeys.some((key) => key.startsWith("diff."))) {
      value = context.textAttributeColor(fleetKeys, "backgroundColor");
    } else if (vscodeColor === "editorBracketMatch.background") {
      value = context.textAttributeColor(fleetKeys, "backgroundColor");
    } else {
      value = context.bestColor(fleetKeys);
    }

    if (value) {
      colors[vscodeColor] = value;
    }
  }

  // Remove same-colored chrome seams (see transparentSeamBorders above).
  for (const key of transparentSeamBorders) {
    colors[key] = "#FFFFFF00";
  }

  return colors;
}

function buildTokenColors(context) {
  const tokenColors = [];
  const mergedTokenScopeMappings = mergeTokenScopeMappings(
    mergeTokenScopeMappings(tokenScopeMappings, additionalTokenScopeMappings),
    htmlCssTokenScopeMappings
  );

  for (const [fleetToken, scopes] of Object.entries(mergedTokenScopeMappings)) {
    const attribute = context.theme.textAttributes[fleetToken];
    if (!attribute) {
      continue;
    }
    const settings = buildTextMateSettings(context, fleetToken, attribute);
    if (Object.keys(settings).length === 0) {
      continue;
    }
    tokenColors.push({
      name: fleetToken,
      scope: scopes,
      settings
    });
  }

  addDiagnosticToken(tokenColors, context, "problem.error", ["invalid", "invalid.illegal"]);
  addDiagnosticToken(tokenColors, context, "problem.warning", ["invalid.deprecated", "markup.warning"]);
  addDiagnosticToken(tokenColors, context, "problem.deprecated", ["invalid.deprecated"]);
  addDiagnosticToken(tokenColors, context, "diff.added", ["markup.inserted"]);
  addDiagnosticToken(tokenColors, context, "diff.deleted", ["markup.deleted"]);
  addDiagnosticToken(tokenColors, context, "diff.modified", ["markup.changed"]);

  return tokenColors;
}

function addDiagnosticToken(tokenColors, context, fleetToken, scopes) {
  const attribute = context.theme.textAttributes[fleetToken];
  if (!attribute) {
    return;
  }
  const settings = buildTextMateSettings(context, fleetToken, attribute);
  if (Object.keys(settings).length === 0) {
    return;
  }
  tokenColors.push({
    name: fleetToken,
    scope: scopes,
    settings
  });
}

function mergeTokenScopeMappings(baseMappings, extraMappings) {
  const merged = {};
  for (const [fleetToken, scopes] of Object.entries(baseMappings)) {
    merged[fleetToken] = [...scopes];
  }
  for (const [fleetToken, scopes] of Object.entries(extraMappings)) {
    merged[fleetToken] = [...new Set([...(merged[fleetToken] ?? []), ...scopes])];
  }
  return merged;
}

function buildTextMateSettings(context, fleetToken, attribute) {
  const settings = {};

  if (attribute.foregroundColor) {
    settings.foreground = context.resolveColor(attribute.foregroundColor, `textAttributes.${fleetToken}.foregroundColor`);
  }

  const fontStyle = toTextMateFontStyle(attribute);
  if (fontStyle) {
    settings.fontStyle = fontStyle;
  }

  return settings;
}

function toTextMateFontStyle(attribute) {
  const styles = [];

  if (attribute.fontStyle === "ITALIC") {
    styles.push("italic");
  }
  if (attribute.fontWeight === "BOLD" || attribute.fontWeight === "SEMI_BOLD") {
    styles.push("bold");
  }
  if (attribute.textDecoration?.type === "LINE_THROUGH") {
    styles.push("strikethrough");
  }

  return styles.join(" ");
}

function buildSemanticTokenColors(context) {
  const semanticTokenColors = {};
  const mergedSemanticMappings = {
    ...semanticMappings,
    ...additionalSemanticMappings
  };

  for (const [semanticToken, fleetToken] of Object.entries(mergedSemanticMappings)) {
    const attribute = context.theme.textAttributes[fleetToken];
    if (!attribute) {
      continue;
    }
    const style = buildSemanticStyle(context, fleetToken, attribute);
    if (Object.keys(style).length > 0) {
      semanticTokenColors[semanticToken] = style;
    }
  }

  return semanticTokenColors;
}

function buildSemanticStyle(context, fleetToken, attribute) {
  const style = {};

  if (attribute.foregroundColor) {
    style.foreground = context.resolveColor(attribute.foregroundColor, `textAttributes.${fleetToken}.foregroundColor`);
  }
  if (attribute.fontStyle === "ITALIC") {
    style.italic = true;
  }
  if (attribute.fontWeight === "BOLD" || attribute.fontWeight === "SEMI_BOLD") {
    style.bold = true;
  }
  if (attribute.textDecoration?.type === "LINE_THROUGH") {
    style.strikethrough = true;
  }

  return style;
}

function validateGeneratedTheme(output, theme, context) {
  const generatedColors = collectLiteralHexColors(theme);
  for (const color of generatedColors) {
    if (!context.allowedColors.has(color)) {
      throw new Error(`${output} contains a color not derived from ${context.source}: ${color}`);
    }
  }

  for (const [key, value] of Object.entries(theme.colors)) {
    if (typeof value !== "string" || !hexColorPattern.test(value)) {
      throw new Error(`${output} has an invalid VS Code workbench color at colors.${key}: ${value}`);
    }
  }

  for (const tokenColor of theme.tokenColors) {
    const foreground = tokenColor.settings?.foreground;
    if (foreground !== undefined && !hexColorPattern.test(foreground)) {
      throw new Error(`${output} has an invalid token foreground at ${tokenColor.name}: ${foreground}`);
    }
  }

  for (const [token, value] of Object.entries(theme.semanticTokenColors)) {
    const foreground = typeof value === "string" ? value : value.foreground;
    if (foreground !== undefined && !hexColorPattern.test(foreground)) {
      throw new Error(`${output} has an invalid semantic token foreground at ${token}: ${foreground}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
