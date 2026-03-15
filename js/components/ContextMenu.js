/* ====== КОНТЕКСТНЕ МЕНЮ ====== */

export default {
  name: 'ContextMenu',

  props: {
    note: { type: Object, default: null },
    x:    { type: Number, default: 0 },
    y:    { type: Number, default: 0 },
  },

  emits: ['pin', 'archive', 'edit', 'delete', 'close'],

  mounted() {
    // Закрити при кліку поза меню
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick);
    }, 50);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },

  methods: {
    handleOutsideClick(e) {
      if (!this.$el.contains(e.target)) {
        this.$emit('close');
      }
    },
    action(type) {
      this.$emit(type, this.note);
      this.$emit('close');
    },
  },

  template: `
    <div
      v-if="note"
      class="context-menu"
      :style="{ left: x + 'px', top: y + 'px' }"
    >
      <div class="context-menu-item" @click="action('pin')">
        <i :class="note.pinned ? 'ph ph-push-pin-slash' : 'ph ph-push-pin'"></i>
        {{ note.pinned ? 'Відкріпити' : 'Закріпити' }}
      </div>

      <div class="context-menu-item" @click="action('archive')">
        <i :class="note.archived ? 'ph ph-arrow-u-up-left' : 'ph ph-archive'"></i>
        {{ note.archived ? 'Відновити з архіву' : 'В архів' }}
      </div>

      <div class="context-menu-item" @click="action('edit')">
        <i class="ph ph-pencil-simple"></i> Редагувати
      </div>

      <div class="context-menu-item danger" @click="action('delete')">
        <i class="ph ph-trash"></i> Видалити
      </div>
    </div>
  `,
};
