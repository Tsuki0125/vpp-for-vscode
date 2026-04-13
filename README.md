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

### 2. Code Folding

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

### 3. Keyword Jumping (Matchit)

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

### Option 1: Manual Install (Recommended)

1. Copy the entire plugin folder to your extensions directory:
   - **VSCode (Windows)**: `%USERPROFILE%\.vscode\extensions\vpp-language-1.0.0`
   - **Cursor (Windows)**: `%USERPROFILE%\.cursor\extensions\vpp-language-1.0.0`
   - **macOS**: `~/.vscode/extensions/vpp-language-1.0.0`
   - **Linux**: `~/.vscode/extensions/vpp-language-1.0.0`
2. Restart VSCode / Cursor

### Option 2: Package as VSIX

Requires Node.js:

```bash
npm install -g @vscode/vsce
cd vpp-language-1.0.0
npm install
npm run compile
vsce package
```

Then in VSCode/Cursor: Extensions → "..." → "Install from VSIX..."

### Option 3: Development Mode

1. Open the `vpp-language-1.0.0` folder in VSCode / Cursor
2. Press `F5` to launch the Extension Development Host

## Supported File Types

- `.vpp` — VPP files
- `.svpp` — SystemVerilog VPP files

## License

Internal use.
