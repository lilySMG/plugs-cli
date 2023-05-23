#! /usr/bin/env node
// #!开头代表这个文件被当做一个执行文件来执行，可以当做脚本运行。后面的/usr/bin/env node代表这个文件用node执行

// 引入命令交互插件
const { Command } = require('commander');
// self记录用户选择方法
const changeModelType = require('./modelType');
const program = new Command;

program
    .name('vueModel')
    .description('vue自定义脚手架')
    .version('0.0.1')

program.command('create <name>')
    .description('创建一个新工程')
    .action((name) => {
        console.log('工程名称：', name);
        // 获取文件路径插件
        const path = require('path')
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
                }, {
                    name: '合并',
                    value: 'merge'
                }, {
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
                            changeModelType({
                                message: `请选择前端框架模板：`,
                                choicesList: [{
                                    name: 'vue2移动端',
                                    value: 'vue2App'
                                }, {
                                    name: 'vue2电脑端',
                                    value: 'vue2PC'
                                }],
                                callBackFun: function (obj) {
                                    // 下载远程仓库显示动画,高版本不支持commonjs的加载方式
                                    // const ora  = require('ora');
                                    // 下载远程仓库显示动画,仓库很老代替换
                                    const download = require('download-github-repo');
                                    switch (obj.modelType) {
                                        case 'vue2App': {
                                            // vue2移动端项目需要插件
                                            (async () => {
                                                const ora = await (await import('ora')).default
                                                const spinner = ora('远端仓库开始下载...');
                                                spinner.start();
                                                // 下载远端仓库
                                                console.log(targetPath)
                                                //direct:https://github.com/vuejs/vue-cli/archive/refs/heads/master.zip
                                                https://github.com/vuejs/vue-cli/archive/refs/tags/v5.0.8.zip
                                                download('ianstormtaylor/download-github-repo#master', targetPath, (err) => {
                                                    if (err) {
                                                        spinner.fail('远端仓库下载失败');
                                                        console.log(err)
                                                    } else {
                                                        spinner.succeed('远端仓库下载成功');
                                                    }
                                                });
                                                console.log('vue2APP端项目需要插件');
                                            })();
                                            break;
                                        }
                                        case 'vue2PC':
                                            // vue2PC端项目需要插件
                                            console.log('vue2PC端项目需要插件')
                                            break;
                                        default:
                                            return;
                                    }
                                }
                            })
                            break;
                        }
                        case 'merge':
                            // merge,目前没写合并逻辑
                            console.log('合并目录文件，目前没写合并逻辑')
                            break;
                        default:
                            console.log('你选择了取消')
                            return;
                    }
                }
            })
        } else {
            // 目录不存在时正常创建
            fs.mkdirs(targetPath);
        }
    })

program.parse(process.argv)