import { ref } from "../../utils/vue.js";

/** 横向滚动面板, 可与 tabpanel 结合, 实现点击哪个 tab 页, 就滚动到哪里的功能 (只是示例, 也可另作他用) */
export default {
    template: `<div class="dinglj-v-row-scroll" :id="id" :style="{ left: '-' + currentIdx + '00%', width: size + '00%' }">
        <slot></slot>
    </div>`,
    data() {
        return {
            id: ref(dinglj.uuid('row-scroll'))
        }
    },
    props: [
        'currentIdx', 'size'
    ],
}