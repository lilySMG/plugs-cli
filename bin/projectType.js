// 获取文件路径插件
const path = require('path');
// 读取用户添加配置文件
const { readFileSync } = require('fs');
const configData = JSON.parse(readFileSync(path.join(__dirname, 'config.json')));
// self记录用户选择方法
const changeModelType = require('./modelType');

// self用户项目类型的交互函数

const changeProjectType = (targetPath) => {
    changeModelType({
        message: `请选择前端框架模板：`,
        choicesList: configData.projectTypeList,
        callBackFun: function (obj, $this) {
            // 下载远程仓库显示动画,高版本不支持commonjs的加载方式
            // const ora  = require('ora');
            // 下载远程仓库显示动画,仓库很老代替换
            const download = require('download-git-repo');
            (async () => {
                const ora = await (await import('ora')).default;
                const spinner = ora('远端仓库开始下载...');
                spinner.start();
                // 下载远端仓库
                const downloadS = $this.filter((item) => {
                    if (item.value === obj.modelType) {
                        return item
                    }
                });
                download(`direct:${downloadS[0].gitSource}`, targetPath, { clone: true }, function (err) {
                    if (err) {
                        spinner.fail('远端仓库下载失败');
                    } else {
                        spinner.succeed('远端仓库下载成功');
                    }
                });
            })();
        }
    })
}

module.exports = changeProjectType