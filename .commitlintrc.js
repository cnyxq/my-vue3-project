// @commitlint/config-conventional 规范集
// 它所规定的 commit 信息一般由两个部分: type 和 subject 组成
// type 指提交的类型
// subject 指提交的摘要信息
// <type>: <subject>
// 常用type值如下
// feat: 添加新功能
// fix: 修复bug
// chore: 一些不影响功能的更改
// docs: 专指文档的修改
// pref: 性能方面的优化
// refactor: 代码重构
// test: 添加一些测试代码
module.exports = {
  extends: ["@commitlint/config-conventional"]
};