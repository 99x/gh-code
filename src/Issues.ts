import { Config } from './config';
import { window } from "vscode";
const gitRemoteOriginUrl = require('git-remote-origin-url');
const GitUrlParse = require("git-url-parse");
const axios = require('axios')
const api: string = 'https://api.github.com'
const config = new Config();
const gitLabel = require('git-label');

export class Issues {
    private _rootPath: string;

    constructor(rootPath: string) {
        this._rootPath = rootPath;
    }

    private async _getMetadata() {
        let gitRemoteUrl: string;

        if (config.getOriginUrl().length < 1) {
            gitRemoteUrl = await gitRemoteOriginUrl(this._rootPath);
        } else {
            gitRemoteUrl = config.getOriginUrl();
        }

        let remoteMetaData = GitUrlParse(gitRemoteUrl);
        let user = remoteMetaData.owner;
        let repo = remoteMetaData.name;
        return {
            user: user,
            repo: repo
        }
    }

    private async _checkLabel(label: string) {
        try {
            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/labels';
            let res = await axios.get(apiUrl);
            let labels = res.data;
            return labels.findIndex(_label => {
                return _label.name === label;
            });
        } catch (e) {
            console.error(e);
            return -1;
        }
    }

    private async _createLabel(label: string) {
        try {
            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/labels';
            let res = await axios.post(apiUrl, {
                "name": label
            }, {
                    auth: {
                        username: meta.user,
                        password: config.getToken()
                    }
                });
            return res;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async getIssues() {
        try {
            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues';
            let res = await axios.get(apiUrl);
            return res.data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async getMilestones(){
        try{
            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/milestones';
            let res = await axios.get(apiUrl);
            return res.data;
        }catch(e){
            console.error(e);
            return false;
        }
    }

    public async addLabel(label: string, number: number) {
        try {
            if (config.getToken().length < 1) {
                window.showInformationMessage('please add a token or set the password for adding labels');
                return false;
            }

            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues/' + number + '/labels';
            let checkResult = await this._checkLabel(label);

            if (checkResult === -1) {
                let res = await this._createLabel(label);
                if (res.status != 201) {
                    return false;
                }
            }

            let res = await axios.post(apiUrl, [label], {
                auth: {
                    username: meta.user,
                    password: config.getToken()
                }
            });
            return res.status === 200;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async removeLabel(label: string, number: number) {
        try{
            if (config.getToken().length < 1) {
                window.showInformationMessage('please add a token or set the password for adding labels');
                return false;
            }
            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues/' + number + '/labels/' + label;
            let res = await axios.delete(apiUrl, {
                auth: {
                    username: meta.user,
                    password: config.getToken()
                }
            });
            return res.status === 200;
        }catch(e){
            console.error(e);
            return false;
        }
    }

    public async addComment(comment:string,number:number){
        try{
            if (config.getToken().length < 1) {
                window.showInformationMessage('please add a token or set the password for adding labels');
                return false;
            }

            let meta = await this._getMetadata();
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues/' + number + '/comments';
            let res = await axios.post(apiUrl, {
                "body": comment
            } , {
                auth: {
                    username: meta.user,
                    password: config.getToken()
                }
            });
            return res.status === 201;
        }catch(e){
            console.error(e);
            return false;
        }
    }
}