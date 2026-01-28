// This Code is well formatted for easy reading and understanding, HAVE FUN!!! 💖

import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
    console.log('🍝 Spaghetti Detector is now active!');

    // 1) This Creates the visual decoration for "spaghetti" lines
    const spaghettiDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.3)', 
        after: {
            contentText: ' 🍝 Too saucy!',
            color: 'orange',
            fontStyle: 'italic'
        }
    });

    let activeEditor = vscode.window.activeTextEditor;
 // New decoration version with user settings

    function updateDecorations() {
        if (!activeEditor) { return; }

        const text = activeEditor.document.getText();
        const spaghettiLines: vscode.DecorationOptions[] = [];
        const lines = text.split(/\r\n|\r|\n/);

     // 1) This Retrives the User preferred settings
        const config = vscode.workspace.getConfiguration('spaghettiDetector');
        const maxDepth = config.get<number>('maxDepth') || 16;
        const customMessage = config.get<string>('message') || '🍝 Too saucy!';

    // 2) This Updates the decoration style to use the custom message
    // Note: We have recreate the decoration type if we want dynamic text
    // But for a simple version, we can just attach the message to the specific line.
      for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const indentation = line.search(/\S/);

            // This uses the variable 'maxDepth' from user settings instead of the default 16.
            if (indentation > maxDepth) { 
                const startPos = new vscode.Position(i, 0);
                const endPos = new vscode.Position(i, line.length);
                spaghettiLines.push({ 
                    range: new vscode.Range(startPos, endPos),
                    renderOptions: {
                        after: {
                            contentText: ` ${customMessage}`,  //Uses the User's custom message!
                        }
                    }
                });
            }
        }
        activeEditor.setDecorations(spaghettiDecorationType, spaghettiLines);
    }
    // Update when settings change
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('spaghettiDetector')) {
            updateDecorations();
        }
    }, null, context.subscriptions);

    // Original version without user settings

   /* function updateDecorations() {
        if (!activeEditor) { return; }

        const text = activeEditor.document.getText();
        const spaghettiLines: vscode.DecorationOptions[] = [];
        const lines = text.split(/\r\n|\r|\n/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

                   // CORE LOGIC for Identifying "spaghetti" lines
            // Checks for indentation (4 spaces = 1 tab usually)
            // If line has more than 16 spaces (4 levels deep), This marks it
            const indentation = line.search(/\S/); 
            
            if (indentation > 16) { 
                const startPos = new vscode.Position(i, 0);
                const endPos = new vscode.Position(i, line.length);
                spaghettiLines.push({ range: new vscode.Range(startPos, endPos) });
            }
        }

        activeEditor.setDecorations(spaghettiDecorationType, spaghettiLines);
    } */

    // This Triggers updates
    if (activeEditor) { updateDecorations(); }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) { updateDecorations(); }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);
}

export function deactivate() {}
