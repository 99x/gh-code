'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated ...')

    let disposable = vscode.commands.registerCommand('extension.ghc', () => {
        vscode.window.showInformationMessage('ghc command issued ');
    })

    context.subscriptions.push(disposable);
}

export function deactivate() {
}