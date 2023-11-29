/** 表格, 传入 [ { label, value } ] 形式的表头列名, 再传入要显示的数据列表即可 */
export default {
    template: `<div class="dinglj-v-table" :id="id">
        <div class="dinglj-v-thead dinglj-v-tr">
            <div v-for="column in columns" :class="' dinglj-v-cell ' + column.value + (flexColumns.includes(column.value) ? ' flex-column ' : '')">
                {{ column.label }}
            </div>
        </div>
        <div class="dinglj-v-tbody">
            <div>
                <div class="dinglj-v-tr" v-for="case_ in data">
                    <div :class="' dinglj-v-cell ' + column.value + (flexColumns.includes(column.value) ? ' flex-column ' : '')" v-for="column in columns">
                        {{ case_[column.value] }}
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            id: dinglj.uuid('table-v')
        }
    },
    mounted() {
        for (let column of this.columns) {
            const elements = dinglj.query(`#${ this.id } .dinglj-v-cell.${ column.value }`);
            const widthList = elements.map(i => dinglj.calcTxtWidth(i));
            const maxWidth = Math.max(...widthList);
            elements.forEach(e => e.style.width = `${ maxWidth + 40 }px`);
        }
        this.$emit('on-loaded', this.id);
    },
    props: {
        columns: Array,
        data: Array,
        flexColumns: {
            type: Array,
            default: []
        }
    },
}