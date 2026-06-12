[English](#) | [中文](README.zh-CN.md)

# VPP Language Extension for VSCode / Cursor

Language support for **VPP (Verilog Preprocessor)** — providing syntax highlighting, code folding, and matchit-style keyword jumping.

VPP extends standard Verilog preprocessor directives with powerful iteration, conditional, and function constructs. This extension brings first-class editor support for `.vpp` and `.svpp` files.

## Features

### 1. Syntax Highlighting

- **VPP directives**: \`if, \`else, \`endif, \`for, \`endfor, \`while, \`endwhile, \`func, \`endfunc, \`define, \`let, \`include, \`switch, \`case, and 30+ more
- **VPP comments**: \`// line comments, \`/\* ... \`\*/ block comments
- **VPP variable references**: \`variable\_name, \`(expression)
- **Built-in functions**: MAX, MIN, ABS, CEIL, FLOOR, LOG2CEIL, LOG2, JS, etc.
- **Verilog keywords**: module, endmodule, always, wire, reg, input, output, etc.
- **Embedded JavaScript**: `<script>...</script>` blocks with JS syntax highlighting
- **Strings, numbers (including Verilog literals like `4'b1010`), operators**

### 2. Block & Bracket Pair Colorization

In addition to standard `()`, `[]`, `{}`, Verilog/SystemVerilog block keyword pairs are treated as brackets, so VS Code's built-in **Bracket Pair Colorization** colors each nesting level with a different color (just like nested parentheses):

| Open | Close |
|------|-------|
| begin | end |
| module | endmodule |
| function | endfunction |
| task | endtask |
| generate | endgenerate |
| case / casex / casez | endcase |
| class, package, interface, program, specify, primitive, table, config, clocking, property, sequence, checker | their `end*` counterparts |
| fork | join / join\_any / join\_none |

This relies on the editor setting `editor.bracketPairColorization.enabled` (on by default). You can customize the colors via the `workbench.colorCustomizations` → `editorBracketHighlight.foreground1..6` theme keys.

> Note: VPP backtick directives (\`if / \`endif, \`for / \`endfor, …) are **not** included here — VS Code's bracket engine cannot reliably distinguish prefixes like \`if vs \`ifdef. They remain fully supported by folding and keyword jumping below.

### 3. Code Folding

Supports folding for the following block pairs:

| Open | Close |
|------|-------|
| \`if / \`ifdef / \`ifndef | \`endif |
| \`for | \`endfor |
| \`while | \`endwhile |
| \`func | \`endfunc |
| \`fori | \`endfori |
| \`switch | \`endswitch / \`endsw |
| \`deflines | \`enddeflines |
| \`/\* | \`\*/ |
| `<script>` | `</script>` |
| begin | end |
| module | endmodule |
| function | endfunction |
| task | endtask |
| case / casex / casez | endcase |
| generate | endgenerate |
| fork | join / join\_any / join\_none |
| ... and more Verilog/SV block pairs | |

### 4. Keyword Jumping (Matchit)

Vim matchit-style cycling between paired keywords.

**Shortcut**: `Ctrl+Shift+\` (Mac: `Cmd+Shift+\`)

The same shortcut handles both bracket jumping and keyword jumping:

- **Cursor on a bracket** `()[]{}` → native bracket jump
- **Cursor on a keyword** → keyword match jump
- **Neither** → falls back to native bracket jump

Supported keyword cycles:

**VPP directives:**

- \`if → \`elseif → \`else → \`endif → back to \`if
- \`ifdef / \`ifndef → \`else → \`endif
- \`for ↔ \`endfor
- \`while ↔ \`endwhile
- \`func ↔ \`endfunc
- \`fori ↔ \`endfori
- \`switch → \`case → \`default → \`endswitch
- \`deflines ↔ \`enddeflines
- \`/\* ↔ \`\*/

**Verilog / SystemVerilog blocks:**

- begin ↔ end
- module ↔ endmodule
- function ↔ endfunction
- task ↔ endtask
- case / casex / casez ↔ endcase
- generate ↔ endgenerate
- fork ↔ join / join\_any / join\_none
- class, package, interface, program, specify, primitive, table, config, clocking, property, sequence, checker ↔ their `end*` counterparts

## Installation

> `<version>` below is a placeholder — replace it with the actual version number (the `version` field in `package.json`, e.g. `1.1.0`).

### Option 1: Install from VSIX (Recommended)

1. Get the prebuilt `vpp-language-<version>.vsix` package.
2. In VSCode / Cursor: open the **Extensions** panel → click the "**...**" menu in the top-right → **"Install from VSIX..."** → select the `.vsix` file.
3. Reload the window if prompted.

> Tip: If you previously installed an older version, uninstall it first so the new publisher/version takes effect.

### Option 2: Manual Folder Install

1. Copy the entire plugin folder to your extensions directory:
   - **VSCode (Windows)**: `%USERPROFILE%\.vscode\extensions\vpp-language-<version>`
   - **Cursor (Windows)**: `%USERPROFILE%\.cursor\extensions\vpp-language-<version>`
   - **macOS**: `~/.vscode/extensions/vpp-language-<version>`
   - **Linux**: `~/.vscode/extensions/vpp-language-<version>`
2. Restart VSCode / Cursor

### Option 3: Build the VSIX from Source

Requires Node.js:

```bash
npm install -g @vscode/vsce
cd vpp-language-<version>
npm install
npm run compile
vsce package
```

This produces a `.vsix` file you can install via Option 1.

### Option 4: Development Mode

1. Open the `vpp-language-<version>` folder in VSCode / Cursor
2. Press `F5` to launch the Extension Development Host

## Supported File Types

- `.vpp` — VPP files
- `.svpp` — SystemVerilog VPP files

## License

Internal use.
