export default {
  beforeMount(el: HTMLElement, binding: { value: { icon: string; right: boolean; }; }): void {
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-2xl`;

    if (binding.value.right) {
      iconClass += ' float-right';
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
