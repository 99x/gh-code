const gitRemoteOriginUrl = require('git-remote-origin-url');
const GitUrlParse = require("git-url-parse"); 
const axios = require('axios')
const api:string = 'https://api.github.com'

export class Issues{
    private _rootPath:string

    constructor(rootPath:string){
        this._rootPath = rootPath
    }

    private async _getMetadata(){
        let gitRemoteUrl = await gitRemoteOriginUrl(this._rootPath)
        let remoteMetaData = GitUrlParse(gitRemoteUrl)
        let user = remoteMetaData.owner
        let repo = remoteMetaData.name

        return {
            user: user,
            repo: repo
        }
    }

    public async getIssues(){
        try{
            let meta = await this._getMetadata()
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues'
            let res = await axios.get(apiUrl)
            return res.data
        }catch(e){
            console.log(e)
            return false 
        }
    }

    public async addLabel(label:string,number:number){
        try{
            let meta = await this._getMetadata()
            let apiUrl = api + '/repos/' + meta.user + '/' + meta.repo + '/issues/' + number + '/labels'
            let res = await axios.post(apiUrl,label)
            console.log(res)
        }catch(e){
            console.log(e)
            return false
        }
    }
}