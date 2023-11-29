/** Tab 页面板, 传入 [ { label, value } ] 形式的名称列表 */
export default {
    template: `<div class="dinglj-v-tab-panel" :id="id">
        <div class="tab-panel-title">
            <div class="dinglj-v-tab-float"></div>
            <div :class="'tabl-panel-item' + (currentIdx == idx ? ' active' : '')" :id="id + '-' + idx" v-for="(item, idx) in names" @click="clicked(item, idx)">
                {{ getTabName(item) }}
            </div>
        </div>
        <div class="tab-panel-view">
            <slot class="tab-panel-content"></slot>
        </div>
    </div>`,
    data() {
        return {
            currentIdx: 0,
            id: dinglj.uuid('tab')
        }
    },
    mounted() {
        this.clicked(this.names[0], 0);
    },
    methods: {
        clicked(item, idx) {
            this.currentIdx = idx;
            this.$emit('on-change', item.value);
            const floatElement = dinglj.query(`#${ this.id } .dinglj-v-tab-float`)[0];
            const element = dinglj.byId(`${ this.id }-${ idx }`);
            floatElement.style.width = `${ element.offsetWidth }px`;
            floatElement.style.left = `${ element.offsetLeft }px`;
        }
    },
    props: {
        names: Array,
        getTabName: {
            type: Function,
            default: item => item.label
        }
    },
}