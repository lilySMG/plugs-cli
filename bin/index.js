#! /usr/bin/env node
// #!开头代表这个文件被当做一个执行文件来执行，可以当做脚本运行。后面的/usr/bin/env node代表这个文件用node执行

// 引入命令交互插件
const { Command } = require('commander');
// self记录用户选择方法
const changeModelType = require('./modelType');
// self用户项目类型的交互函数
const changeProjectType = require('./projectType');
const program = new Command;
// 获取文件路径插件
const path = require('path');



program
    .name('vueModel')
    .description('vue自定义脚手架')
    .version('0.0.1')

program.command('create <name>')
    .description('创建一个新工程')
    .action((name) => {
        console.log('工程名称：', name);

        // 操作文件插件
        const fs = require('fs-extra')

        // 当前命令行执行的目录
        const cwd = process.cwd()

        // 需要创建的目录
        const targetPath = path.join(cwd, name)

        // 判断目录是否存在
        if (fs.existsSync(targetPath)) {
            // 选择目录文件
            changeModelType({
                message: `目录${targetPath}已经存在,请选择：`,
                choicesList: [{
                    name: '覆盖',
                    value: 'overwrite'
                },
                // 目前没有合并逻辑{name: '合并',value: 'merge'}
                {
                    name: '取消',
                    value: 'cancle'
                }],
                callBackFun: function (obj) {
                    switch (obj.modelType) {
                        case 'overwrite': {
                            // 移除原有目录
                            fs.remove(targetPath).then(() => {
                                fs.mkdirs(targetPath);
                            });
                            changeProjectType(targetPath);
                            break;
                        }
                        default:
                            console.log('你选择了取消')
                            return;
                    }
                }
            })
        } else {
            // 目录不存在时正常创建
            fs.mkdirs(targetPath);
            changeProjectType(targetPath);
        }
    })

program.parse(process.argv)