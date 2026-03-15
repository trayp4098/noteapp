/* ====== КОМПОНЕНТ САЙДБАРУ ====== */
import NoteCard from './NoteCard.js';

export default {
  name: 'NoteList',
  components: { NoteCard },
  props: {
    notes:              { type: Array,   required: true },
    allNotes:           { type: Array,   required: true },
    selectedId:         { type: String,  default: null },
    filterMode:         { type: String,  default: 'active' },
    searchQuery:        { type: String,  default: '' },
    colorFilter:        { type: String,  default: '' },
    dateFilter:         { type: String,  default: '' },
    availableColors:    { type: Array,   default: () => [] },
    activeFiltersCount: { type: Number,  default: 0 },
    loading:            { type: Boolean, default: false },
    lang:               { type: String,  default: 'uk' },
  },
  emits: ['select','update:filterMode','update:searchQuery','contextmenu','set-color-filter','set-date-filter','clear-filters'],

  data() {
    return {
      viewMode: localStorage.getItem('viewMode') || 'list',
    };
  },

  computed: {
    t() {
      const map = {
        uk: {
          notes:'Нотатки', search:'Пошук… (Alt+F)',
          all:'Всі', active:'Активні', pinned:'Закріплені', archived:'Архів',
          byDate:'По даті', byColor:'По кольору',
          today:'Сьогодні', week:'Тиждень', month:'Місяць',
          resetFilters:'Скинути фільтри',
          emptyTitle:{ all:'Немає нотаток', active:'Немає активних', archived:'Архів порожній', pinned:'Немає закріплених' },
          emptySub:{ all:'Створіть першу нотатку', active:'Натисніть Alt+N', archived:'Заархівовані нотатки зʼявляться тут', pinned:'Закріпіть важливі нотатки' },
          pinnedLabel:'Закріплені', allLabel:'Усі нотатки',
        },
        en: {
          notes:'Notes', search:'Search… (Alt+F)',
          all:'All', active:'Active', pinned:'Pinned', archived:'Archive',
          byDate:'By date', byColor:'By color',
          today:'Today', week:'Week', month:'Month',
          resetFilters:'Reset filters',
          emptyTitle:{ all:'No notes', active:'No active notes', archived:'Archive is empty', pinned:'No pinned notes' },
          emptySub:{ all:'Create your first note', active:'Press Alt+N to start', archived:'Archived notes will appear here', pinned:'Pin important notes' },
          pinnedLabel:'Pinned', allLabel:'All notes',
        },
        ru: {
          notes:'Заметки', search:'Поиск… (Alt+F)',
          all:'Все', active:'Активные', pinned:'Закреплённые', archived:'Архив',
          byDate:'По дате', byColor:'По цвету',
          today:'Сегодня', week:'Неделя', month:'Месяц',
          resetFilters:'Сбросить фильтры',
          emptyTitle:{ all:'Нет заметок', active:'Нет активных', archived:'Архив пуст', pinned:'Нет закреплённых' },
          emptySub:{ all:'Создайте первую заметку', active:'Нажмите Alt+N', archived:'Архивные заметки появятся здесь', pinned:'Закрепите важные заметки' },
          pinnedLabel:'Закреплённые', allLabel:'Все заметки',
        },
        de: {
          notes:'Notizen', search:'Suchen… (Alt+F)',
          all:'Alle', active:'Aktiv', pinned:'Angeheftet', archived:'Archiv',
          byDate:'Nach Datum', byColor:'Nach Farbe',
          today:'Heute', week:'Woche', month:'Monat',
          resetFilters:'Filter zurücksetzen',
          emptyTitle:{ all:'Keine Notizen', active:'Keine aktiven Notizen', archived:'Archiv ist leer', pinned:'Keine angehefteten Notizen' },
          emptySub:{ all:'Erstelle deine erste Notiz', active:'Alt+N drücken', archived:'Archivierte Notizen erscheinen hier', pinned:'Hefte wichtige Notizen an' },
          pinnedLabel:'Angeheftet', allLabel:'Alle Notizen',
        },
        fr: {
          notes:'Notes', search:'Rechercher… (Alt+F)',
          all:'Tout', active:'Actives', pinned:'Épinglées', archived:'Archive',
          byDate:'Par date', byColor:'Par couleur',
          today:"Aujourd'hui", week:'Semaine', month:'Mois',
          resetFilters:'Réinitialiser',
          emptyTitle:{ all:'Aucune note', active:'Aucune note active', archived:'Archive vide', pinned:'Aucune note épinglée' },
          emptySub:{ all:'Créez votre première note', active:'Appuyez sur Alt+N', archived:'Les notes archivées apparaîtront ici', pinned:'Épinglez les notes importantes' },
          pinnedLabel:'Épinglées', allLabel:'Toutes les notes',
        },
        pl: {
          notes:'Notatki', search:'Szukaj… (Alt+F)',
          all:'Wszystkie', active:'Aktywne', pinned:'Przypięte', archived:'Archiwum',
          byDate:'Według daty', byColor:'Według koloru',
          today:'Dziś', week:'Tydzień', month:'Miesiąc',
          resetFilters:'Resetuj filtry',
          emptyTitle:{ all:'Brak notatek', active:'Brak aktywnych', archived:'Archiwum puste', pinned:'Brak przypiętych' },
          emptySub:{ all:'Utwórz pierwszą notatkę', active:'Naciśnij Alt+N', archived:'Zarchiwizowane notatki pojawią się tutaj', pinned:'Przypnij ważne notatki' },
          pinnedLabel:'Przypięte', allLabel:'Wszystkie notatki',
        },
        es: {
          notes:'Notas', search:'Buscar… (Alt+F)',
          all:'Todas', active:'Activas', pinned:'Fijadas', archived:'Archivo',
          byDate:'Por fecha', byColor:'Por color',
          today:'Hoy', week:'Semana', month:'Mes',
          resetFilters:'Restablecer filtros',
          emptyTitle:{ all:'Sin notas', active:'Sin notas activas', archived:'Archivo vacío', pinned:'Sin notas fijadas' },
          emptySub:{ all:'Crea tu primera nota', active:'Presiona Alt+N', archived:'Las notas archivadas aparecerán aquí', pinned:'Fija notas importantes' },
          pinnedLabel:'Fijadas', allLabel:'Todas las notas',
        },
        zh: {
          notes:'笔记', search:'搜索… (Alt+F)',
          all:'全部', active:'活跃', pinned:'置顶', archived:'归档',
          byDate:'按日期', byColor:'按颜色',
          today:'今天', week:'本周', month:'本月',
          resetFilters:'重置筛选',
          emptyTitle:{ all:'暂无笔记', active:'暂无活跃笔记', archived:'归档为空', pinned:'暂无置顶笔记' },
          emptySub:{ all:'创建第一条笔记', active:'按 Alt+N 开始', archived:'归档笔记将显示在此处', pinned:'置顶重要笔记' },
          pinnedLabel:'置顶', allLabel:'所有笔记',
        },
      };
      return map[this.lang] || map.uk;
    },

    pinnedNotes()   { return this.notes.filter(n => n.pinned); },
    unpinnedNotes() { return this.notes.filter(n => !n.pinned); },
    showDivider()   { return this.pinnedNotes.length > 0 && this.unpinnedNotes.length > 0 && this.filterMode !== 'pinned'; },

    stats() {
      const total    = this.allNotes.length;
      const archived = this.allNotes.filter(n => n.archived).length;
      return { total, active: total - archived, archived, pinned: this.allNotes.filter(n => n.pinned && !n.archived).length };
    },

    emptyIcon() {
      return { all:'ph-note', active:'ph-pencil-line', archived:'ph-archive', pinned:'ph-push-pin' }[this.filterMode] || 'ph-note';
    },

    colorNames() {
      return { '#4dabf7':'●', '#40c057':'●', '#fab005':'●', '#e03131':'●', '#ae3ec9':'●', '#ffffff':'●' };
    },
  },

  methods: {
    toggleView() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
      localStorage.setItem('viewMode', this.viewMode);
    },
  },

  template: `
    <div id="sidebar" class="glass-panel" :class="{ 'sidebar-grid': viewMode === 'grid' }">
      <div class="sidebar-top-row">
        <h3 class="sidebar-title"><i class="ph ph-notebook"></i> {{ t.notes }}</h3>
        <button class="btn btn-icon" :title="viewMode === 'list' ? 'Grid' : 'List'" @click="toggleView">
          <i :class="viewMode === 'list' ? 'ph ph-grid-four' : 'ph ph-list'"></i>
        </button>
      </div>

      <input class="sidebar-search" type="text" :placeholder="t.search"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value.trim().toLowerCase())">

      <div class="filter-buttons">
        <button v-for="f in [
          {key:'all',    icon:'ph-stack',    labelKey:'all'},
          {key:'active', icon:'ph-note',     labelKey:'active'},
          {key:'pinned', icon:'ph-push-pin', labelKey:'pinned'},
          {key:'archived',icon:'ph-archive', labelKey:'archived'},
        ]" :key="f.key" class="btn" :class="{'active-filter': filterMode === f.key}"
          @click="$emit('update:filterMode', f.key)">
          <i :class="'ph ' + f.icon"></i> {{ t[f.labelKey] }}
        </button>
      </div>

      <div class="filter-section-title"><i class="ph ph-calendar-blank"></i> {{ t.byDate }}</div>
      <div class="filter-buttons">
        <button v-for="d in [{key:'today',lk:'today'},{key:'week',lk:'week'},{key:'month',lk:'month'}]"
          :key="d.key" class="btn" :class="{'active-filter': dateFilter === d.key}"
          @click="$emit('set-date-filter', d.key)">{{ t[d.lk] }}</button>
      </div>

      <div v-if="availableColors.length" class="filter-section-title"><i class="ph ph-palette"></i> {{ t.byColor }}</div>
      <div v-if="availableColors.length" class="color-filter-row">
        <div v-for="color in availableColors" :key="color"
          class="color-filter-dot" :class="{ active: colorFilter === color }"
          :style="{ background: color }" @click="$emit('set-color-filter', color)"></div>
      </div>

      <button v-if="activeFiltersCount > 0" class="btn btn-reset-filters" @click="$emit('clear-filters')">
        <i class="ph ph-x"></i> {{ t.resetFilters }} ({{ activeFiltersCount }})
      </button>

      <div id="note-list" :class="{ 'note-list-grid': viewMode === 'grid' }">
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="skeleton-card">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-body"></div>
            <div class="skeleton-line skeleton-body short"></div>
            <div class="skeleton-line skeleton-date"></div>
          </div>
        </template>

        <div v-else-if="notes.length === 0" class="empty-state">
          <div class="empty-state-icon"><i :class="'ph ' + emptyIcon"></i></div>
          <div class="empty-state-title">{{ t.emptyTitle[filterMode] || t.emptyTitle.all }}</div>
          <div class="empty-state-subtitle">{{ t.emptySub[filterMode] || t.emptySub.all }}</div>
        </div>

        <template v-else>
          <div v-if="pinnedNotes.length && filterMode !== 'pinned' && unpinnedNotes.length" class="pinned-header">
            <i class="ph ph-push-pin"></i> {{ t.pinnedLabel }}
          </div>
          <note-card v-for="note in pinnedNotes" :key="note.id"
            :note="note" :is-selected="selectedId === note.id" :view-mode="viewMode"
            @select="$emit('select', $event)" @contextmenu="$emit('contextmenu', $event, note)" />
          <div v-if="showDivider" class="notes-divider"><span>{{ t.allLabel }}</span></div>
          <note-card v-for="note in unpinnedNotes" :key="note.id"
            :note="note" :is-selected="selectedId === note.id" :view-mode="viewMode"
            @select="$emit('select', $event)" @contextmenu="$emit('contextmenu', $event, note)" />
        </template>
      </div>

      <div class="sidebar-stats">
        <i class="ph ph-stack"></i> {{ stats.total }}
        · <i class="ph ph-note"></i> {{ stats.active }}
        · <i class="ph ph-archive"></i> {{ stats.archived }}
        · <i class="ph ph-push-pin"></i> {{ stats.pinned }}
      </div>
    </div>
  `,
};
