export default {
    template: `<div class="dinglj-v-switch" @click="active = !active; $emit('on-change', active)">
        <div class="dinglj-v-switch-pre">
            <slot name="pre"></slot>
        </div>
        <div :class="'dinglj-v-switch-btn ' + (active ? 'active' : '')">
            <div></div>
        </div>
        <div class="dinglj-v-switch-post">
            <slot name="post"></slot>
        </div>
    </div>`,
    data() {
        return {
            active: false
        }
    }
}