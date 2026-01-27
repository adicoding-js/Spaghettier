import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('🍝 Spaghetti Detector is now active!');

    // 1. Create the visual decoration type
    const spaghettiDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.3)', 
        after: {
            contentText: ' 🍝 Too saucy!',
            color: 'orange',
            fontStyle: 'italic'
        }
    });

    let activeEditor = vscode.window.activeTextEditor;

    function updateDecorations() {
        if (!activeEditor) { return; }

        const text = activeEditor.document.getText();
        const spaghettiLines: vscode.DecorationOptions[] = [];
        const lines = text.split(/\r\n|\r|\n/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Check for indentation (4 spaces = 1 tab usually)
            // If line has more than 16 spaces (4 levels deep), mark it
            const indentation = line.search(/\S/); 
            
            if (indentation > 16) { 
                const startPos = new vscode.Position(i, 0);
                const endPos = new vscode.Position(i, line.length);
                spaghettiLines.push({ range: new vscode.Range(startPos, endPos) });
            }
        }

        activeEditor.setDecorations(spaghettiDecorationType, spaghettiLines);
    }

    // Trigger updates
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