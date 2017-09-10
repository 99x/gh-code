'use strict';

import * as vscode from 'vscode';
import { workspace } from "vscode";

import {Issues} from "./Issues";

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated ...')

    let disposable = vscode.commands.registerCommand('extension.ghc', () => {
   
        const issues = new Issues()
        issues.getIssues(workspace.workspaceFolders[0].uri.path).then(res=>{
            console.log(res)
        })

        console.log(workspace.workspaceFolders[0].uri.path)
        vscode.window.showInformationMessage('ghc command issued ');
    })

    context.subscriptions.push(disposable);
}

export function deactivate() {
}