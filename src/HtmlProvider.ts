import { Issues } from './Issues';
const axios = require('axios')

export class HtmlProvider{

    private async _getIssues(url:string){
        let result = [];
        try{
            let data = await axios.get(url);
            result = data.data;
        }catch(e){
            console.error(e);
        }
        return result;
    }

    public async formatIssueData(arg:any){
        let output = '';
        try{
            let comments = await this._getIssues(arg.comments_url)
            output += `<h1> ${arg.title} </h1>
            <p><span> Description :  </span> ${arg.body}</p>
            <h2> comments:  </h2>`;
            comments = comments.map((_comment,i)=> {
                return `<li><p> <img src='${_comment.user.avatar_url}' />
                comment ${i} : #${_comment.id}# ${_comment.user.login} 
                </p>
                <p>${_comment.body}</p>
                </li>`;
            })
            output += '<ul>' + comments.join(' ') + '</ul>';
            output += 
            `<style>
                img{
                    max-width: 30px;
                    max-height: 30px;
                }    
            </style>`;
        }catch(e){
            output += 'Loading failed.. '+e.message;
            console.error(e);
        }
        return output;
    }

    private async getOpenIssues(path,milestoneIds){
        try{
            let issues = new Issues(path);
            let allIssues = await issues.getIssues();
            let assocIssues = milestoneIds.map(id => {
                return allIssues.filter(issue => {
                    return issue.milestone.id === id;
                })
            });
            return assocIssues;
        }catch(e){
            console.error(e);
            return [];
        }
    }

    public async formatMilestones(arg,path){
        
        console.log(arg);
        let output = '';
        try{
            let milestoneIds = arg.map((milestone,i) =>{
                return milestone.id;
            });
            
            let assocIssues = await this.getOpenIssues(path,milestoneIds);

            let milestones = arg.map((milestone,i) => {
                let issueList = assocIssues[i];
                let strIssueList = issueList.map(issue => {
                    return `<li> ${issue.title} #${issue.id} </li>`;
                }).join(' ');

                return ` <h2>${i}# ${milestone.title} ---Id : ${milestone.id}</h2> 
                <h3> description</h3>
                <p>${milestone.description}</p>
                <h3> created at ${milestone.created_at}</h3>
                <h3> updated at ${milestone.updated_at}</h3>
                <h3> Due on ${milestone.due_on}</h3>
                <h3> Open issue List : </h3>
                <ul> ${strIssueList} </ul>
                `;
            });
            output += '<ul><li>' + milestones.join(' </li><li> ') + '</li></ul>';
        }catch(e){
            output += 'Loading failed.. '+e.message;
            console.error(e);
        }
        return output;
    }
}