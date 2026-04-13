[English](README.md) | [中文](#)

# VPP 语言扩展 - VSCode / Cursor

**VPP（Verilog 预处理器）** 语言支持插件，提供语法高亮、代码折叠和类 matchit 的关键字跳转功能。

VPP 在标准 Verilog 预处理指令基础上扩展了迭代、条件判断和函数等强大功能。本插件为 `.vpp` 和 `.svpp` 文件提供完整的编辑器支持。

## 功能

### 1. 语法高亮

- **VPP 指令**：\`if, \`else, \`endif, \`for, \`endfor, \`while, \`endwhile, \`func, \`endfunc, \`define, \`let, \`include, \`switch, \`case 等 30+ 个指令
- **VPP 注释**：\`// 行注释, \`/\* ... \`\*/ 块注释
- **VPP 变量引用**：\`variable\_name, \`(expression)
- **内置函数**：MAX, MIN, ABS, CEIL, FLOOR, LOG2CEIL, LOG2, JS 等
- **Verilog 关键字**：module, endmodule, always, wire, reg, input, output 等
- **嵌入 JavaScript**：`<script>...</script>` 代码块，自动启用 JS 语法高亮
- **字符串、数字（含 Verilog 字面量如 `4'b1010`）、运算符**等

### 2. 代码折叠

支持以下代码块的折叠：

| 开始关键字 | 结束关键字 |
|-----------|-----------|
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
| ... 以及更多 Verilog/SV 配对块 | |

### 3. 关键字跳转（Matchit）

类似 Vim matchit 的功能，在配对关键字之间循环跳转。

**快捷键**：`Ctrl+Shift+\`（Mac：`Cmd+Shift+\`）

同一个快捷键同时支持括号跳转和关键字跳转：

- **光标在括号** `()[]{}` **上** → 执行原生括号跳转
- **光标在关键字上** → 执行关键字匹配跳转
- **两者都不是** → 回退到原生括号跳转

支持的关键字跳转循环：

**VPP 指令：**

- \`if → \`elseif → \`else → \`endif → 回到 \`if
- \`ifdef / \`ifndef → \`else → \`endif
- \`for ↔ \`endfor
- \`while ↔ \`endwhile
- \`func ↔ \`endfunc
- \`fori ↔ \`endfori
- \`switch → \`case → \`default → \`endswitch
- \`deflines ↔ \`enddeflines
- \`/\* ↔ \`\*/

**Verilog / SystemVerilog 块：**

- begin ↔ end
- module ↔ endmodule
- function ↔ endfunction
- task ↔ endtask
- case / casex / casez ↔ endcase
- generate ↔ endgenerate
- fork ↔ join / join\_any / join\_none
- class, package, interface, program, specify, primitive, table, config, clocking, property, sequence, checker ↔ 对应的 `end*` 关键字

## 安装方法

### 方法一：手动安装（推荐）

1. 将整个插件文件夹复制到扩展目录：
   - **VSCode（Windows）**：`%USERPROFILE%\.vscode\extensions\vpp-language-1.0.0`
   - **Cursor（Windows）**：`%USERPROFILE%\.cursor\extensions\vpp-language-1.0.0`
   - **macOS**：`~/.vscode/extensions/vpp-language-1.0.0`
   - **Linux**：`~/.vscode/extensions/vpp-language-1.0.0`
2. 重启 VSCode / Cursor

### 方法二：打包安装

需要先安装 Node.js：

```bash
npm install -g @vscode/vsce
cd vpp-language-1.0.0
npm install
npm run compile
vsce package
```

然后在 VSCode/Cursor 中：扩展 → "..." → "从 VSIX 安装..."

### 方法三：开发模式

1. 在 VSCode/Cursor 中打开 `vpp-language-1.0.0` 文件夹
2. 按 `F5` 启动扩展开发宿主

## 支持的文件类型

- `.vpp` — VPP 文件
- `.svpp` — SystemVerilog VPP 文件

## 许可证

内部使用。
