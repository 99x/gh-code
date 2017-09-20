import { workspace } from "vscode";

const jsonFile = require('jsonfile');
const fs = require('fs');
const configName = '/.gh-code';

export class Config{
    private _originUrl: string;
    private _token:string;

    private _readFile(){
        const file = workspace.workspaceFolders[0].uri.path + configName;
        if(fs.existsSync(file)){
            let obj = jsonFile.readFileSync(file);
            this._originUrl = obj.originUrl;
            this._token = obj.token;            
        }else{
            jsonFile.writeFileSync(file, {originUrl:'',token:''});
        }
    }

    private _saveFile(){
        const file = workspace.workspaceFolders[0].uri.path + configName;
        jsonFile.writeFileSync(file, {originUrl:this._originUrl,token:this._token});
    }

    constructor(){
        this._readFile();
    }

    public setOriginUrl(url:string){
        this._originUrl = url+'';
        this._saveFile();
    }

    public getOriginUrl():string{
        return this._originUrl;
    }

    public setToken(token:string){
        this._token = token;
        this._saveFile();
    }

    public getToken():string{
        return this._token;
    }
}