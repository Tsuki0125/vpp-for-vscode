# install guide

## 1. before install

Install vscode and vscode extension: [Verilog-HDL/SystemVerilog/Bluespec SystemVerilog - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mshr-h.VerilogHDL)



**Cursor** is developed based on vscode, so you can also use it.



## 2. next

Download or clone this repo to local and copy all files in `targetfiles`  to the directories which have the same name in vscode extension path（for example：`C:\Users\YourUserName\.vscode\extensions\mshr-h.veriloghdl-1.15.1`）



if you are using Cursor, copy these target files to cursor's extension directory. (for example: `C:\Users\YourUserName\.cursor\extensions\mshr-h.veriloghdl-1.16.1-universal`)



## 3. known issue

1. Whenever the VScode Verilog-HDL plugin is auto-updated, the hacked configuration files will be overwritten. 

	* You need to manually turn **off** the VScode Verilog-HDL plugin's auto-update function.



2. when using the  vpp `let` out of a verilog module, ctags cannot create symbol table correctly. Hover feature may not work in this case.

	* There is no way to solve this problem, because it needs to completely modify the ctag's code to fully support VPP's syntax.







