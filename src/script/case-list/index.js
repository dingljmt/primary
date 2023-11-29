import '../../utils/index.js';
import { Case } from './entity/Case.js';
import { LangItem } from '../../entity/LangItem.js';

dinglj.linkCss('assets/css/utils.css');
dinglj.linkCss('assets/css/vue.css');
dinglj.linkCss('src/script/case-list/index.css');

document.body.innerHTML = `<div id="case-list-dinglj-container">
    <Navigator :menus="componentNames" @on-change="onNavChange"></Navigator>
    <div id="right-of-navigator">
        <div id="case-filter">
            <SwitchX>
                <template v-slot:pre>表格视图</template>
                <template v-slot:post>卡片视图</template>
            </SwitchX>
        </div>
        <div id="case-list-view">
            <ColumnScroll :current-idx="idx.component || 0" :size="componentNames.length">
                <TabPanel v-for="componentName in componentNames" @on-change="onTabChange"
                        :names="statusNames(componentName).map(name => { return { 'label': constant.status[name].zh, 'value': name }; })" 
                        :get-tab-name="name => name.label + '(' + groupByStatus(componentName)[name.value].length + ')'">
                    <RowScroll :current-idx="idx.components[componentName] || 0" :size="statusNames(componentName).length">
                        <TableX v-for="statusName in statusNames(componentName)" class="every-tab" @on-loaded="postTableShow" 
                                :columns="getColumnsToDisplay(componentName, statusName)"  
                                :data="groupByStatus(componentName)[statusName]" 
                                :flex-columns="['caseName']">
                        </TableX>
                    </RowScroll>
                </TabPanel>
            </ColumnScroll>
        </div>
    </div>
</div>`;

dinglj.createVue({
    mounted() {
        const _this = this;
        window.displayData = function() {
            console.log(_this);
        }
    },
    data() {
        return {
            constant: {
                status: {
                    TICKET: new LangItem('TICKET', '变更中断'),
                    FAILED: new LangItem('FAILED', '失败'),
                    SUCCESS: new LangItem('SUCCESS', '成功'),
                    RUNNING: new LangItem('RUNNING', '执行中'),
                    SENDED: new LangItem('SENDED', '已发送'),
                    NOTSEND: new LangItem('NOTSEND', '待发送'),
                    WAITTING: new LangItem('WAITTING', '等待资源'),
                }
            },
            currentVersion: 'default',
            allVersionDatas: {},
            idx: {
                component: 0,
                components: {}
            }
        }
    },
    methods: {
        postTableShow(id) {
            const list = dinglj.query(`#${ id } .dinglj-v-tbody .dinglj-v-cell.ticket`);
            list.forEach(i => {
                const text = i.innerText.trim();
                if (text) {
                    i.innerHTML = `<div onclick="window.open('${ this.config.urls.ticket }/${ text }', '#${ text }')">#${ text }</div>`;
                }
            })
        },
        /** 计算某模块, 某状态下有哪些列要显示 */
        getColumnsToDisplay(componentName, statusName) {
            let groupData = this.groupByStatus(componentName);
            if (!groupData || !groupData[statusName] || !groupData[statusName].length) {
                return [];
            }
            // 先把所有列计算出来
            let fields = Object.keys(new Case());
            let ignoreColumns = dinglj.getConfig(this.config, 'table.ignoreColumn', [], true);
            const list4Display = groupData[statusName];
            const result = fields.filter(fieldName => {
                // 根据配置把忽略的列过滤掉
                if (ignoreColumns.includes(fieldName)) {
                    return false;
                }
                // 然后看看有没有哪一列是完全没有数据的, 也过滤掉, 只要这列在任意行有数据, 都不会过滤掉
                for (let _case_ of list4Display) {
                    if (_case_ && _case_[fieldName]) {
                        return true;
                    }
                }
                return false
            }).map(fieldName => { return { 'label': Case.getCaption(fieldName), 'value': fieldName } });
            console.log(result);
            return result;
        },
        /** 导航切换事件 */
        onNavChange(data) {
            this.idx.component = this.componentNames.indexOf(data);
        },
        /** Tab 页切换事件 */
        onTabChange(data) {
            const activeComponentName = this.componentNames[this.idx.component]; // 先取到当前模块
            const names = this.statusNames(activeComponentName); // 然后取出当前模块的状态列表
            if (names) {
                this.idx.components[activeComponentName] = names.indexOf(data); // 计算下标
            }
        },
        /** 某个 Component 分组下, 再次按照 Status 进行细分组 */
        groupByStatus(componentName) {
            return dinglj.groupBy(this.groupByComponent[componentName], item => item.status.en);
        },
        /** 某个 Component 分组下, 排好序的 Status 顺序 */
        statusNames(componentName) {
            const data = this.groupByStatus(componentName);
            let order = dinglj.getConfig(this.config, 'order.preferStatus', [], true).map(i => i.toLowerCase());
            return Object.keys(data).sort((o1, o2) => {
                return dinglj.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
            });
        }
    },
    computed: {
        /** 获取配置 */
        config() {
            return readConfig();
        },
        /** 获取用例集合 */
        originData() {
            if (dinglj.isDev()) {
                return readData(); // 用于本地测试, 本地会通过这个方法提供数据
            }
            if (this.allVersionDatas[this.currentVersion]) {
                return this.allVersionDatas[this.currentVersion];
            }
            if (this.currentVersion == 'default') {
                let result = dinglj.get(this.config.urls.defaultVersionData);
                if (result) {
                    result =  JSON.parse(result).testCaseTasks;
                }
                this.allVersionDatas[this.currentVersion] = result.map(item => new Case(item, this.constant.status));
                return this.allVersionDatas[this.currentVersion];
            }
        },
        /** 经过过滤字段处理的用例集合 */
        filteredData() {
            return this.originData;
        },
        /** 排过序的模块名称 */
        componentNames() {
            let order = dinglj.getConfig(this.config, 'order.preferComponent', [], true).map(i => i.toLowerCase());
            order.unshift('unit');
            return Object.keys(this.groupByComponent).sort((o1, o2) => {
                return dinglj.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
            });
        },
        /** 将经过过滤处理的用例集合按照 component 字段进行分组, component 值相等的用例放到一个数组中 */
        groupByComponent() {
            let firstGroup = dinglj.groupBy(this.filteredData, 'component');
            firstGroup['UNIT'] = this.filteredData.filter(i => i.level == 0);
            return firstGroup;
        },
    }
}, '#case-list-dinglj-container');
