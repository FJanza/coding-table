// editor-settings.js
// Lógica para el modal de configuración del editor Monaco

export function setupEditorSettingsModal({monaco, editors}) {
  const $settingsBtn = document.getElementById("settings");
  const $settingsModal = document.getElementById("settingsModal");
  const $closeSettings = document.getElementById("closeSettings");
  const $saveSettings = document.getElementById("saveSettings");
  const $editorTheme = document.getElementById("editorTheme");
  const $editorFontSize = document.getElementById("editorFontSize");
  const $editorTabSize = document.getElementById("editorTabSize");
  const $editorInsertSpaces = document.getElementById("editorInsertSpaces");
  const $editorLineNumbers = document.getElementById("editorLineNumbers");
  const $editorMinimap = document.getElementById("editorMinimap");
  const $editorWordWrap = document.getElementById("editorWordWrap");
  const $editorGlyphMargin = document.getElementById("editorGlyphMargin");
  const $editorRenderWhitespace = document.getElementById(
    "editorRenderWhitespace"
  );
  const $editorJsSuggest = document.getElementById("editorJsSuggest");

  // Mostrar modal
  $settingsBtn.addEventListener("click", () => {
    $settingsModal.style.display = "flex";
    // Opcional: cargar valores actuales
    if (editors[0]) {
      $editorFontSize.value =
        (editors[0].getOption &&
          editors[0].getOption(monaco.editor.EditorOption.fontSize)) ||
        14;
      $editorTabSize.value =
        (editors[0].getOption &&
          editors[0].getOption(monaco.editor.EditorOption.tabSize)) ||
        2;
      $editorInsertSpaces.value =
        (editors[0].getOption &&
          editors[0].getOption(monaco.editor.EditorOption.insertSpaces)) ||
        "false";
      $editorLineNumbers.value =
        editors[0].getOption &&
        editors[0].getOption(monaco.editor.EditorOption.lineNumbers) === "on"
          ? "on"
          : "off";
      $editorMinimap.value = (
        editors[0].getOption &&
        editors[0].getOption(monaco.editor.EditorOption.minimap)
      ).enabled
        ? "on"
        : "off";
      $editorWordWrap.value =
        (editors[0].getOption &&
          editors[0].getOption(monaco.editor.EditorOption.wordWrap)) ||
        "off";
      $editorGlyphMargin.value =
        editors[0].getOption &&
        editors[0].getOption(monaco.editor.EditorOption.glyphMargin)
          ? "true"
          : "false";
      $editorRenderWhitespace.value =
        (editors[0].getOption &&
          editors[0].getOption(monaco.editor.EditorOption.renderWhitespace)) ||
        "none";
      // Para autocompletado JS
      if (editors[2]) {
        $editorJsSuggest.value =
          editors[2].getOption &&
          editors[2].getOption(
            monaco.editor.EditorOption.suggestOnTriggerCharacters
          )
            ? "on"
            : "off";
      }
    }
  });

  // Cerrar modal
  $closeSettings.addEventListener("click", () => {
    $settingsModal.style.display = "none";
  });

  // Guardar y aplicar settings
  $saveSettings.addEventListener("click", () => {
    const theme = $editorTheme.value;
    const fontSize = parseInt($editorFontSize.value, 10);
    const tabSize = parseInt($editorTabSize.value, 10);
    const insertSpaces = $editorInsertSpaces.value === "true";
    const lineNumbers = $editorLineNumbers.value === "on" ? "on" : true;
    const minimap = {enabled: $editorMinimap.value === "on"};
    const wordWrap = $editorWordWrap.value;
    const glyphMargin = $editorGlyphMargin.value === "true";
    const renderWhitespace = $editorRenderWhitespace.value;
    const jsSuggest = $editorJsSuggest.value === "on";

    monaco.editor.setTheme(theme);
    editors.forEach((editor, idx) => {
      editor.updateOptions({
        fontSize,
        tabSize,
        insertSpaces,
        lineNumbers,
        minimap,
        wordWrap,
        glyphMargin,
        renderWhitespace,
        // Solo para JS: autocompletado
        ...(idx === 2 ? {suggestOnTriggerCharacters: jsSuggest} : {}),
      });
    });
    $settingsModal.style.display = "none";
  });
}
