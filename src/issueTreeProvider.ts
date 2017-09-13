import * as vscode from 'vscode';
import { Issues } from "./Issues";

export class IssueItemProvideer implements vscode.TreeDataProvider<IssueItem>{
    private _onDidChangeTreeData: vscode.EventEmitter<IssueItem | undefined> = new vscode.EventEmitter<IssueItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<IssueItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private issues: Issues) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: IssueItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: IssueItem): Thenable<IssueItem[]> {
        if (element) {
            return Promise.resolve([])
        } else {
            return this._getIssues()
        }
    }

    private _getIssues() {
        return this.issues.getIssues().then(res => {
            return res.map((_issue) => {
                let label = _issue.title + ' #' + _issue.id
                /* Add a command to execute when item is selected */
                return new IssueItem(label, vscode.TreeItemCollapsibleState.None)
            })
        })
    }
}

class IssueItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    contextValue = 'issue';
}