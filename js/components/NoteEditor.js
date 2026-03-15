/* ====== КОМПОНЕНТ РЕДАКТОРА ====== */
import { sanitize } from '../utils.js';

const LANGS = [
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'ru', label: 'Русский',    flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'pl', label: 'Polski',     flag: '🇵🇱' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
];

const I18N = {
  uk: {
    newNote: 'Нова нотатка', newNoteSub: 'Оберіть нотатку зі списку або створіть нову',
    createBtn: 'Створити нотатку', hotkey: 'або Alt+N',
    titlePh: 'Назва нотатки…', textPh: 'Текст нотатки… (підтримується Markdown)',
    tagPh: 'Тег… (Enter)', save: 'Зберегти', del: 'Видалити',
    pin: 'Закріпити', unpin: 'Відкріпити', preview: 'Превью', edit: 'Редагувати',
    archive: 'В архів', unarchive: 'З архіву', undo: 'Undo видалення',
    history: 'Історія змін', exportAll: 'Експорт всіх', import: 'Імпорт',
    moreActions: 'Більше дій', words: 'слів', chars: 'символів',
  },
  en: {
    newNote: 'New Note', newNoteSub: 'Select a note from the list or create a new one',
    createBtn: 'Create note', hotkey: 'or Alt+N',
    titlePh: 'Note title…', textPh: 'Note text… (Markdown supported)',
    tagPh: 'Tag… (Enter)', save: 'Save', del: 'Delete',
    pin: 'Pin', unpin: 'Unpin', preview: 'Preview', edit: 'Edit',
    archive: 'Archive', unarchive: 'Unarchive', undo: 'Undo delete',
    history: 'History', exportAll: 'Export all', import: 'Import',
    moreActions: 'More actions', words: 'words', chars: 'chars',
  },
  ru: {
    newNote: 'Новая заметка', newNoteSub: 'Выберите заметку из списка или создайте новую',
    createBtn: 'Создать заметку', hotkey: 'или Alt+N',
    titlePh: 'Название заметки…', textPh: 'Текст заметки… (поддерживается Markdown)',
    tagPh: 'Тег… (Enter)', save: 'Сохранить', del: 'Удалить',
    pin: 'Закрепить', unpin: 'Открепить', preview: 'Превью', edit: 'Редактировать',
    archive: 'В архив', unarchive: 'Из архива', undo: 'Undo удаления',
    history: 'История', exportAll: 'Экспорт всех', import: 'Импорт',
    moreActions: 'Ещё', words: 'слов', chars: 'символов',
  },
  de: {
    newNote: 'Neue Notiz', newNoteSub: 'Wähle eine Notiz oder erstelle eine neue',
    createBtn: 'Notiz erstellen', hotkey: 'oder Alt+N',
    titlePh: 'Titel…', textPh: 'Text… (Markdown unterstützt)',
    tagPh: 'Tag… (Enter)', save: 'Speichern', del: 'Löschen',
    pin: 'Anheften', unpin: 'Lösen', preview: 'Vorschau', edit: 'Bearbeiten',
    archive: 'Archivieren', unarchive: 'Wiederherstellen', undo: 'Rückgängig',
    history: 'Verlauf', exportAll: 'Exportieren', import: 'Importieren',
    moreActions: 'Mehr', words: 'Wörter', chars: 'Zeichen',
  },
  fr: {
    newNote: 'Nouvelle note', newNoteSub: 'Sélectionnez une note ou créez-en une',
    createBtn: 'Créer une note', hotkey: 'ou Alt+N',
    titlePh: 'Titre…', textPh: 'Texte… (Markdown supporté)',
    tagPh: 'Tag… (Entrée)', save: 'Enregistrer', del: 'Supprimer',
    pin: 'Épingler', unpin: 'Désépingler', preview: 'Aperçu', edit: 'Modifier',
    archive: 'Archiver', unarchive: 'Désarchiver', undo: 'Annuler',
    history: 'Historique', exportAll: 'Exporter tout', import: 'Importer',
    moreActions: 'Plus', words: 'mots', chars: 'caractères',
  },
  pl: {
    newNote: 'Nowa notatka', newNoteSub: 'Wybierz notatkę z listy lub utwórz nową',
    createBtn: 'Utwórz notatkę', hotkey: 'lub Alt+N',
    titlePh: 'Tytuł notatki…', textPh: 'Tekst… (obsługuje Markdown)',
    tagPh: 'Tag… (Enter)', save: 'Zapisz', del: 'Usuń',
    pin: 'Przypnij', unpin: 'Odepnij', preview: 'Podgląd', edit: 'Edytuj',
    archive: 'Archiwizuj', unarchive: 'Przywróć', undo: 'Cofnij',
    history: 'Historia', exportAll: 'Eksportuj', import: 'Importuj',
    moreActions: 'Więcej', words: 'słów', chars: 'znaków',
  },
  es: {
    newNote: 'Nueva nota', newNoteSub: 'Selecciona una nota o crea una nueva',
    createBtn: 'Crear nota', hotkey: 'o Alt+N',
    titlePh: 'Título…', textPh: 'Texto… (Markdown compatible)',
    tagPh: 'Etiqueta… (Enter)', save: 'Guardar', del: 'Eliminar',
    pin: 'Fijar', unpin: 'Desfijar', preview: 'Vista previa', edit: 'Editar',
    archive: 'Archivar', unarchive: 'Desarchivar', undo: 'Deshacer',
    history: 'Historial', exportAll: 'Exportar todo', import: 'Importar',
    moreActions: 'Más', words: 'palabras', chars: 'caracteres',
  },
  zh: {
    newNote: '新建笔记', newNoteSub: '从列表中选择笔记或创建新笔记',
    createBtn: '创建笔记', hotkey: '或 Alt+N',
    titlePh: '笔记标题…', textPh: '笔记内容…（支持 Markdown）',
    tagPh: '标签…（Enter）', save: '保存', del: '删除',
    pin: '置顶', unpin: '取消置顶', preview: '预览', edit: '编辑',
    archive: '归档', unarchive: '取消归档', undo: '撤销删除',
    history: '历史', exportAll: '导出全部', import: '导入',
    moreActions: '更多', words: '词', chars: '字符',
  },
};

