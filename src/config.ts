import { workspace } from "vscode";

const jsonFile = require('jsonfile');
const fs = require('fs');
const configName = '/.gh-code';

export class Config {
    private _originUrl: string;
    private _token: string;

    private _readFile() {
        const file = workspace.workspaceFolders[0].uri.path + configName;
        const windowsFile = this._windowsPath(file);
        try {
            if (fs.existsSync(file)) {
                let obj = jsonFile.readFileSync(file);
                this._originUrl = obj.originUrl;
                this._token = obj.token;
            } else if (windowsFile) {
                let obj = jsonFile.readFileSync(windowsFile);
                this._originUrl = obj.originUrl;
                this._token = obj.token;
            } else {
                try {
                    jsonFile.writeFileSync(file, { originUrl: '', token: '' });
                } catch (ex) {
                    jsonFile.writeFileSync(windowsFile, { originUrl: '', token: '' });
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    public validatePath(filePath: string) {
        if (fs.existsSync(filePath)) {
            return filePath;
        } else {
            return this._windowsPath(filePath);
        }
    }

    private _windowsPath(filePath: string) {
        filePath = filePath.split('/').join('\\');
        filePath = filePath.replace('\\', '');
        filePath = filePath.charAt(0).toUpperCase() + filePath.substr(1);
        return filePath;
    }

    private _saveFile() {
        const file = workspace.workspaceFolders[0].uri.path + configName;
        const windowsFile = this._windowsPath(file);
        try {
            jsonFile.writeFileSync(file, { originUrl: this._originUrl, token: this._token });
        } catch (ex) {
            jsonFile.writeFileSync(windowsFile, { originUrl: this._originUrl, token: this._token });
        }
    }

    constructor() {
        this._readFile();
    }

    public setOriginUrl(url: string) {
        this._originUrl = url + '';
        this._saveFile();
    }

    public getOriginUrl(): string {
        return this._originUrl;
    }

    public setToken(token: string) {
        this._token = token;
        this._saveFile();
    }

    public getToken(): string {
        return this._token;
    }
}