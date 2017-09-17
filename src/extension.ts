'use strict';

import * as vscode from 'vscode';
import { workspace, window, commands } from "vscode";

import {Issues} from "./Issues";
import { IssueItemProvideer } from "./issueTreeProvider";
import { HtmlProvider } from "./HtmlProvider";

export function activate(context: vscode.ExtensionContext) {
    const htmlProvider = new HtmlProvider()

    console.log('Extension activated ...')

    let disposable = vscode.commands.registerCommand('extension.ghc', () => {
   
        const issues = new Issues(workspace.workspaceFolders[0].uri.path)
        issues.getIssues().then(res=>{
            console.log(res)
        })

        const issueItemProvider = new IssueItemProvideer(issues)
        vscode.window.registerTreeDataProvider('ghc.issue.treeView',issueItemProvider)

        console.log(workspace.workspaceFolders[0].uri.path)
    })

    let treeItemSelectCommand = vscode.commands.registerCommand('extension.ghc.treeItem.selected',(arg)=>{
        console.log('tree item is selected ')
        console.log(arg)
        htmlProvider.format(arg).then(html=>{
            workspace.openTextDocument({content:html,language:""}).then(doc => {
                commands.executeCommand('vscode.previewHtml',doc.uri,2,arg.title).then(res=>{
                    console.log(res)
                },err=>{
                    console.log(err)
                })
            },err=>{
                console.log(err)
            })
        })
    })

    context.subscriptions.push(disposable);
    context.subscriptions.push(treeItemSelectCommand)
}

export function deactivate() {
}