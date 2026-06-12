import * as vscode from 'vscode';

const KEYWORD_GROUPS: string[][] = [
    // VPP directive groups
    ['`if', '`elseif', '`else', '`endif'],
    ['`ifdef', '`else', '`endif'],
    ['`ifndef', '`else', '`endif'],
    ['`iflet', '`else', '`endif'],
    ['`ifnlet', '`else', '`endif'],
    ['`for', '`endfor'],
    ['`while', '`endwhile'],
    ['`func', '`endfunc'],
    ['`fori', '`endfori'],
    ['`switch', '`case', '`default', '`endswitch'],
    ['`switch', '`case', '`default', '`endsw'],
    ['`deflines', '`enddeflines'],
    ['`/*', '`*/'],
    // Verilog block groups
    ['begin', 'end'],
    ['module', 'endmodule'],
    ['function', 'endfunction'],
    ['task', 'endtask'],
    ['generate', 'endgenerate'],
    ['case', 'endcase'],
    ['casex', 'endcase'],
    ['casez', 'endcase'],
    ['class', 'endclass'],
    ['package', 'endpackage'],
    ['interface', 'endinterface'],
    ['program', 'endprogram'],
    ['specify', 'endspecify'],
    ['primitive', 'endprimitive'],
    ['table', 'endtable'],
    ['config', 'endconfig'],
    ['clocking', 'endclocking'],
    ['property', 'endproperty'],
    ['sequence', 'endsequence'],
    ['checker', 'endchecker'],
    ['fork', 'join'],
    ['fork', 'join_any'],
    ['fork', 'join_none'],
];

const ALL_MATCHABLE = new Set<string>();
for (const group of KEYWORD_GROUPS) {
    for (const kw of group) ALL_MATCHABLE.add(kw);
}

interface KeywordMatch {
    keyword: string;
    col: number;
    endCol: number;
}

function findAllKeywordsOnLine(line: string): KeywordMatch[] {
    const results: KeywordMatch[] = [];

    // VPP keywords (backtick-prefixed)
    const vppRegex = /`(if|elseif|else|endif|ifdef|ifndef|iflet|ifnlet|for|endfor|while|endwhile|func|endfunc|fori|endfori|switch|case|breaksw|default|endswitch|endsw|deflines|enddeflines)\b/g;
    let match;
    while ((match = vppRegex.exec(line)) !== null) {
        results.push({
            keyword: '`' + match[1],
            col: match.index,
            endCol: match.index + match[0].length,
        });
    }

    // VPP block comment markers
    const bcStart = /`\/\*/g;
    while ((match = bcStart.exec(line)) !== null) {
        results.push({ keyword: '`/*', col: match.index, endCol: match.index + 3 });
    }
    const bcEnd = /`\*\//g;
    while ((match = bcEnd.exec(line)) !== null) {
        results.push({ keyword: '`*/', col: match.index, endCol: match.index + 3 });
    }

    // Verilog keywords (word-boundary delimited, no backtick prefix)
    const verilogRegex = /\b(begin|end|module|endmodule|function|endfunction|task|endtask|generate|endgenerate|casex|casez|case|endcase|class|endclass|package|endpackage|interface|endinterface|program|endprogram|specify|endspecify|primitive|endprimitive|table|endtable|config|endconfig|clocking|endclocking|property|endproperty|sequence|endsequence|checker|endchecker|fork|join_any|join_none|join)\b/g;
    while ((match = verilogRegex.exec(line)) !== null) {
        if (match.index > 0 && line[match.index - 1] === '`') continue;
        results.push({
            keyword: match[0],
            col: match.index,
            endCol: match.index + match[0].length,
        });
    }

    results.sort((a, b) => a.col - b.col);
    return results;
}

function getKeywordAtCursor(line: string, cursorCol: number): KeywordMatch | null {
    const keywords = findAllKeywordsOnLine(line);
    for (const kw of keywords) {
        if (cursorCol >= kw.col && cursorCol <= kw.endCol) {
            return kw;
        }
    }
    return null;
}

function findMatchingGroups(keyword: string): string[][] {
    return KEYWORD_GROUPS.filter(group => group.includes(keyword));
}

