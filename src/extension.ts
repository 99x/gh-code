'use strict';

import * as vscode from 'vscode';
import { workspace, window, commands } from "vscode";

import { Issues } from "./Issues";
import { IssueItemProvideer } from "./issueTreeProvider";
import { HtmlProvider } from "./HtmlProvider";
import { Config } from "./config";

export function activate(context: vscode.ExtensionContext) {
    const htmlProvider = new HtmlProvider();
    const config = new Config();

    console.log('Extension activated ...');

    let issueListCommand = vscode.commands.registerCommand('extension.ghc', () => {
        const issues = new Issues(workspace.workspaceFolders[0].uri.path);
        const issueItemProvider = new IssueItemProvideer(issues);
        vscode.window.registerTreeDataProvider('ghc.issue.treeView', issueItemProvider);
    });

    let milestoneListCommand = vscode.commands.registerCommand('extension.ghc.list.milestones',() => {
        const issues = new Issues(workspace.workspaceFolders[0].uri.path);
        issues.getMilestones().then(res => {
            htmlProvider.formatMilestones(res).then(html => {
                workspace.openTextDocument({ content: html, language: "" }).then(doc => {
                    commands.executeCommand('vscode.previewHtml', doc.uri, 2,'Milestones').then(res => {
                        console.log(res);
                    }, err => {
                        console.error(err);
                    })
                }, err => {
                    console.error(err);
                });    
            }).catch(err => {
                console.error(err);
                window.showErrorMessage('Loading milestones failed to the display '+ err.message);    
            });
        }).catch(err => {
            console.error(err);
            window.showErrorMessage('Loading milestones failed '+ err.message);
        });
    });

    let originUrlSet = vscode.commands.registerCommand('extension.ghc.origin.url', () => {
        window.showInputBox().then(res => {
            config.setOriginUrl(res);
            window.showInformationMessage("Please reload the window ...");
            vscode.commands.getCommands().then(res => {
                res.forEach(r => {
                    console.log(r);
                })
            });
        });
    });

    let treeItemSelectCommand = vscode.commands.registerCommand('extension.ghc.treeItem.selected', (arg) => {
        console.log('tree item is selected ');
        console.log(arg);
        htmlProvider.formatIssueData(arg).then(html => {
            workspace.openTextDocument({ content: html, language: "" }).then(doc => {
                commands.executeCommand('vscode.previewHtml', doc.uri, 2, arg.title).then(res => {
                    console.log(res);
                }, err => {
                    console.error(err);
                })
            }, err => {
                console.error(err);
            });
        });
    });

    let addLabelCommand = vscode.commands.registerCommand('extension.ghc.add.label', (arg) => {
        window.showInputBox({ prompt: "Insert #issue number and 'Label Text'", placeHolder: "1# LABEL" }).then((arg) => {
            const issues = new Issues(workspace.workspaceFolders[0].uri.path);
            try {
                let temp = arg.split('#');
                issues.addLabel(temp[1].trim(), Number.parseInt(temp[0])).then(res => {
                    if (res) {
                        window.showInformationMessage("Added the label !!!");
                    } else {
                        window.showErrorMessage('Label Adding failed !!!');
                    }
                });
            } catch (e) {
                console.error(e);
                window.showErrorMessage('Did you enter the correct format ? ' + e.message);
            }
        });
    });

    let removeLabelCommand = vscode.commands.registerCommand('extension.ghc.remove.label', () => {
        window.showInputBox({
            prompt: "Insert #issue number and 'Label Text",
            placeHolder: "1# LABEL"
        }).then(arg => {
            const issues = new Issues(workspace.workspaceFolders[0].uri.path);
            try {
                let temp = arg.split('#');
                issues.removeLabel(temp[1].trim(), Number.parseInt(temp[0])).then(res => {
                    if (res) {
                        window.showInformationMessage("Removed the label !!!");
                    } else {
                        window.showErrorMessage('Label Removing failed !!!');
                    }
                });
            } catch (e) {
                console.error(e);
                window.showErrorMessage('Did you enter the correct format ? ' + e.message);
            }
        });
    });

    let addTokenCommand = vscode.commands.registerCommand('extension.ghc.add.token', () => {
        window.showInputBox({ prompt: "Insert token" }).then((arg) => {
            config.setToken(arg);
        });
    });

    let addCommentCommand = vscode.commands.registerCommand('extension.ghc.add.comment', () => {
        window.showInputBox({
            prompt: "Insert #issue number and 'comment Text",
            placeHolder: "1# COMMENT"
        }).then((arg) => {
            const issues = new Issues(workspace.workspaceFolders[0].uri.path);
            try {
                let temp = arg.split('#');
                issues.addComment(temp[1].trim(), Number.parseInt(temp[0])).then(res => {
                    if (res) {
                        window.showInformationMessage("Added the comment !!!");
                    } else {
                        window.showErrorMessage('Adding comment failed !!!');
                    }
                });
            } catch (e) {
                console.error(e);
                window.showErrorMessage('Did you enter the correct format ? ' + e.message);
            }
        });
    });

    context.subscriptions.push(issueListCommand);
    context.subscriptions.push(treeItemSelectCommand);
    context.subscriptions.push(originUrlSet);
    context.subscriptions.push(addLabelCommand);
    context.subscriptions.push(addTokenCommand);
    context.subscriptions.push(removeLabelCommand);
    context.subscriptions.push(addCommentCommand);
    context.subscriptions.push(milestoneListCommand);
}

export function deactivate() {
}