/** 按钮 */
export default {
    template: `<div :class="{
        'dinglj-v-btn': true, 
        'primary': type.toLowerCase() == 'primary'
    }" @click="$emit('on-click')">
        <slot></slot>
    </div>`,
    props: [
        'type'
    ],
}