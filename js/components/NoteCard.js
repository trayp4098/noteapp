/* ====== КОМПОНЕНТ КАРТКИ НОТАТКИ ====== */
import { formatDate } from '../utils.js';

export default {
  name: 'NoteCard',
  props: {
    note:       { type: Object,  required: true },
    isSelected: { type: Boolean, default: false },
    viewMode:   { type: String,  default: 'list' },
  },
  emits: ['select', 'contextmenu'],
  computed: {
    cardStyle() {
      const c = this.note.color || '#4dabf7';
      return {
        borderLeft: `4px solid ${c}`,
        background: `linear-gradient(135deg, ${c}22 0%, ${c}08 50%, transparent 100%)`,
      };
    },
    formattedDate() { return formatDate(this.note.date); },
    previewText()   { return (this.note.content || '').replace(/[#*`>_~\[\]]/g, '').slice(0, 120); },
  },
  template: `
    <div
      class="note-card"
      :class="{ selected: isSelected, 'card-grid': viewMode === 'grid' }"
      :style="cardStyle"
      @click="$emit('select', note)"
      @contextmenu.prevent="$emit('contextmenu', $event, note)"
    >
      <div class="note-card-header">
        <strong class="note-card-title">{{ note.title || '(Без назви)' }}</strong>
        <span class="note-icons">
          <i v-if="note.pinned"   class="ph ph-push-pin pin-icon"          title="Закріплено"></i>
          <i v-if="note.archived" class="ph ph-archive"  style="color:var(--muted)" title="В архіві"></i>
        </span>
      </div>
      <div v-if="note.tags && note.tags.length" class="note-tags">
        <span v-for="tag in note.tags.slice(0,3)" :key="tag" class="tag-chip">
          <i class="ph ph-hash" style="font-size:.7rem"></i>{{ tag }}
        </span>
        <span v-if="note.tags.length > 3" class="tag-chip tag-chip--more">+{{ note.tags.length - 3 }}</span>
      </div>
      <div class="preview">{{ previewText }}</div>
      <div class="note-date"><i class="ph ph-clock"></i> {{ formattedDate }}</div>
    </div>
  `,
};
