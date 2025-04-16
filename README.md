# install guide

## 1. before install

Install vscode and vscode extension: [Verilog-HDL/SystemVerilog/Bluespec SystemVerilog - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mshr-h.VerilogHDL)



## 2. next

Download or clone this repo to local and copy all files in `targetfiles`  to the directories which have the same name in vscode extension path（for example：`C:\Users\YourUsername\.vscode\extensions\mshr-h.veriloghdl-1.15.1`）



## 3. known issue

Whenever the VScode Verilog-HDL plugin is auto-updated, the hacked configuration files will be overwritten. 

You need to manually re-hack these target files and manually update the plugin version number in `package.json` to the latest version to avoid VScode auto-updating and overwriting again.