export default {
  name: 'NoteEditor',
  props: {
    modelValue: { type: Object, default: null },
    focusMode:  { type: Boolean, default: false },
    lang:       { type: String, default: 'uk' },
  },
  emits: ['save','delete','pin','archive','export','import','undo','update:modelValue','open-history','new-note'],

  data() {
    return {
      title:    '',
      content:  '',
      color:    '#4dabf7',
      tags:     [],
      tagInput: '',
      mdPreview: false,
      showMore:  false,
      colors: [
        { value: '#4dabf7', label: '🔵' },
        { value: '#40c057', label: '🟢' },
        { value: '#fab005', label: '🟡' },
        { value: '#e03131', label: '🔴' },
        { value: '#ae3ec9', label: '🟣' },
        { value: '#ffffff', label: '⚪' },
      ],
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(note) {
        if (note) {
          this.title   = note.title   || '';
          this.content = note.content || '';
          this.color   = note.color   || '#4dabf7';
          this.tags    = [...(note.tags || [])];
        } else {
          this.title = ''; this.content = ''; this.color = '#4dabf7'; this.tags = [];
        }
        this.tagInput = '';
        this.showMore = false;
      },
    },
  },

  computed: {
    t()          { return I18N[this.lang] || I18N.uk; },
    wordCount()  { return this.content.trim() ? this.content.trim().split(/\s+/).length : 0; },
    charCount()  { return this.content.length; },
    isPinned()   { return this.modelValue?.pinned   || false; },
    isArchived() { return this.modelValue?.archived || false; },
    hasNote()    { return !!this.modelValue?.id; },
    isEmpty()    { return !this.modelValue; },

    renderedMd() {
      try {
        const parse = window.marked?.parse || window.marked?.marked?.parse;
        if (!parse) return '<p>' + this.content + '</p>';
        return parse(this.content || '', { breaks: true, gfm: true });
      } catch(e) { return '<p>' + this.content + '</p>'; }
    },
  },

  methods: {
    handleSave() {
      this.$emit('save', {
        title:   sanitize(this.title),
        content: sanitize(this.content),
        color:   this.color,
        tags:    [...this.tags],
      });
    },
    addTag() {
      const t = this.tagInput.trim().toLowerCase();
      if (t && !this.tags.includes(t)) this.tags.push(t);
      this.tagInput = '';
    },
    removeTag(t) { this.tags = this.tags.filter(x => x !== t); },
    onTagKey(e) {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addTag(); }
      if (e.key === 'Backspace' && !this.tagInput && this.tags.length) this.tags.pop();
    },
    triggerImport() { this.$refs.fileInput.click(); },
    onImportFile(e) { const f = e.target.files?.[0]; if (f) this.$emit('import', f); e.target.value = ''; },
  },

  template: `
    <div id="note-editor" class="glass-panel" :class="{ 'focus-mode-editor': focusMode }">

      <!-- ПОРОЖНІЙ СТАН — нотатка не вибрана -->
      <div v-if="isEmpty" class="editor-empty-state">
        <div class="editor-empty-icon">
          <i class="ph ph-note-pencil"></i>
        </div>
        <div class="editor-empty-title">{{ t.newNote }}</div>
        <div class="editor-empty-sub">{{ t.newNoteSub }}</div>
        <button class="btn save editor-empty-btn" @click="$emit('new-note')">
          <i class="ph ph-plus"></i> {{ t.createBtn }}
        </button>
        <div class="editor-empty-hint">{{ t.hotkey }}</div>
      </div>

      <!-- АКТИВНИЙ РЕДАКТОР -->
      <template v-else>
        <!-- Рядок заголовку -->
        <div class="editor-top-row">
          <input v-model="title" type="text" :placeholder="t.titlePh" style="flex:1">
          <button class="btn btn-md-toggle" :class="{ active: mdPreview }"
            :title="t.preview + ' (Alt+P)'" @click="mdPreview = !mdPreview">
            <i class="ph ph-eye"></i>
            <span class="btn-label">{{ mdPreview ? t.edit : t.preview }}</span>
          </button>
        </div>

        <!-- Колір + теги -->
        <div class="editor-meta-row">
          <select v-model="color" class="color-select">
            <option v-for="c in colors" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
          <div class="tags-input-wrapper" style="flex:1">
            <span v-for="tag in tags" :key="tag" class="tag-chip tag-chip--removable">
              {{ tag }}<i class="ph ph-x" @click="removeTag(tag)"></i>
            </span>
            <input v-model="tagInput" class="tags-input" type="text"
              :placeholder="t.tagPh" @keydown="onTagKey" @blur="addTag">
          </div>
        </div>

        <!-- Textarea / Preview -->
        <div class="editor-split" :class="{ 'split-active': mdPreview }">
          <textarea v-model="content" :placeholder="t.textPh"></textarea>
          <div v-if="mdPreview" class="md-preview" v-html="renderedMd"></div>
        </div>

        <div class="word-count">{{ wordCount }} {{ t.words }} · {{ charCount }} {{ t.chars }}</div>

        <!-- Кнопки -->
        <div class="buttons">
          <button class="btn save" :title="t.save + ' (Alt+S)'" @click="handleSave">
            <i class="ph ph-floppy-disk"></i> <span class="btn-label">{{ t.save }}</span>
          </button>
          <button class="btn delete" :disabled="!hasNote" :title="t.del" @click="$emit('delete')">
            <i class="ph ph-trash"></i> <span class="btn-label">{{ t.del }}</span>
          </button>
          <button class="btn" :class="{pin: isPinned}" :disabled="!hasNote"
            :title="isPinned ? t.unpin : t.pin" @click="$emit('pin')">
            <i :class="isPinned ? 'ph ph-push-pin-slash' : 'ph ph-push-pin'"></i>
            <span class="btn-label">{{ isPinned ? t.unpin : t.pin }}</span>
          </button>

          <!-- Три точки -->
          <div class="more-menu-wrap" style="margin-left:auto">
            <button class="btn btn-icon" :title="t.moreActions" @click.stop="showMore = !showMore">
              <i class="ph ph-dots-three"></i>
            </button>
            <div v-if="showMore" class="more-dropdown">
              <button class="more-item" :disabled="!hasNote" @click="$emit('archive'); showMore=false">
                <i :class="isArchived ? 'ph ph-arrow-u-up-left' : 'ph ph-archive'"></i>
                {{ isArchived ? t.unarchive : t.archive }}
              </button>
              <button class="more-item" @click="$emit('undo'); showMore=false">
                <i class="ph ph-arrow-counter-clockwise"></i> {{ t.undo }}
              </button>
              <button class="more-item" :disabled="!hasNote" @click="$emit('open-history'); showMore=false">
                <i class="ph ph-clock-counter-clockwise"></i> {{ t.history }}
              </button>
              <div class="more-divider"></div>
              <button class="more-item" @click="$emit('export'); showMore=false">
                <i class="ph ph-export"></i> {{ t.exportAll }}
              </button>
              <button class="more-item" @click="triggerImport(); showMore=false">
                <i class="ph ph-upload-simple"></i> {{ t.import }}
              </button>
            </div>
          </div>

          <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onImportFile">
        </div>
      </template>

      <div v-if="showMore" style="position:fixed;inset:0;z-index:999" @click="showMore=false"></div>
    </div>
  `,
};
