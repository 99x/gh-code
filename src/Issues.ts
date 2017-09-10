const gitRemoteOriginUrl = require('git-remote-origin-url');
const GitUrlParse = require("git-url-parse"); 
const axios = require('axios')

export class Issues{
    public async getIssues(rootPath:string){
        try{
            let gitRemoteUrl = await gitRemoteOriginUrl(rootPath)
            let remoteMetaData = GitUrlParse(gitRemoteUrl)
            let user = remoteMetaData.owner
            let repo = remoteMetaData.name
            let apiUrl = 'https://api.github.com' + '/repos/' + user + '/' + repo + '/issues'
            let res = await axios.get(apiUrl)
            return res.data
        }catch(e){
            console.log(e)
            return false 
        }
    }
}