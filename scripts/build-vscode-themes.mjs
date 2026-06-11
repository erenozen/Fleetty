#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const sources = [
  {
    source: "light-edited.json",
    output: "themes/fleet-light-edited-color-theme.json",
    type: "vs"
  },
  {
    source: "dark-edited.json",
    output: "themes/fleet-dark-edited-color-theme.json",
    type: "vs-dark"
  },
  {
    source: "dark_purple-edited.json",
    output: "themes/dark-purple-edited-color-theme.json",
    type: "vs-dark"
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
  ["textCodeBlock.background", ["snippet.content.background", "background.secondary"]],

  ["window.activeBorder", ["border.focused"]],
  ["window.inactiveBorder", ["border"]],

  ["activityBar.background", ["background.secondary"]],
  ["activityBar.foreground", ["text.primary"]],
  ["activityBar.inactiveForeground", ["text.secondary"]],
  ["activityBar.border", ["border"]],
  ["activityBar.activeBorder", ["border.focused"]],
  ["activityBar.activeBackground", ["listItem.background.selected", "background.primary"]],
  ["activityBarBadge.background", ["button.primary.background.default"]],
  ["activityBarBadge.foreground", ["button.primary.text.default"]],

  ["sideBar.background", ["background.secondary"]],
  ["sideBar.foreground", ["text.primary"]],
  ["sideBar.border", ["border"]],
  ["sideBarTitle.foreground", ["text.primary"]],
  ["sideBarSectionHeader.background", ["background.primary"]],
  ["sideBarSectionHeader.foreground", ["text.primary"]],
  ["sideBarSectionHeader.border", ["border"]],

  ["editorGroup.border", ["border"]],
  ["editorGroup.dropBackground", ["dragAndDrop.background"]],
  ["editorGroupHeader.tabsBackground", ["background.secondary"]],
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

  ["titleBar.activeBackground", ["background.secondary"]],
  ["titleBar.activeForeground", ["text.primary"]],
  ["titleBar.inactiveBackground", ["background.primary"]],
  ["titleBar.inactiveForeground", ["text.secondary"]],
  ["titleBar.border", ["border"]],

  ["statusBar.background", ["background.secondary"]],
  ["statusBar.foreground", ["statusBar.text.default", "text.primary"]],
  ["statusBar.border", ["border"]],
  ["statusBar.debuggingBackground", ["button.warning.background.default"]],
  ["statusBar.debuggingForeground", ["button.warning.text.default"]],
  ["statusBar.noFolderBackground", ["button.secondary.background.default", "background.secondary"]],
  ["statusBar.noFolderForeground", ["statusBar.text.default", "text.primary"]],
  ["statusBarItem.hoverBackground", ["ghostButton.off.background.hovered", "listItem.background.hovered"]],
  ["statusBarItem.remoteBackground", ["button.primary.background.default"]],
  ["statusBarItem.remoteForeground", ["button.primary.text.default"]],
  ["statusBarItem.errorBackground", ["button.dangerous.background.default"]],
  ["statusBarItem.errorForeground", ["button.dangerous.text.default"]],
  ["statusBarItem.warningBackground", ["button.warning.background.default"]],
  ["statusBarItem.warningForeground", ["button.warning.text.default"]],

  ["panel.background", ["background.primary"]],
  ["panel.border", ["border"]],
  ["panelTitle.activeForeground", ["text.primary"]],
  ["panelTitle.inactiveForeground", ["text.secondary"]],
  ["panelTitle.activeBorder", ["border.focused"]],
  ["panelInput.border", ["inputField.border.default", "border"]],
  ["panelSection.border", ["border"]],
  ["panelSectionHeader.background", ["background.secondary"]],
  ["panelSectionHeader.foreground", ["text.primary"]],
  ["panelSectionHeader.border", ["border"]],

  ["breadcrumb.foreground", ["text.secondary"]],
  ["breadcrumb.background", ["background.primary"]],
  ["breadcrumb.focusForeground", ["text.primary"]],
  ["breadcrumb.activeSelectionForeground", ["text.primary"]],
  ["breadcrumbPicker.background", ["popup.background"]],

  ["list.activeSelectionBackground", ["listItem.background.selected"]],
  ["list.activeSelectionForeground", ["listItem.text.selected"]],
  ["list.inactiveSelectionBackground", ["listItem.background.focused", "listItem.background.selected"]],
  ["list.inactiveSelectionForeground", ["listItem.text.focused", "listItem.text.selected"]],
  ["list.focusBackground", ["listItem.background.focused"]],
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

  ["editor.background", ["background.primary"]],
  ["editor.foreground", ["editor.text", "text.primary"]],
  ["editorLineNumber.foreground", ["editor.lineNumber.default"]],
  ["editorLineNumber.activeForeground", ["editor.lineNumber.current"]],
  ["editorCursor.foreground", ["editor.caret.border", "editor.caret.background"]],
  ["editorCursor.background", ["editor.caret.background"]],
  ["editor.selectionBackground", ["editor.selection.focused", "editor.currentLine.background.focused"]],
  ["editor.inactiveSelectionBackground", ["editor.selection", "editor.currentLine.background.default"]],
  ["editor.selectionHighlightBackground", ["editor.currentLine.background.focused"]],
  ["editor.wordHighlightBackground", ["editor.currentLine.background.default"]],
  ["editor.wordHighlightStrongBackground", ["editor.currentLine.background.focused"]],
  ["editor.findMatchBackground", ["search.match.background"]],
  ["editor.findMatchForeground", ["search.match.text"]],
  ["editor.findMatchHighlightBackground", ["editor.search.results", "search.match.background"]],
  ["editor.findRangeHighlightBackground", ["editor.currentLine.background.default"]],
  ["editor.hoverHighlightBackground", ["editor.currentLine.background.focused"]],
  ["editor.lineHighlightBackground", ["editor.currentLine.background.default"]],
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

  ["editorGutter.background", ["background.primary"]],
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
  ["editorDeprecated.foreground", ["text.disabled"]],

  ["diffEditor.insertedTextBackground", ["diff.added.word"]],
  ["diffEditor.removedTextBackground", ["diff.deleted.word"]],
  ["diffEditor.insertedLineBackground", ["diff.added"]],
  ["diffEditor.removedLineBackground", ["diff.deleted"]],
  ["diffEditor.modifiedLineBackground", ["diff.modified"]],
  ["diffEditor.border", ["border"]],
  ["diffEditor.diagonalFill", ["border"]],
  ["diffEditorOverview.insertedForeground", ["editor.gitDiff.background.added"]],
  ["diffEditorOverview.removedForeground", ["editor.gitDiff.background.deleted"]],
  ["diffEditorOverview.modifiedForeground", ["editor.gitDiff.background.modified"]],

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

  ["terminal.background", ["background.primary"]],
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
  identifier: ["variable", "variable.other.kotlin"],
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
  "propertyValue.css": ["support.constant.property-value.css", "constant.other.color.rgb-value.css"],
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
  "peekViewResult.matchHighlightBackground"
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

  for (const [vscodeColor, fleetKeys] of workbenchMappings) {
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

  return colors;
}

function buildTokenColors(context) {
  const tokenColors = [];

  for (const [fleetToken, scopes] of Object.entries(tokenScopeMappings)) {
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

  for (const [semanticToken, fleetToken] of Object.entries(semanticMappings)) {
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
