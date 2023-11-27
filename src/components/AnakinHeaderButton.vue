<script lang="ts">
import { defineComponent, type PropType } from 'vue';

const buttonType = ['button', 'icon', 'link'] as const;

type ButtonType = typeof buttonType[number];

export default defineComponent({
  name: 'AnakinHeaderButton',

  props: {
    name: {
      type: String,
      default: '',
    },
    tooltipContent: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button',
      validator: (value: ButtonType) => buttonType.includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    isA() {
      return this.type === 'link' ? 'a' : 'button';
    },
  },
  methods: {
    emitClick(e: MouseEvent) {
      if (!this.disabled) {
        this.$emit('click', e);
      }
    },
  },
});
</script>

<template>
  <component
    :is="isA"
    class="datatunerx-header-button"
    :class="{'datatunerx-header-button-icon': type === 'icon'}"
    :disabled="disabled"
    @click="emitClick($event)"
  >
    <dao-tooltip
      :disabled="!tooltipContent"
      :content="tooltipContent"
      offset="12"
    >
      <slot>
        <dao-icon
          use-font
          :name="name"
        />
      </slot>
    </dao-tooltip>
  </component>
</template>

<style lang="scss">
$datatunerx-header-button-hover-bg: var(--dao-top-gray-020);
$datatunerx-header-button-icon-active: rgba(var(--dao-pure-black-rgb), 0);

.datatunerx-header-button {
  font-size: 13px;
  line-height: 32px;
  color: var(--dao-navigation-090);
  text-decoration: none;
  cursor: pointer;
  background: $datatunerx-header-button-icon-active;
  border: 0;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;

  .dao-popper-target {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: $datatunerx-header-button-hover-bg;
  }

  &-icon:hover {
    background-color: $datatunerx-header-button-icon-active;
  }

  &:active {
    background-color: $datatunerx-header-button-hover-bg;
  }

  &-icon:active {
    background-color: $datatunerx-header-button-icon-active;
  }
}
</style>
