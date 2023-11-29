import { ref } from "../../utils/vue.js";

/** 导航菜单, 传入需要显示的目录名称 */
export default {
    template: `<div id="dinglj-v-navigator">
        <div class="dinglj-v-navigator-item" 
            v-for="(item, idx) in menus" 
            @click="thisIdx = idx; $emit('on-change', item)"
            :class="{'active': idx == thisIdx}">
            {{ item }}
        </div>
    </div>`,
    data() {
        return {
            thisIdx: ref(0)
        }
    },
    props: [
        'menus'
    ],
}