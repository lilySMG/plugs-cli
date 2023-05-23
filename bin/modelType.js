// 询问用户问题插件
const inquirer = require('inquirer');


const changeModelType = ({
    message = "请从以下选项选择：",
    choicesList=[],
    callBackFun = () => {}
} = {}) => {
    inquirer.prompt([{
        name: 'modelType',
        type: 'list',
        message: message,
        choices: choicesList
    }]).then((obj) => {
        callBackFun(obj)
    })
}

module.exports = changeModelType