import { defineComponent, toRefs } from 'vue';

const SvgIcon = defineComponent({
  props: {
    name: { required: false },
    prefix: {
      type: String,
      default: 'icon'
    },
    color: {
      type: String,
      default: '#333'
    }
  },
  setup(props) {
    const { prefix, name, color, ...otherProps } = toRefs(props);
    const symbolId = `#${prefix.value}-${name.value}`;
    return () => (
      <svg {...otherProps} aria-hidden="true">
        <use href={symbolId} fill={color.value} />
      </svg>
    );
  }
});

export default SvgIcon;