function findMatchingKeyword(
    document: vscode.TextDocument,
    currentLine: number,
    currentCol: number,
    keyword: string
): { line: number; col: number } | null {
    const groups = findMatchingGroups(keyword);
    if (groups.length === 0) return null;

    for (const group of groups) {
        const idx = group.indexOf(keyword);
        if (idx === 0) {
            const result = searchForward(document, currentLine, currentCol, group);
            if (result) return result;
        } else if (idx === group.length - 1) {
            const result = searchBackward(document, currentLine, currentCol, group);
            if (result) return result;
        } else {
            const result = searchForwardFromMiddle(document, currentLine, currentCol, keyword, group);
            if (result) return result;
        }
    }
    return null;
}

function searchForward(
    document: vscode.TextDocument,
    startLine: number,
    startCol: number,
    group: string[]
): { line: number; col: number } | null {
    const opener = group[0];
    const closer = group[group.length - 1];
    const targets = new Set(group.slice(1));
    let depth = 1;

    for (let i = startLine; i < document.lineCount; i++) {
        const keywords = findAllKeywordsOnLine(document.lineAt(i).text);
        for (const kw of keywords) {
            if (i === startLine && kw.col <= startCol) continue;
            if (!group.includes(kw.keyword)) continue;

            if (kw.keyword === opener) {
                depth++;
            } else if (targets.has(kw.keyword)) {
                if (depth === 1) return { line: i, col: kw.col };
                if (kw.keyword === closer) depth--;
            }
        }
    }
    return null;
}

function searchBackward(
    document: vscode.TextDocument,
    startLine: number,
    startCol: number,
    group: string[]
): { line: number; col: number } | null {
    const opener = group[0];
    const closer = group[group.length - 1];
    let depth = 1;

    for (let i = startLine; i >= 0; i--) {
        const keywords = findAllKeywordsOnLine(document.lineAt(i).text);
        for (let k = keywords.length - 1; k >= 0; k--) {
            const kw = keywords[k];
            if (i === startLine && kw.col >= startCol) continue;
            if (!group.includes(kw.keyword)) continue;

            if (kw.keyword === closer) {
                depth++;
            } else if (kw.keyword === opener) {
                depth--;
                if (depth === 0) return { line: i, col: kw.col };
            }
        }
    }
    return null;
}

function searchForwardFromMiddle(
    document: vscode.TextDocument,
    startLine: number,
    startCol: number,
    currentKeyword: string,
    group: string[]
): { line: number; col: number } | null {
    const opener = group[0];
    const closer = group[group.length - 1];
    const laterKeywords = new Set(group.slice(group.indexOf(currentKeyword) + 1));
    let depth = 0;

    for (let i = startLine; i < document.lineCount; i++) {
        const keywords = findAllKeywordsOnLine(document.lineAt(i).text);
        for (const kw of keywords) {
            if (i === startLine && kw.col <= startCol) continue;
            if (!group.includes(kw.keyword)) continue;

            if (kw.keyword === opener) {
                depth++;
            } else if (kw.keyword === closer) {
                if (depth === 0) return { line: i, col: kw.col };
                depth--;
            } else if (laterKeywords.has(kw.keyword) && depth === 0) {
                return { line: i, col: kw.col };
            }
        }
    }
    return null;
}

class VppFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument,
        _context: vscode.FoldingContext,
        _token: vscode.CancellationToken
    ): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        const stack: { keyword: string; line: number }[] = [];
        const foldPairs: Record<string, string[]> = {
            '`if': ['`endif'],
            '`ifdef': ['`endif'],
            '`ifndef': ['`endif'],
            '`iflet': ['`endif'],
            '`ifnlet': ['`endif'],
            '`for': ['`endfor'],
            '`while': ['`endwhile'],
            '`func': ['`endfunc'],
            '`fori': ['`endfori'],
            '`switch': ['`endswitch', '`endsw'],
            '`deflines': ['`enddeflines'],
            '`/*': ['`*/'],
            'begin': ['end'],
            'module': ['endmodule'],
            'function': ['endfunction'],
            'task': ['endtask'],
            'generate': ['endgenerate'],
            'case': ['endcase'],
            'casex': ['endcase'],
            'casez': ['endcase'],
            'class': ['endclass'],
            'package': ['endpackage'],
            'interface': ['endinterface'],
            'program': ['endprogram'],
            'specify': ['endspecify'],
            'primitive': ['endprimitive'],
            'table': ['endtable'],
            'config': ['endconfig'],
            'clocking': ['endclocking'],
            'property': ['endproperty'],
            'sequence': ['endsequence'],
            'checker': ['endchecker'],
            'fork': ['join', 'join_any', 'join_none'],
        };

        const openerSet = new Set(Object.keys(foldPairs));
        const closerToOpener: Record<string, string[]> = {};
        for (const [opener, closers] of Object.entries(foldPairs)) {
            for (const closer of closers) {
                if (!closerToOpener[closer]) closerToOpener[closer] = [];
                closerToOpener[closer].push(opener);
            }
        }

        for (let i = 0; i < document.lineCount; i++) {
            const keywords = findAllKeywordsOnLine(document.lineAt(i).text);
            for (const kw of keywords) {
                if (openerSet.has(kw.keyword)) {
                    stack.push({ keyword: kw.keyword, line: i });
                } else if (closerToOpener[kw.keyword]) {
                    const expectedOpeners = closerToOpener[kw.keyword];
                    for (let j = stack.length - 1; j >= 0; j--) {
                        if (expectedOpeners.includes(stack[j].keyword)) {
                            const kind = kw.keyword === '`*/'
                                ? vscode.FoldingRangeKind.Comment
                                : vscode.FoldingRangeKind.Region;
                            ranges.push(new vscode.FoldingRange(stack[j].line, i, kind));
                            stack.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }

        // <script>...</script> blocks
        const scriptStack: number[] = [];
        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text.trim();
            if (lineText === '<script>') {
                scriptStack.push(i);
            } else if (lineText === '</script>' && scriptStack.length > 0) {
                const start = scriptStack.pop()!;
                ranges.push(new vscode.FoldingRange(start, i, vscode.FoldingRangeKind.Region));
            }
        }

        return ranges;
    }
}

export function activate(context: vscode.ExtensionContext) {
    const selector: vscode.DocumentSelector = { language: 'vpp', scheme: 'file' };
    const BRACKET_CHARS = new Set(['(', ')', '[', ']', '{', '}']);

    const jumpCommand = vscode.commands.registerCommand('vpp.matchKeyword', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'vpp') return;

        const document = editor.document;
        const position = editor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const col = position.character;

        // 1. Cursor on bracket → native bracket jump
        const charAtCursor = col < lineText.length ? lineText[col] : '';
        const charBefore = col > 0 ? lineText[col - 1] : '';
        if (BRACKET_CHARS.has(charAtCursor) || BRACKET_CHARS.has(charBefore)) {
            await vscode.commands.executeCommand('editor.action.jumpToBracket');
            return;
        }

        // 2. Cursor on a matchable keyword → keyword jump
        let found = getKeywordAtCursor(lineText, col);

        // 3. Fallback: first matchable keyword on the line
        if (!found) {
            const all = findAllKeywordsOnLine(lineText);
            found = all.find(kw => ALL_MATCHABLE.has(kw.keyword)) ?? null;
        }

        if (!found || !ALL_MATCHABLE.has(found.keyword)) {
            await vscode.commands.executeCommand('editor.action.jumpToBracket');
            return;
        }

        const target = findMatchingKeyword(document, position.line, found.col, found.keyword);
        if (!target) {
            await vscode.commands.executeCommand('editor.action.jumpToBracket');
            return;
        }

        const newPosition = new vscode.Position(target.line, target.col);
        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(
            new vscode.Range(newPosition, newPosition),
            vscode.TextEditorRevealType.InCenterIfOutsideViewport
        );
    });

    const foldingProvider = vscode.languages.registerFoldingRangeProvider(
        selector,
        new VppFoldingRangeProvider()
    );

    context.subscriptions.push(jumpCommand, foldingProvider);
}

export function deactivate() {}
