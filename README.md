# install guide

## 1. before install

Install vscode and vscode extension: [Verilog-HDL/SystemVerilog/Bluespec SystemVerilog - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mshr-h.VerilogHDL)



## 2. next

Download or clone this repo to local and copy all files in `targetfiles`  to the directories which have the same name in vscode extension path（for example：`C:\Users\YourUsername\.vscode\extensions\mshr-h.veriloghdl-1.15.1`）



## 3. known issue

1. Whenever the VScode Verilog-HDL plugin is auto-updated, the hacked configuration files will be overwritten. 

You need to manually turn off the VScode Verilog-HDL plugin's auto-update function.

2. when using the  vpp `let` out of a verilog module, ctags cannot  create symbol table correctly. Hover feature may not work in this case.

There is no way to solve this problem, because it needs to completely modify the ctag's src code to support VPP syntax.

