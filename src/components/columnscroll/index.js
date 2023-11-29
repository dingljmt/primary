import { ref } from "../../utils/vue.js";

/** 竖向滚动面板, 可与 navigator 结合, 实现点击哪个菜单, 就滚动到哪里的功能 (只是示例, 也可另作他用) */
export default {
    template: `<div class="dinglj-v-column-scroll" :id="id" :style="{ top: '-' + currentIdx + '00%', height: size + '00%' }">
        <slot></slot>
    </div>`,
    data() {
        return {
            id: ref(dinglj.uuid('column-scroll'))
        }
    },
    props: [
        'currentIdx', 'size'
    ],
}