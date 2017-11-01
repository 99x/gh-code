# gh-code

**A Visual Studio code plugin to easily manage issues in a git hub repository**

## How to start
- git clone 
- npm install
- cd gh-code
- code .
- start debugging
- It will launch a vs code instance with the extension

## How to use
### Linux 
- Copy plugin folder to your ~/.vscode/extensions/ folder
### windows
- Copy plugin folder to the .vscode/extensions folder

- And it will be available in your plugins.

## Commands

### Getting a list of issues
- ctrl + shift + p (Open command palate)
- ghc-issues
- ![](https://raw.githubusercontent.com/dilantha111/ghc-test/master/gifs/1.gif)
- clicking on each list item will open a window with the issue info

### Getting a list of milestones
- ctrl + shift + p (Open command palate)
- ghc-milestones
- will open up a window with a list of milestones with details on each milestones
- ![](https://raw.githubusercontent.com/dilantha111/ghc-test/master/gifs/2.gif)

### Adding meta data
- ***When you open a local repo. It automatically tries to retrive the origin url from the git meta data. But there can be situations you need to add a different origin url. Or if the local repository is not created by the git clone command an origin url wouldn't be exist. In such cases you have to add origin url***
- ***When you need to add labels or add comment etc. you have to be authenticated with the github. So you have to provide a token or your password. we strongly recommand a token.***

#### Adding token or password
- ctrl + shift + p (Open command palate)
- ghc-token add
- Enter the token or password in the input box. 
- Ctrl + R to restart the window 

#### Adding origin URL
- ctrl + shift + p (Open command palate)
- ghc-origin set url
- Enter the origin url in the input box
- Ctrl + R to restart the window

### Adding a label on an issue
- ctrl + shift + p (Open command palate)
- ghc-issues labels add
- Enter issue number followed by # and a space and the label name
- ![](https://raw.githubusercontent.com/dilantha111/ghc-test/master/gifs/3.gif)

### Removing a label on an issue
- ctrl + shift + p (Open command palate)
- ghc-issues labels remove
- Enter issue number followed by # and a space and the label name

### Adding a comment on an issue
- ctrl + shift + p (Open command palate)
- ghc-issues comment
- Enter issue number followed by # and a space and the comment text

#### Your contribution

We expect your contribution to improve this project. You may..

- Open [issues](https://guides.github.com/features/issues/) for bug reporting or new feature suggestions.
- Submit [pull requests](https://help.github.com/articles/about-pull-requests/) from your fork in order to close existing issues.

We encourage you to apply Github best practices for the communication and development through the repo.

Happy contributing! 

## Acknowledgement

gh-code is initially developed for the [Hacktitude](http://opensource.99xtechnology.com/hacktitude/) open source hackathon. Special thanks goes to project mentors [@rehrumesh](https://github.com/rehrumesh), [@lakindu95](https://github.com/lakindu95) and awesome [Dotitude Family](http://dotitude.com/) from [99xt](http://99xtechnology.com/).

## License

MIT © [99XT](https://github.com/99xt)
