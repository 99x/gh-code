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

    public async format(arg:any){
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
}