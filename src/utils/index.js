import { createApp } from './vue.js';
import columnscroll from '../components/columnscroll/index.js';
import rowscroll from '../components/rowscroll/index.js';
import navigator from '../components/navigator/index.js';
import tabpanel from '../components/tabpanel/index.js';
import btn from '../components/btn/index.js';
import tablex from '../components/tablex/index.js';
import switchx from '../components/switchx/index.js';

window.dinglj = {};

/** 定义重载的函数 */
window.defunc = function(object, name, func) {
    const old = object[name];
    object[name] = function(...args) {
        if (args.length === func.length) {
            return func.apply(this, args);
        } else if (typeof old === 'function') {
            return old.apply(this, args);
        }
    }
}

/** 创建 Vue 应用, 并注册组件, 完成挂载对象 */
defunc(window.dinglj, 'createVue', function(object, id) {
    const app = createApp(object);
    app.component('columnscroll', columnscroll)
        .component('rowscroll', rowscroll)
        .component('navigator', navigator)
        .component('tabpanel', tabpanel)
        .component('btn', btn)
        .component('tablex', tablex)
        .component('switchx', switchx);
    app.mount(id);
});

/** 生成 uuid */
defunc(window.dinglj, 'uuid', function() {
    return dinglj.uuid('');
});

/** 生成 uuid */
defunc(window.dinglj, 'uuid', function(prefix) {
    return dinglj.uuid(prefix, 10)
});

/** 生成 uuid */
defunc(window.dinglj, 'uuid', function(prefix, length) {
    const randomNumber = Math.random() * 10000000;
    const subNumber = ('' + randomNumber).replace('.', '').substring(0, length);
    return `${ prefix }-${ subNumber }`;
});

/** 同步加载 css 样式 */
defunc(window.dinglj, 'linkCss', function (href) {
    if (dinglj.isDev()) {
        dinglj.linkCss('C:/Users/dinglj/OneDrive/javascripts/beta/', href);
    } else {
        dinglj.linkCss('https://dingljmt.github.io/primary/', href);
    }
});

/** 重载定义 groupBy, exp 如果是 string, 则取该属性名, 如果是 function, 则调用取 key */
defunc(window.dinglj, 'groupBy', (list, exp) => {
    let result = {};
    list.forEach(item => {
        let key = '';
        if (typeof exp == 'string') {
            key = item[exp];
        } else if (typeof exp == 'function') {
            key = exp(item);
        }
        if (result[key]) {
            result[key].push(item);
        } else {
            result[key] = [ item ];
        }
    });
    return result;
});

/** 根据选择器获取 DOM 元素 */
defunc(window.dinglj, 'query', (keyword) => {
    let result = [];
    result.push(...document.querySelectorAll(keyword));
    return result;
});

/** 根据 class 获取 DOM 元素 */
defunc(window.dinglj, 'byClass', (keyword) => {
    let result = [];
    result.push(...document.getElementsByClassName(keyword));
    return result;
});

/** 根据 id 获取 DOM 元素 */
defunc(window.dinglj, 'byId', (keyword) => {
    return document.getElementById(keyword);
});

/** 发送 get 请求 */
defunc(window.dinglj, 'get', (url) => {
    return dinglj.get(url, undefined);
});

/** 发送 get 请求 */
defunc(window.dinglj, 'get', (url, callback) => {
    return dinglj.get(url, callback, false);
});

/** 发送 get 请求 */
defunc(window.dinglj, 'get', (url, callback, sync) => {
    const http = new XMLHttpRequest();
    http.open('GET', url, sync);
    http.send();
    if (callback && http.readyState == 4 && http.status == 200) {
        callback(http.responseText);
    }
    return http.responseText;
});

/** 获取配置, 如果取不到则返回默认值 */
defunc(window.dinglj, 'getConfig', (data, path, _default) => {
    return dinglj.getConfig(data, path, _default, false);
});

/** 获取配置, 如果取不到则返回默认值, 并根据参数确认是否要报错 */
defunc(window.dinglj, 'getConfig', (data, path, _default, error) => {
    let result = data;
    for (let propName of path.split('.')) {
        result = result[propName];
        if (!result) { // 如果取不到值, 则报错并返回默认值
            if (error) {
                console.error(`${ path }: 配置不存在, 请检查脚本`);
            }
            return _default
        }
    }
    return result;
});

/** 有一个排好序的数组, 给定两个字符串, 比较出这两个字符串的大小 */
defunc(window.dinglj, 'compareStringByArray', (array, o1, o2) => {
    let idx1 = array.indexOf(o1) == -1 ? 9999 : array.indexOf(o1);
    let idx2 = array.indexOf(o2) == -1 ? 9999 : array.indexOf(o2);
    if (idx1 == idx2) {
        return o1 < o2 ? -1 : (o1 > o2 ? 1 : 0);
    }
    return idx1 - idx2;
});

/** 判断是不是开发模式 */
defunc(window.dinglj, 'isDev', () => {
    return window.dingljenv && window.dingljenv.toLowerCase().trim() == 'dev';
});

defunc(window.dinglj, 'calcTxtWidth', (item) => {
    if (typeof item == 'string') {
        return calcTxtWidth(item, '400', '12px', '微软雅黑');
    } else {
        const computedStyle = window.getComputedStyle(item);
        return dinglj.calcTxtWidth(item.innerText, computedStyle.fontWeight, computedStyle.fontSize, computedStyle.fontFamily);
    }
});

defunc(window.dinglj, 'calcTxtWidth', (txt, fontWeight, fontSize, fontFamily) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${ fontWeight } ${ fontSize } ${ fontFamily }`;
    const { width } = ctx.measureText(txt);
    return parseInt(width);
});