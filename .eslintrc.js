module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': 'off',
        'no-debugger': 'off',
        'space-before-funtion-paren': 0,
        'eol-last': 0,
        'semi': 0,
        "indent": [0, 4], //缩进风格
        "no-multiple-empty-lines": [1, { "max": 2 }], //空行最多不能超过2行
        "key-spacing": [2, { "beforeColon": false, "afterColon": true }], //对象字面量中冒号的前后空格
        'space-before-function-paren': 0
    }
}