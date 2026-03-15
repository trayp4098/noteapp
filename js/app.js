/* ====== ГОЛОВНИЙ ЗАСТОСУНОК — Vue 3 CDN ====== */

import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js';

import { auth } from './firebase-config.js';
import { subscribeToNotes, saveNote, saveNoteHistory, getNoteHistory, deleteNote, togglePin, toggleArchive, importNotes } from './db.js';
import { toast, confirmModal } from './utils.js';

import AuthScreen  from './components/AuthScreen.js';
import NoteList    from './components/NoteList.js';
import NoteEditor  from './components/NoteEditor.js';
import ContextMenu from './components/ContextMenu.js';

const DRAFT_KEY = 'notes_draft';
const THEMES    = ['dark', 'light', 'obsidian', 'dim', 'cyber', 'pastel'];

const APP_I18N = {
  uk: {
    appTitle: 'Notes App', templates: 'Шаблони', search: 'Пошук… (Alt+F)',
    all: 'Всі', active: 'Активні', pinned: 'Закріплені', archived: 'Архів',
    byDate: 'По даті', byColor: 'По кольору',
    today: 'Сьогодні', week: 'Тиждень', month: 'Місяць',
    resetFilters: 'Скинути фільтри', notes: 'Нотатки',
    shown: 'нотаток показано', total: 'Всього',
    filters: 'Фільтрів', reset: 'Скинути',
    meetingTpl: 'Зустріч', taskTpl: 'Завдання', diaryTpl: 'Щоденник', ideaTpl: 'Ідея',
    emptyTpl: 'або починайте з порожньої нотатки', blankNote: 'Порожня нотатка',
    emptyNotes: { all:'Немає нотаток', active:'Немає активних', archived:'Архів порожній', pinned:'Немає закріплених' },
    emptySub: { all:'Створіть першу нотатку', active:'Натисніть Alt+N', archived:'Заархівовані нотатки зʼявляться тут', pinned:'Закріпіть важливі нотатки' },
    statsTitle: 'Статистика', totalLabel: 'Всього', activeLabel: 'Активних', pinnedLabel: 'Закріплених', wordsLabel: 'Слів',
    activityTitle: 'Активність за 7 днів', topTagsTitle: 'Топ теги',
    profileTitle: 'Профіль', registeredLabel: 'Зареєстрований', lastLoginLabel: 'Останній вхід', notesLabel: 'Нотаток',
    historyTitle: 'Історія змін', historyEmpty: 'Історія порожня — зберігайте нотатки щоб бачити версії', restoreBtn: 'Відновити',
    hotkeysTitle: 'Гарячі клавіші',
    hkEditor: 'Редактор', hkSave: 'Зберегти нотатку', hkNew: 'Нова порожня нотатка', hkPreview: 'Markdown превью',
    hkNav: 'Навігація', hkSearch: 'Фокус на пошук', hkRandom: 'Випадкова нотатка', hkClose: 'Закрити / скинути вибір',
    hkTags: 'Теги', hkAddTag: 'Додати тег', hkAddTagAlt: 'Додати тег (альтернатива)', hkRemoveTag: 'Видалити останній тег',
    hkTip: 'Alt замість Ctrl — щоб не конфліктувати з браузером',
  },
  en: {
    appTitle: 'Notes App', templates: 'Templates', search: 'Search… (Alt+F)',
    all: 'All', active: 'Active', pinned: 'Pinned', archived: 'Archive',
    byDate: 'By date', byColor: 'By color',
    today: 'Today', week: 'Week', month: 'Month',
    resetFilters: 'Reset filters', notes: 'Notes',
    shown: 'notes shown', total: 'Total', filters: 'Filters', reset: 'Reset',
    meetingTpl: 'Meeting', taskTpl: 'Task', diaryTpl: 'Diary', ideaTpl: 'Idea',
    emptyTpl: 'or start with a blank note', blankNote: 'Blank note',
    emptyNotes: { all:'No notes', active:'No active notes', archived:'Archive is empty', pinned:'No pinned notes' },
    emptySub: { all:'Create your first note', active:'Press Alt+N to start', archived:'Archived notes will appear here', pinned:'Pin important notes for quick access' },
    statsTitle: 'Statistics', totalLabel: 'Total', activeLabel: 'Active', pinnedLabel: 'Pinned', wordsLabel: 'Words',
    activityTitle: 'Activity (7 days)', topTagsTitle: 'Top tags',
    profileTitle: 'Profile', registeredLabel: 'Registered', lastLoginLabel: 'Last login', notesLabel: 'Notes',
    historyTitle: 'History', historyEmpty: 'No history yet — save notes to see versions', restoreBtn: 'Restore',
    hotkeysTitle: 'Keyboard shortcuts',
    hkEditor: 'Editor', hkSave: 'Save note', hkNew: 'New blank note', hkPreview: 'Markdown preview',
    hkNav: 'Navigation', hkSearch: 'Focus search', hkRandom: 'Random note', hkClose: 'Close / deselect',
    hkTags: 'Tags', hkAddTag: 'Add tag', hkAddTagAlt: 'Add tag (alternative)', hkRemoveTag: 'Remove last tag',
    hkTip: 'Alt instead of Ctrl — to avoid browser conflicts',
  },
  ru: {
    appTitle: 'Notes App', templates: 'Шаблоны', search: 'Поиск… (Alt+F)',
    all: 'Все', active: 'Активные', pinned: 'Закреплённые', archived: 'Архив',
    byDate: 'По дате', byColor: 'По цвету',
    today: 'Сегодня', week: 'Неделя', month: 'Месяц',
    resetFilters: 'Сбросить фильтры', notes: 'Заметки',
    shown: 'заметок показано', total: 'Всего',
    filters: 'Фильтров', reset: 'Сбросить',
    meetingTpl: 'Встреча', taskTpl: 'Задача', diaryTpl: 'Дневник', ideaTpl: 'Идея',
    emptyTpl: 'или начните с пустой заметки', blankNote: 'Пустая заметка',
    emptyNotes: { all:'Нет заметок', active:'Нет активных', archived:'Архив пуст', pinned:'Нет закреплённых' },
    emptySub: { all:'Создайте первую заметку', active:'Нажмите Alt+N', archived:'Архивные заметки появятся здесь', pinned:'Закрепите важные заметки' },
    statsTitle: 'Статистика', totalLabel: 'Всего', activeLabel: 'Активных', pinnedLabel: 'Закреплённых', wordsLabel: 'Слов',
    activityTitle: 'Активность за 7 дней', topTagsTitle: 'Топ теги',
    profileTitle: 'Профиль', registeredLabel: 'Зарегистрирован', lastLoginLabel: 'Последний вход', notesLabel: 'Заметок',
    historyTitle: 'История изменений', historyEmpty: 'История пуста — сохраняйте заметки чтобы видеть версии', restoreBtn: 'Восстановить',
    hotkeysTitle: 'Горячие клавиши',
    hkEditor: 'Редактор', hkSave: 'Сохранить заметку', hkNew: 'Новая пустая заметка', hkPreview: 'Markdown превью',
    hkNav: 'Навигация', hkSearch: 'Фокус на поиск', hkRandom: 'Случайная заметка', hkClose: 'Закрыть / сбросить выбор',
    hkTags: 'Теги', hkAddTag: 'Добавить тег', hkAddTagAlt: 'Добавить тег (альтернатива)', hkRemoveTag: 'Удалить последний тег',
    hkTip: 'Alt вместо Ctrl — чтобы не конфликтовать с браузером',
  },
  de: {
    appTitle: 'Notes App', templates: 'Vorlagen', search: 'Suchen… (Alt+F)',
    all: 'Alle', active: 'Aktiv', pinned: 'Angeheftet', archived: 'Archiv',
    byDate: 'Nach Datum', byColor: 'Nach Farbe',
    today: 'Heute', week: 'Woche', month: 'Monat',
    resetFilters: 'Filter zurücksetzen', notes: 'Notizen',
    shown: 'Notizen angezeigt', total: 'Gesamt', filters: 'Filter', reset: 'Zurücksetzen',
    meetingTpl: 'Meeting', taskTpl: 'Aufgabe', diaryTpl: 'Tagebuch', ideaTpl: 'Idee',
    emptyTpl: 'oder mit einer leeren Notiz beginnen', blankNote: 'Leere Notiz',
    emptyNotes: { all:'Keine Notizen', active:'Keine aktiven Notizen', archived:'Archiv ist leer', pinned:'Keine angehefteten Notizen' },
    emptySub: { all:'Erstelle deine erste Notiz', active:'Alt+N drücken', archived:'Archivierte Notizen erscheinen hier', pinned:'Hefte wichtige Notizen an' },
    statsTitle: 'Statistik', totalLabel: 'Gesamt', activeLabel: 'Aktiv', pinnedLabel: 'Angeheftet', wordsLabel: 'Wörter',
    activityTitle: 'Aktivität (7 Tage)', topTagsTitle: 'Top Tags',
    profileTitle: 'Profil', registeredLabel: 'Registriert', lastLoginLabel: 'Letzter Login', notesLabel: 'Notizen',
    historyTitle: 'Verlauf', historyEmpty: 'Kein Verlauf — speichere Notizen um Versionen zu sehen', restoreBtn: 'Wiederherstellen',
    hotkeysTitle: 'Tastenkürzel',
    hkEditor: 'Editor', hkSave: 'Notiz speichern', hkNew: 'Neue leere Notiz', hkPreview: 'Markdown Vorschau',
    hkNav: 'Navigation', hkSearch: 'Suche fokussieren', hkRandom: 'Zufällige Notiz', hkClose: 'Schließen',
    hkTags: 'Tags', hkAddTag: 'Tag hinzufügen', hkAddTagAlt: 'Tag hinzufügen (alternativ)', hkRemoveTag: 'Letzten Tag entfernen',
    hkTip: 'Alt statt Ctrl — um Browser-Konflikte zu vermeiden',
  },
  fr: {
    appTitle: 'Notes App', templates: 'Modèles', search: 'Rechercher… (Alt+F)',
    all: 'Tout', active: 'Actives', pinned: 'Épinglées', archived: 'Archive',
    byDate: 'Par date', byColor: 'Par couleur',
    today: "Aujourd'hui", week: 'Semaine', month: 'Mois',
    resetFilters: 'Réinitialiser', notes: 'Notes',
    shown: 'notes affichées', total: 'Total', filters: 'Filtres', reset: 'Réinitialiser',
    meetingTpl: 'Réunion', taskTpl: 'Tâche', diaryTpl: 'Journal', ideaTpl: 'Idée',
    emptyTpl: 'ou commencez avec une note vierge', blankNote: 'Note vierge',
    emptyNotes: { all:'Aucune note', active:'Aucune note active', archived:'Archive vide', pinned:'Aucune note épinglée' },
    emptySub: { all:'Créez votre première note', active:'Appuyez sur Alt+N', archived:'Les notes archivées apparaîtront ici', pinned:'Épinglez les notes importantes' },
    statsTitle: 'Statistiques', totalLabel: 'Total', activeLabel: 'Actives', pinnedLabel: 'Épinglées', wordsLabel: 'Mots',
    activityTitle: 'Activité (7 jours)', topTagsTitle: 'Top tags',
    profileTitle: 'Profil', registeredLabel: 'Inscrit le', lastLoginLabel: 'Dernière connexion', notesLabel: 'Notes',
    historyTitle: 'Historique', historyEmpty: 'Aucun historique — sauvegardez pour voir les versions', restoreBtn: 'Restaurer',
    hotkeysTitle: 'Raccourcis clavier',
    hkEditor: 'Éditeur', hkSave: 'Enregistrer', hkNew: 'Nouvelle note vierge', hkPreview: 'Aperçu Markdown',
    hkNav: 'Navigation', hkSearch: 'Rechercher', hkRandom: 'Note aléatoire', hkClose: 'Fermer',
    hkTags: 'Tags', hkAddTag: 'Ajouter tag', hkAddTagAlt: 'Ajouter tag (alt)', hkRemoveTag: 'Supprimer dernier tag',
    hkTip: 'Alt au lieu de Ctrl — pour éviter les conflits navigateur',
  },
  pl: {
    appTitle: 'Notes App', templates: 'Szablony', search: 'Szukaj… (Alt+F)',
    all: 'Wszystkie', active: 'Aktywne', pinned: 'Przypięte', archived: 'Archiwum',
    byDate: 'Według daty', byColor: 'Według koloru',
    today: 'Dziś', week: 'Tydzień', month: 'Miesiąc',
    resetFilters: 'Resetuj filtry', notes: 'Notatki',
    shown: 'notatek wyświetlono', total: 'Łącznie', filters: 'Filtrów', reset: 'Resetuj',
    meetingTpl: 'Spotkanie', taskTpl: 'Zadanie', diaryTpl: 'Dziennik', ideaTpl: 'Pomysł',
    emptyTpl: 'lub zacznij od pustej notatki', blankNote: 'Pusta notatka',
    emptyNotes: { all:'Brak notatek', active:'Brak aktywnych', archived:'Archiwum puste', pinned:'Brak przypiętych' },
    emptySub: { all:'Utwórz pierwszą notatkę', active:'Naciśnij Alt+N', archived:'Zarchiwizowane notatki pojawią się tutaj', pinned:'Przypnij ważne notatki' },
    statsTitle: 'Statystyki', totalLabel: 'Łącznie', activeLabel: 'Aktywnych', pinnedLabel: 'Przypiętych', wordsLabel: 'Słów',
    activityTitle: 'Aktywność (7 dni)', topTagsTitle: 'Top tagi',
    profileTitle: 'Profil', registeredLabel: 'Zarejestrowany', lastLoginLabel: 'Ostatnie logowanie', notesLabel: 'Notatek',
    historyTitle: 'Historia', historyEmpty: 'Brak historii — zapisuj notatki aby widzieć wersje', restoreBtn: 'Przywróć',
    hotkeysTitle: 'Skróty klawiszowe',
    hkEditor: 'Edytor', hkSave: 'Zapisz notatkę', hkNew: 'Nowa pusta notatka', hkPreview: 'Podgląd Markdown',
    hkNav: 'Nawigacja', hkSearch: 'Fokus wyszukiwania', hkRandom: 'Losowa notatka', hkClose: 'Zamknij',
    hkTags: 'Tagi', hkAddTag: 'Dodaj tag', hkAddTagAlt: 'Dodaj tag (alt)', hkRemoveTag: 'Usuń ostatni tag',
    hkTip: 'Alt zamiast Ctrl — aby uniknąć konfliktów z przeglądarką',
  },
  es: {
    appTitle: 'Notes App', templates: 'Plantillas', search: 'Buscar… (Alt+F)',
    all: 'Todas', active: 'Activas', pinned: 'Fijadas', archived: 'Archivo',
    byDate: 'Por fecha', byColor: 'Por color',
    today: 'Hoy', week: 'Semana', month: 'Mes',
    resetFilters: 'Restablecer filtros', notes: 'Notas',
    shown: 'notas mostradas', total: 'Total', filters: 'Filtros', reset: 'Restablecer',
    meetingTpl: 'Reunión', taskTpl: 'Tarea', diaryTpl: 'Diario', ideaTpl: 'Idea',
    emptyTpl: 'o empieza con una nota en blanco', blankNote: 'Nota en blanco',
    emptyNotes: { all:'Sin notas', active:'Sin notas activas', archived:'Archivo vacío', pinned:'Sin notas fijadas' },
    emptySub: { all:'Crea tu primera nota', active:'Presiona Alt+N', archived:'Las notas archivadas aparecerán aquí', pinned:'Fija notas importantes' },
    statsTitle: 'Estadísticas', totalLabel: 'Total', activeLabel: 'Activas', pinnedLabel: 'Fijadas', wordsLabel: 'Palabras',
    activityTitle: 'Actividad (7 días)', topTagsTitle: 'Top etiquetas',
    profileTitle: 'Perfil', registeredLabel: 'Registrado', lastLoginLabel: 'Último acceso', notesLabel: 'Notas',
    historyTitle: 'Historial', historyEmpty: 'Sin historial — guarda notas para ver versiones', restoreBtn: 'Restaurar',
    hotkeysTitle: 'Atajos de teclado',
    hkEditor: 'Editor', hkSave: 'Guardar nota', hkNew: 'Nueva nota en blanco', hkPreview: 'Vista previa Markdown',
    hkNav: 'Navegación', hkSearch: 'Enfocar búsqueda', hkRandom: 'Nota aleatoria', hkClose: 'Cerrar',
    hkTags: 'Etiquetas', hkAddTag: 'Añadir etiqueta', hkAddTagAlt: 'Añadir etiqueta (alt)', hkRemoveTag: 'Eliminar última etiqueta',
    hkTip: 'Alt en lugar de Ctrl — para evitar conflictos con el navegador',
  },
  zh: {
    appTitle: 'Notes App', templates: '模板', search: '搜索… (Alt+F)',
    all: '全部', active: '活跃', pinned: '置顶', archived: '归档',
    byDate: '按日期', byColor: '按颜色',
    today: '今天', week: '本周', month: '本月',
    resetFilters: '重置筛选', notes: '笔记',
    shown: '条笔记显示中', total: '共计', filters: '筛选器', reset: '重置',
    meetingTpl: '会议', taskTpl: '任务', diaryTpl: '日记', ideaTpl: '想法',
    emptyTpl: '或从空白笔记开始', blankNote: '空白笔记',
    emptyNotes: { all:'暂无笔记', active:'暂无活跃笔记', archived:'归档为空', pinned:'暂无置顶笔记' },
    emptySub: { all:'创建第一条笔记', active:'按 Alt+N 开始', archived:'归档笔记将显示在此处', pinned:'置顶重要笔记' },
    statsTitle: '统计', totalLabel: '总计', activeLabel: '活跃', pinnedLabel: '置顶', wordsLabel: '词数',
    activityTitle: '最近7天活跃', topTagsTitle: '热门标签',
    profileTitle: '个人资料', registeredLabel: '注册时间', lastLoginLabel: '最后登录', notesLabel: '笔记数',
    historyTitle: '修改历史', historyEmpty: '暂无历史 — 保存笔记以查看版本', restoreBtn: '恢复',
    hotkeysTitle: '键盘快捷键',
    hkEditor: '编辑器', hkSave: '保存笔记', hkNew: '新建空白笔记', hkPreview: 'Markdown 预览',
    hkNav: '导航', hkSearch: '聚焦搜索', hkRandom: '随机笔记', hkClose: '关闭',
    hkTags: '标签', hkAddTag: '添加标签', hkAddTagAlt: '添加标签（备选）', hkRemoveTag: '删除最后标签',
    hkTip: '使用 Alt 而非 Ctrl — 避免与浏览器冲突',
  },
};
const THEME_ICONS = {
  dark: 'ph-moon', light: 'ph-sun', obsidian: 'ph-rocket-launch',
  dim: 'ph-moon-stars', cyber: 'ph-terminal-window', pastel: 'ph-flower',
};

function getNoteTemplates(lang) {
  const today = new Date().toLocaleDateString(
    lang === 'zh' ? 'zh-CN' : lang === 'uk' ? 'uk-UA' : lang === 'ru' ? 'ru-RU' :
    lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'pl' ? 'pl-PL' :
    lang === 'es' ? 'es-ES' : 'en-US',
    { weekday:'long', year:'numeric', month:'long', day:'numeric' }
  );

  const t = {
    uk: {
      meeting: { title:'📅 Зустріч', content:`## Зустріч\n**Дата:** \n**Учасники:** \n\n### Порядок денний\n- \n\n### Нотатки\n\n### Рішення\n- `, tags:['зустріч'] },
      task:    { title:'✅ Завдання', content:`## Завдання\n**Дедлайн:** \n**Пріоритет:** Середній\n\n### Опис\n\n### Кроки\n- [ ] \n- [ ] \n- [ ] \n\n### Результат`, tags:['завдання'] },
      diary:   { title:'📓 Щоденник', content:`## ${today}\n\n### Як пройшов день?\n\n### За що вдячний?\n1. \n2. \n3. \n\n### Плани на завтра`, tags:['щоденник'] },
      idea:    { title:'💡 Ідея', content:`## Ідея\n\n### Суть\n\n### Навіщо це потрібно?\n\n### Як реалізувати?\n\n### Наступний крок`, tags:['ідея'] },
    },
    en: {
      meeting: { title:'📅 Meeting', content:`## Meeting\n**Date:** \n**Participants:** \n\n### Agenda\n- \n\n### Notes\n\n### Decisions\n- `, tags:['meeting'] },
      task:    { title:'✅ Task', content:`## Task\n**Deadline:** \n**Priority:** Medium\n\n### Description\n\n### Steps\n- [ ] \n- [ ] \n- [ ] \n\n### Result`, tags:['task'] },
      diary:   { title:'📓 Diary', content:`## ${today}\n\n### How was the day?\n\n### Grateful for?\n1. \n2. \n3. \n\n### Plans for tomorrow`, tags:['diary'] },
      idea:    { title:'💡 Idea', content:`## Idea\n\n### What is it?\n\n### Why is it needed?\n\n### How to implement?\n\n### Next step`, tags:['idea'] },
    },
    ru: {
      meeting: { title:'📅 Встреча', content:`## Встреча\n**Дата:** \n**Участники:** \n\n### Повестка\n- \n\n### Заметки\n\n### Решения\n- `, tags:['встреча'] },
      task:    { title:'✅ Задача', content:`## Задача\n**Дедлайн:** \n**Приоритет:** Средний\n\n### Описание\n\n### Шаги\n- [ ] \n- [ ] \n- [ ] \n\n### Результат`, tags:['задача'] },
      diary:   { title:'📓 Дневник', content:`## ${today}\n\n### Как прошёл день?\n\n### За что благодарен?\n1. \n2. \n3. \n\n### Планы на завтра`, tags:['дневник'] },
      idea:    { title:'💡 Идея', content:`## Идея\n\n### Суть\n\n### Зачем это нужно?\n\n### Как реализовать?\n\n### Следующий шаг`, tags:['идея'] },
    },
    de: {
      meeting: { title:'📅 Meeting', content:`## Meeting\n**Datum:** \n**Teilnehmer:** \n\n### Tagesordnung\n- \n\n### Notizen\n\n### Entscheidungen\n- `, tags:['meeting'] },
      task:    { title:'✅ Aufgabe', content:`## Aufgabe\n**Deadline:** \n**Priorität:** Mittel\n\n### Beschreibung\n\n### Schritte\n- [ ] \n- [ ] \n- [ ] \n\n### Ergebnis`, tags:['aufgabe'] },
      diary:   { title:'📓 Tagebuch', content:`## ${today}\n\n### Wie war der Tag?\n\n### Wofür bin ich dankbar?\n1. \n2. \n3. \n\n### Pläne für morgen`, tags:['tagebuch'] },
      idea:    { title:'💡 Idee', content:`## Idee\n\n### Was ist es?\n\n### Warum wird es gebraucht?\n\n### Wie umsetzen?\n\n### Nächster Schritt`, tags:['idee'] },
    },
    fr: {
      meeting: { title:'📅 Réunion', content:`## Réunion\n**Date:** \n**Participants:** \n\n### Ordre du jour\n- \n\n### Notes\n\n### Décisions\n- `, tags:['réunion'] },
      task:    { title:'✅ Tâche', content:`## Tâche\n**Échéance:** \n**Priorité:** Moyenne\n\n### Description\n\n### Étapes\n- [ ] \n- [ ] \n- [ ] \n\n### Résultat`, tags:['tâche'] },
      diary:   { title:'📓 Journal', content:`## ${today}\n\n### Comment s'est passée la journée?\n\n### Reconnaissant pour?\n1. \n2. \n3. \n\n### Plans pour demain`, tags:['journal'] },
      idea:    { title:'💡 Idée', content:`## Idée\n\n### C'est quoi?\n\n### Pourquoi?\n\n### Comment réaliser?\n\n### Prochaine étape`, tags:['idée'] },
    },
    pl: {
      meeting: { title:'📅 Spotkanie', content:`## Spotkanie\n**Data:** \n**Uczestnicy:** \n\n### Agenda\n- \n\n### Notatki\n\n### Decyzje\n- `, tags:['spotkanie'] },
      task:    { title:'✅ Zadanie', content:`## Zadanie\n**Termin:** \n**Priorytet:** Średni\n\n### Opis\n\n### Kroki\n- [ ] \n- [ ] \n- [ ] \n\n### Wynik`, tags:['zadanie'] },
      diary:   { title:'📓 Dziennik', content:`## ${today}\n\n### Jak minął dzień?\n\n### Za co jestem wdzięczny?\n1. \n2. \n3. \n\n### Plany na jutro`, tags:['dziennik'] },
      idea:    { title:'💡 Pomysł', content:`## Pomysł\n\n### Co to jest?\n\n### Po co?\n\n### Jak zrealizować?\n\n### Następny krok`, tags:['pomysł'] },
    },
    es: {
      meeting: { title:'📅 Reunión', content:`## Reunión\n**Fecha:** \n**Participantes:** \n\n### Orden del día\n- \n\n### Notas\n\n### Decisiones\n- `, tags:['reunión'] },
      task:    { title:'✅ Tarea', content:`## Tarea\n**Fecha límite:** \n**Prioridad:** Media\n\n### Descripción\n\n### Pasos\n- [ ] \n- [ ] \n- [ ] \n\n### Resultado`, tags:['tarea'] },
      diary:   { title:'📓 Diario', content:`## ${today}\n\n### ¿Cómo fue el día?\n\n### ¿Por qué estoy agradecido?\n1. \n2. \n3. \n\n### Planes para mañana`, tags:['diario'] },
      idea:    { title:'💡 Idea', content:`## Idea\n\n### ¿Qué es?\n\n### ¿Por qué se necesita?\n\n### ¿Cómo implementar?\n\n### Siguiente paso`, tags:['idea'] },
    },
    zh: {
      meeting: { title:'📅 会议', content:`## 会议\n**日期：** \n**参与者：** \n\n### 议程\n- \n\n### 笔记\n\n### 决定\n- `, tags:['会议'] },
      task:    { title:'✅ 任务', content:`## 任务\n**截止日期：** \n**优先级：** 中\n\n### 描述\n\n### 步骤\n- [ ] \n- [ ] \n- [ ] \n\n### 结果`, tags:['任务'] },
      diary:   { title:'📓 日记', content:`## ${today}\n\n### 今天怎么样？\n\n### 感恩什么？\n1. \n2. \n3. \n\n### 明天的计划`, tags:['日记'] },
      idea:    { title:'💡 想法', content:`## 想法\n\n### 是什么？\n\n### 为什么需要？\n\n### 如何实现？\n\n### 下一步`, tags:['想法'] },
    },
  };

  return t[lang] || t.en;
}

createApp({
  components: { AuthScreen, NoteList, NoteEditor, ContextMenu },

  data() {
    return {
      currentUser:     null,
      appReady:        false,
      allNotes:        [],
      notesLoading:    true,
      drawerOpen:      false,
      selectedNote:    null,
      undoStack:       [],
      _unsubscribe:    null,
      filterMode:      'active',
      searchQuery:     '',
      colorFilter:     '',
      dateFilter:      '',
      theme:           localStorage.getItem('theme') || 'dark',
      lang:            localStorage.getItem('lang')  || 'en',
      showLangMenu:    false,
      ctxNote:         null, ctxX: 0, ctxY: 0,
      focusMode:       false,
      showTemplates:   false,
      // Модальні вікна
      showStats:       false,
      showProfile:     false,
      showHistory:     false,
      showHotkeys:     false,
      noteHistory:     [],
      historyLoading:  false,
    };
  },

  computed: {
    isLoggedIn()  { return !!this.currentUser; },
    at()          { return APP_I18N[this.lang] || APP_I18N.uk; },
    displayName() { return this.currentUser?.displayName || this.currentUser?.email || 'Користувач'; },
    avatarUrl()   { return this.currentUser?.photoURL || null; },
    themeIcon()   { return THEME_ICONS[this.theme] || 'ph-moon'; },

    filteredNotes() {
      let notes = this.allNotes.filter(n => {
        switch (this.filterMode) {
          case 'all':      return true;
          case 'active':   return !n.archived;
          case 'archived': return n.archived === true;
          case 'pinned':   return n.pinned && !n.archived;
          default:         return !n.archived;
        }
      });
      if (this.searchQuery) {
        const q = this.searchQuery;
        notes = notes.filter(n =>
          (n.title   || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q) ||
          (n.tags    || []).some(t => t.includes(q))
        );
      }
      if (this.colorFilter) notes = notes.filter(n => n.color === this.colorFilter);
      if (this.dateFilter) {
        const now = new Date(), from = new Date();
        if (this.dateFilter === 'today')      from.setHours(0,0,0,0);
        else if (this.dateFilter === 'week')  from.setDate(now.getDate() - 7);
        else if (this.dateFilter === 'month') from.setMonth(now.getMonth() - 1);
        notes = notes.filter(n => new Date(n.date) >= from);
      }
      return notes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
      });
    },

    selectedNoteId() { return this.selectedNote?.id || null; },

    availableColors() {
      return [...new Set(this.allNotes.map(n => n.color).filter(Boolean))];
    },

    activeFiltersCount() {
      return (this.colorFilter ? 1 : 0) + (this.dateFilter ? 1 : 0);
    },

    langMenuPos() {
      const btn = this.$refs.langBtn;
      if (!btn) return { top: '70px', right: '14px' };
      const r = btn.getBoundingClientRect();
      return { top: (r.bottom + 6) + 'px', right: (window.innerWidth - r.right) + 'px' };
    },

    templatesPos() {
      const btn = this.$refs.templateBtn;
      if (!btn) return { top: '70px', left: '14px' };
      const r = btn.getBoundingClientRect();
      return { top: (r.bottom + 8) + 'px', left: r.left + 'px' };
    },

    // ═══ СТАТИСТИКА ═══════════════════════════════
    stats() {
      const total    = this.allNotes.length;
      const archived = this.allNotes.filter(n => n.archived).length;
      const pinned   = this.allNotes.filter(n => n.pinned && !n.archived).length;
      const totalWords = this.allNotes.reduce((acc, n) => {
        return acc + (n.content?.trim() ? n.content.trim().split(/\s+/).length : 0);
      }, 0);

      // Топ теги
      const tagMap = {};
      this.allNotes.forEach(n => (n.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; }));
      const topTags = Object.entries(tagMap).sort((a,b) => b[1]-a[1]).slice(0, 8);

      // Активність за останні 7 днів
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0,0,0,0);
        const next = new Date(d); next.setDate(d.getDate() + 1);
        const count = this.allNotes.filter(n => {
          const nd = new Date(n.date);
          return nd >= d && nd < next;
        }).length;
        days.push({ label: d.toLocaleDateString('uk-UA', { weekday:'short' }), count });
      }

      return { total, archived, pinned, active: total - archived, totalWords, topTags, days };
    },

    // ═══ ПРОФІЛЬ ══════════════════════════════════
    profileInfo() {
      const u = this.currentUser;
      if (!u) return {};
      return {
        name:     u.displayName || '—',
        email:    u.email,
        avatar:   u.photoURL,
        created:  u.metadata?.creationTime
                    ? new Date(u.metadata.creationTime).toLocaleDateString('uk-UA', { day:'2-digit', month:'long', year:'numeric' })
                    : '—',
        lastLogin: u.metadata?.lastSignInTime
                    ? new Date(u.metadata.lastSignInTime).toLocaleDateString('uk-UA', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })
                    : '—',
      };
    },
  },

  mounted() {
    this.applyTheme(this.theme);
    this.setupAuthListener();
    this.setupHotkeys();
    window.addEventListener('beforeunload', (e) => {
      if (this.selectedNote && !this.selectedNote.id) {
        e.preventDefault(); e.returnValue = 'Є незбережені зміни.';
      }
    });
  },

  beforeUnmount() {
    this._stopListening();
    document.removeEventListener('keydown', this._hotkeyHandler);
  },

  methods: {

    /* ═══ AUTH ════════════════════════════════════ */
    setupAuthListener() {
      auth.onAuthStateChanged(user => {
        this.appReady    = true;
        this.currentUser = user;
        if (user) {
          this._startListening(user.uid);
          toast(`Ласкаво просимо, ${user.displayName || user.email}!`, 'success');
        } else {
          this._stopListening();
        }
      });
    },

    async handleLogout() {
      await auth.signOut();
      toast('До побачення!', 'info', 2000);
    },

    /* ═══ FIRESTORE ═══════════════════════════════ */
    _startListening(uid) {
      this._stopListening();
      this._restoreDraft(uid);
      this._unsubscribe = subscribeToNotes(uid, (notes, err) => {
        if (err) { console.error(err); toast('Помилка завантаження', 'error'); return; }
        this.allNotes     = notes;
        this.notesLoading = false;
      });
    },

    _stopListening() {
      if (this._unsubscribe) { this._unsubscribe(); this._unsubscribe = null; }
      this.allNotes = []; this.selectedNote = null;
    },

    /* ═══ CRUD ════════════════════════════════════ */
    async handleSave({ title, content, color, tags }) {
      const uid = this.currentUser?.uid;
      if (!uid) return;
      if (!title && !content) { toast('Додайте назву або текст', 'warning'); return; }
      try {
        const isNew = !this.selectedNote?.id;
        const note  = {
          ...(this.selectedNote?.id ? { id: this.selectedNote.id } : {}),
          title, content, color, tags, userId: uid,
          archived: this.selectedNote?.archived || false,
          pinned:   this.selectedNote?.pinned   || false,
          isPublic: this.selectedNote?.isPublic || false,
        };
        const savedId = await saveNote(note);
        const finalId = this.selectedNote?.id || savedId;

        // Зберегти версію в історію
        await saveNoteHistory(finalId, { title, content, color, tags, savedAt: new Date().toISOString() });

        if (isNew) this.selectedNote = { ...note, id: savedId };
        else this.selectedNote = { ...this.selectedNote, title, content, color, tags };

        this._clearDraft();
        toast('Нотатку збережено', 'success');
      } catch(e) { console.error(e); toast('Помилка збереження', 'error'); }
    },

    async handleDelete() {
      if (!this.selectedNote?.id) { toast('Оберіть нотатку', 'warning'); return; }
      const ok = await confirmModal(`Видалити "${this.selectedNote.title || '(Без назви)'}"?`, { confirmText: 'Видалити', danger: true });
      if (!ok) return;
      try {
        this.undoStack.push({ ...this.selectedNote });
        await deleteNote(this.selectedNote.id);
        this.selectedNote = null;
        toast('Нотатку видалено · Ctrl+Z для відновлення', 'info');
      } catch { toast('Помилка видалення', 'error'); }
    },

    async handlePin() {
      if (!this.selectedNote?.id) return;
      try {
        const state = !this.selectedNote.pinned;
        await togglePin(this.selectedNote.id, state);
        this.selectedNote = { ...this.selectedNote, pinned: state };
        toast(state ? 'Закріплено' : 'Відкріплено', 'success');
      } catch { toast('Помилка', 'error'); }
    },

    async handleArchive() {
      if (!this.selectedNote?.id) return;
      try {
        const state = !this.selectedNote.archived;
        await toggleArchive(this.selectedNote.id, state);
        this.selectedNote = null;
        toast(state ? 'В архів' : 'Відновлено', 'success');
      } catch { toast('Помилка', 'error'); }
    },

    async handleUndo() {
      if (!this.undoStack.length) { toast('Немає дій для скасування', 'warning'); return; }
      const uid = this.currentUser?.uid; if (!uid) return;
      try {
        const { id, ...data } = this.undoStack.pop();
        await saveNote({ ...data, userId: uid });
        toast('Нотатку відновлено', 'success');
      } catch { toast('Помилка відновлення', 'error'); }
    },

    selectNote(note) { this.selectedNote = note; this.showTemplates = false; },

    /* ═══ ПУБЛІЧНА ССИЛКА ══════════════════════════ */
    async togglePublic() {
      if (!this.selectedNote?.id) return;
      try {
        const state = !this.selectedNote.isPublic;
        await db.collection('notes').doc(this.selectedNote.id).update({ isPublic: state });
        this.selectedNote = { ...this.selectedNote, isPublic: state };
        if (state) {
          const url = `${location.origin}/public.html?id=${this.selectedNote.id}`;
          await navigator.clipboard.writeText(url).catch(() => {});
          toast('Посилання скопійовано! 🔗', 'success', 4000);
        } else {
          toast('Публічний доступ закрито', 'info');
        }
      } catch { toast('Помилка', 'error'); }
    },

    /* ═══ ІСТОРІЯ ЗМІН ════════════════════════════ */
    async openHistory() {
      if (!this.selectedNote?.id) { toast('Спочатку оберіть нотатку', 'warning'); return; }
      this.showHistory    = true;
      this.historyLoading = true;
      this.noteHistory    = [];
      try {
        this.noteHistory = await getNoteHistory(this.selectedNote.id);
      } catch { toast('Помилка завантаження історії', 'error'); }
      this.historyLoading = false;
    },

    async restoreVersion(version) {
      const ok = await confirmModal('Відновити цю версію? Поточний текст буде замінено.', { confirmText: 'Відновити' });
      if (!ok) return;
      this.selectedNote = { ...this.selectedNote, title: version.title, content: version.content, color: version.color, tags: version.tags };
      this.showHistory = false;
      toast('Версію відновлено — натисніть Зберегти', 'info', 3000);
    },

    /* ═══ ШАБЛОНИ ═════════════════════════════════ */
    toggleTemplates() { this.showTemplates = !this.showTemplates; },

    applyTemplate(key) {
      const templates = getNoteTemplates(this.lang);
      const tpl = templates[key]; if (!tpl) return;
      const colors = { meeting: '#4dabf7', task: '#40c057', diary: '#ae3ec9', idea: '#fab005' };
      this.selectedNote  = { ...tpl, color: colors[key] || '#4dabf7' };
      this.showTemplates = false;
      toast(`📋 ${tpl.title}`, 'success');
    },

    /* ═══ ВИПАДКОВА НОТАТКА ════════════════════════ */
    openRandomNote() {
      const active = this.allNotes.filter(n => !n.archived);
      if (!active.length) { toast('Немає нотаток', 'warning'); return; }
      this.selectNote(active[Math.floor(Math.random() * active.length)]);
      toast('🎲 Випадкова нотатка!', 'info', 2000);
    },

    /* ═══ РЕЖИМ ФОКУСУ ════════════════════════════ */
    toggleFocusMode() {
      this.focusMode = !this.focusMode;
      if (this.focusMode) {
        document.documentElement.requestFullscreen?.().catch(() => {});
        toast('Режим фокусу — Escape для виходу', 'info', 2500);
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    },

    /* ═══ ФІЛЬТРИ ═════════════════════════════════ */
    setColorFilter(color) { this.colorFilter = this.colorFilter === color ? '' : color; },
    setDateFilter(val)    { this.dateFilter  = this.dateFilter  === val  ? '' : val;   },
    clearAllFilters()     { this.colorFilter = ''; this.dateFilter = ''; this.searchQuery = ''; },

    /* ═══ КОНТЕКСТНЕ МЕНЮ ═════════════════════════ */
    showContextMenu(event, note) { this.ctxNote = note; this.ctxX = event.pageX; this.ctxY = event.pageY; },
    closeContextMenu() { this.ctxNote = null; },

    async ctxPin(note) {
      await togglePin(note.id, !note.pinned);
      if (this.selectedNote?.id === note.id) this.selectedNote = { ...this.selectedNote, pinned: !note.pinned };
      toast(note.pinned ? 'Відкріплено' : 'Закріплено', 'success');
    },
    async ctxArchive(note) {
      await toggleArchive(note.id, !note.archived);
      if (this.selectedNote?.id === note.id) this.selectedNote = null;
      toast(note.archived ? 'Відновлено' : 'В архів', 'success');
    },
    ctxEdit(note) { this.selectedNote = note; },
    async ctxDelete(note) {
      const ok = await confirmModal(`Видалити "${note.title || '(Без назви)'}"?`, { confirmText: 'Видалити', danger: true });
      if (!ok) return;
      this.undoStack.push({ ...note });
      await deleteNote(note.id);
      if (this.selectedNote?.id === note.id) this.selectedNote = null;
      toast('Видалено', 'info');
    },

    /* ═══ МОВА ════════════════════════════════════ */
    toggleLangMenu() {
      this.showLangMenu = !this.showLangMenu;
    },
    setLang(code) {
      this.lang = code;
      localStorage.setItem('lang', code);
      this.showLangMenu = false;
    },

    /* ═══ ТЕМА ════════════════════════════════════ */
    applyTheme(name) {
      if (!THEMES.includes(name)) name = 'dark';
      document.body.setAttribute('data-theme', name);
      this.theme = name;
      localStorage.setItem('theme', name);
    },
    nextTheme() { this.applyTheme(THEMES[(THEMES.indexOf(this.theme) + 1) % THEMES.length]); },

    /* ═══ ЧЕРНЕТКА ════════════════════════════════ */
    _saveDraft() {
      const uid = this.currentUser?.uid; if (!uid) return;
      localStorage.setItem(`${DRAFT_KEY}_${uid}`, JSON.stringify({
        title: this.selectedNote?.title || '', content: this.selectedNote?.content || '',
        color: this.selectedNote?.color || '#4dabf7', tags: this.selectedNote?.tags || [],
      }));
    },
    _restoreDraft(uid) {
      try {
        const raw = localStorage.getItem(`${DRAFT_KEY}_${uid}`);
        if (!raw) return;
        const d = JSON.parse(raw);
        if (d.title || d.content) {
          this.selectedNote = { title: d.title, content: d.content, color: d.color, tags: d.tags || [] };
          toast('Чорновик відновлено', 'info', 2500);
        }
      } catch { /* ignore */ }
    },
    _clearDraft() {
      const uid = this.currentUser?.uid;
      if (uid) localStorage.removeItem(`${DRAFT_KEY}_${uid}`);
    },

    /* ═══ ЕКСПОРТ / ІМПОРТ ════════════════════════ */
    handleExport() {
      const blob = new Blob([JSON.stringify(this.allNotes, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `notes_${Date.now()}.json` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast(`Експортовано ${this.allNotes.length} нотаток`, 'success');
    },
    async handleImport(file) {
      const uid = this.currentUser?.uid; if (!uid) return;
      try {
        const notes = JSON.parse(await file.text());
        if (!Array.isArray(notes)) throw new Error('Файл повинен містити масив');
        const count = await importNotes(notes, uid);
        toast(`Імпортовано ${count} нотаток`, 'success');
      } catch (err) { toast(`Помилка імпорту: ${err.message}`, 'error'); }
    },

    /* ═══ ГАРЯЧІ КЛАВІШІ ══════════════════════════ */
    setupHotkeys() {
      this._hotkeyHandler = (e) => {
        const alt = e.altKey;

        // e.code — фізична клавіша, працює на будь-якій розкладці
        if (alt && e.code === 'KeyS') { e.preventDefault(); this.$refs.editor?.handleSave(); }
        if (alt && e.code === 'KeyN') { e.preventDefault(); this.selectedNote = {}; }
        if (alt && e.code === 'KeyF') { e.preventDefault(); document.querySelector('.sidebar-search')?.focus(); }
        if (alt && e.code === 'KeyR') { e.preventDefault(); this.openRandomNote(); }
        if (alt && e.code === 'KeyP') { e.preventDefault(); if (this.$refs.editor) this.$refs.editor.mdPreview = !this.$refs.editor.mdPreview; }

        if (e.key === 'Escape') {
          if (this.showStats || this.showProfile || this.showHistory || this.showHotkeys) {
            this.showStats = this.showProfile = this.showHistory = this.showHotkeys = false; return;
          }
          if (this.drawerOpen) { this.drawerOpen = false; return; }
          if (this.focusMode) { this.toggleFocusMode(); return; }
          this.selectedNote = null; this.ctxNote = null; this.showTemplates = false;
        }
      };
      document.addEventListener('keydown', this._hotkeyHandler);
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) this.focusMode = false;
      });
    },
  },

  template: `
    <template v-if="!appReady">
      <div class="loading-screen">
        <i class="ph ph-spinner" style="font-size:2rem;animation:spin 1s linear infinite"></i>
      </div>
    </template>

    <template v-else-if="!isLoggedIn">
      <auth-screen />
    </template>

    <template v-else>

      <div v-show="!focusMode" id="app-header" class="glass-panel">
        <h1><i class="ph ph-notebook"></i> {{ at.appTitle }}</h1>
        <div class="top-right">

          <div style="position:relative">
            <button ref="templateBtn" class="btn" title="Шаблони" @click="toggleTemplates">
              <i class="ph ph-layout"></i> {{ at.templates }}
            </button>
          </div>

          <button class="btn" title="Випадкова нотатка (Alt+R)" @click="openRandomNote">
            <i class="ph ph-shuffle"></i>
          </button>

          <button class="btn" title="Статистика" @click="showStats = true">
            <i class="ph ph-chart-bar"></i>
          </button>

          <button class="btn" title="Режим фокусу" @click="toggleFocusMode">
            <i class="ph ph-arrows-out-simple"></i>
          </button>

          <div class="user-info" style="cursor:pointer" title="Профіль" @click="showProfile = true">
            <img v-if="avatarUrl" :src="avatarUrl" class="user-avatar" alt="avatar">
            <div v-else class="user-avatar-placeholder">{{ displayName[0] }}</div>
            <span>{{ displayName }}</span>
          </div>

          <button class="btn" title="Гарячі клавіші (?)" @click="showHotkeys = true">
            <i class="ph ph-question"></i>
          </button>

          <button class="btn" :title="'Тема: ' + theme" @click="nextTheme">
            <i :class="'ph ' + themeIcon"></i>
          </button>

          <!-- Мова -->
          <div style="position:relative" ref="langBtn">
            <button class="btn" title="Мова / Language" @click.stop="toggleLangMenu">
              <i class="ph ph-globe"></i>
            </button>
          </div>
          <button class="btn delete" title="Вийти" @click="handleLogout">
            <i class="ph ph-sign-out"></i>
          </button>
        </div>
      </div>

      <button v-if="focusMode" class="focus-exit-btn" @click="toggleFocusMode">
        <i class="ph ph-arrows-in-simple"></i>
      </button>

      <!-- Мобільна кнопка відкрити сайдбар -->
      <button class="btn-drawer-open" title="Нотатки" @click="drawerOpen = !drawerOpen">
        <i class="ph ph-list"></i>
      </button>
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false"></div>

      <div id="app-container">
        <template v-if="!focusMode">
          <note-list
            :notes="filteredNotes" :all-notes="allNotes"
            :selected-id="selectedNoteId"
            :filter-mode="filterMode" :search-query="searchQuery"
            :color-filter="colorFilter" :date-filter="dateFilter"
            :available-colors="availableColors"
            :active-filters-count="activeFiltersCount"
            :loading="notesLoading"
            :lang="lang"
            :class="{ 'drawer-open': drawerOpen }"
            @update:filterMode="filterMode = $event"
            @update:searchQuery="searchQuery = $event"
            @select="selectNote($event); drawerOpen = false"
            @contextmenu="showContextMenu"
            @set-color-filter="setColorFilter"
            @set-date-filter="setDateFilter"
            @clear-filters="clearAllFilters"
          />
        </template>

        <note-editor
          ref="editor" v-model="selectedNote"
          :focus-mode="focusMode"
          :lang="lang"
          @save="handleSave" @delete="handleDelete"
          @pin="handlePin" @archive="handleArchive"
          @undo="handleUndo" @export="handleExport" @import="handleImport"
          @toggle-public="togglePublic"
          @open-history="openHistory"
          @new-note="selectedNote = {}"
        />
      </div>

      <div v-show="!focusMode" id="status-bar" class="glass-panel">
        {{ filteredNotes.length }} {{ at.shown }} · {{ at.total }}: {{ allNotes.length }}
        <template v-if="activeFiltersCount"> · <span style="color:var(--accent)">{{ at.filters }}: {{ activeFiltersCount }}</span>
          <button class="btn-clear-filter" @click="clearAllFilters">✕ {{ at.reset }}</button>
        </template>
      </div>

      <!-- Шаблони -->
      <div v-if="showTemplates" class="templates-dropdown" :style="templatesPos">
        <div class="templates-title">{{ at.templates }}</div>
        <button class="template-item" @click="applyTemplate('meeting')"><i class="ph ph-calendar"></i> {{ at.meetingTpl }}</button>
        <button class="template-item" @click="applyTemplate('task')"><i class="ph ph-check-square"></i> {{ at.taskTpl }}</button>
        <button class="template-item" @click="applyTemplate('diary')"><i class="ph ph-book-open"></i> {{ at.diaryTpl }}</button>
        <button class="template-item" @click="applyTemplate('idea')"><i class="ph ph-lightbulb"></i> {{ at.ideaTpl }}</button>
        <div class="templates-hint">{{ at.emptyTpl }}</div>
        <button class="template-item" style="border-top:1px solid var(--border-color);margin-top:2px" @click="selectedNote = {}; showTemplates = false">
          <i class="ph ph-note-blank"></i> {{ at.blankNote }}
        </button>
      </div>
      <div v-if="showTemplates" class="overlay-close" @click="showTemplates = false"></div>

      <!-- Мова — фіксований дропдаун поза хедером -->
      <div v-if="showLangMenu" class="templates-dropdown" :style="langMenuPos">
        <div class="templates-title">Мова / Language</div>
        <button v-for="l in [{code:'uk',flag:'🇺🇦',label:'Українська'},{code:'en',flag:'🇬🇧',label:'English'},{code:'ru',flag:'🇷🇺',label:'Русский'},{code:'de',flag:'🇩🇪',label:'Deutsch'},{code:'fr',flag:'🇫🇷',label:'Français'},{code:'pl',flag:'🇵🇱',label:'Polski'},{code:'es',flag:'🇪🇸',label:'Español'},{code:'zh',flag:'🇨🇳',label:'中文'}]"
          :key="l.code" class="template-item" :class="{ 'template-item--active': lang === l.code }"
          @click="setLang(l.code)">
          {{ l.flag }} {{ l.label }}
          <i v-if="lang === l.code" class="ph ph-check" style="margin-left:auto;color:var(--accent)"></i>
        </button>
      </div>
      <div v-if="showLangMenu" class="overlay-close" @click="showLangMenu = false"></div>

      <context-menu v-if="ctxNote" :note="ctxNote" :x="ctxX" :y="ctxY"
        @pin="ctxPin" @archive="ctxArchive" @edit="ctxEdit" @delete="ctxDelete" @close="closeContextMenu" />

      <!-- ═══ МОДАЛ: СТАТИСТИКА ═══ -->
      <div v-if="showStats" class="modal-overlay" @click.self="showStats = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2><i class="ph ph-chart-bar"></i> {{ at.statsTitle }}</h2>
            <button class="btn-modal-close" @click="showStats = false"><i class="ph ph-x"></i></button>
          </div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-num">{{ stats.total }}</div><div class="stat-label">{{ at.totalLabel }}</div></div>
            <div class="stat-card"><div class="stat-num">{{ stats.active }}</div><div class="stat-label">{{ at.activeLabel }}</div></div>
            <div class="stat-card"><div class="stat-num">{{ stats.pinned }}</div><div class="stat-label">{{ at.pinnedLabel }}</div></div>
            <div class="stat-card"><div class="stat-num">{{ stats.totalWords }}</div><div class="stat-label">{{ at.wordsLabel }}</div></div>
          </div>
          <div class="stats-section-title">{{ at.activityTitle }}</div>
          <div class="activity-chart">
            <div v-for="day in stats.days" :key="day.label" class="chart-col">
              <div class="chart-bar-wrap">
                <div class="chart-bar" :style="{ height: (day.count ? Math.max(day.count / Math.max(...stats.days.map(d=>d.count||1)) * 100, 8) : 4) + '%' }"></div>
              </div>
              <div class="chart-label">{{ day.label }}</div>
              <div class="chart-count">{{ day.count }}</div>
            </div>
          </div>
          <div v-if="stats.topTags.length" class="stats-section-title">{{ at.topTagsTitle }}</div>
          <div v-if="stats.topTags.length" class="top-tags">
            <span v-for="[tag, count] in stats.topTags" :key="tag" class="tag-stat">
              {{ tag }} <span class="tag-stat-count">{{ count }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- ═══ МОДАЛ: ПРОФІЛЬ ═══ -->
      <div v-if="showProfile" class="modal-overlay" @click.self="showProfile = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2><i class="ph ph-user-circle"></i> {{ at.profileTitle }}</h2>
            <button class="btn-modal-close" @click="showProfile = false"><i class="ph ph-x"></i></button>
          </div>
          <div class="profile-body">
            <div class="profile-avatar-wrap">
              <img v-if="profileInfo.avatar" :src="profileInfo.avatar" class="profile-avatar">
              <div v-else class="profile-avatar-placeholder">{{ (profileInfo.name || '?')[0] }}</div>
            </div>
            <div class="profile-name">{{ profileInfo.name }}</div>
            <div class="profile-email">{{ profileInfo.email }}</div>
            <div class="profile-meta">
              <div class="profile-meta-row"><i class="ph ph-calendar-plus"></i> {{ at.registeredLabel }}: {{ profileInfo.created }}</div>
              <div class="profile-meta-row"><i class="ph ph-sign-in"></i> {{ at.lastLoginLabel }}: {{ profileInfo.lastLogin }}</div>
            </div>
            <div class="stats-grid" style="margin-top:16px">
              <div class="stat-card"><div class="stat-num">{{ stats.total }}</div><div class="stat-label">{{ at.notesLabel }}</div></div>
              <div class="stat-card"><div class="stat-num">{{ stats.totalWords }}</div><div class="stat-label">{{ at.wordsLabel }}</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ МОДАЛ: ІСТОРІЯ ═══ -->
      <div v-if="showHistory" class="modal-overlay" @click.self="showHistory = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2><i class="ph ph-clock-counter-clockwise"></i> {{ at.historyTitle }}</h2>
            <button class="btn-modal-close" @click="showHistory = false"><i class="ph ph-x"></i></button>
          </div>
          <div v-if="historyLoading" style="text-align:center;padding:24px;color:var(--muted)">
            <i class="ph ph-spinner" style="animation:spin 1s linear infinite;font-size:1.5rem"></i>
          </div>
          <div v-else-if="!noteHistory.length" style="text-align:center;padding:24px;color:var(--muted)">
            {{ at.historyEmpty }}
          </div>
          <div v-else class="history-list">
            <div v-for="(v, i) in noteHistory" :key="i" class="history-item">
              <div class="history-item-header">
                <span class="history-date">{{ new Date(v.savedAt).toLocaleString() }}</span>
                <button class="btn" style="padding:4px 10px;font-size:.78rem" @click="restoreVersion(v)">
                  <i class="ph ph-arrow-counter-clockwise"></i> {{ at.restoreBtn }}
                </button>
              </div>
              <div class="history-title">{{ v.title || '—' }}</div>
              <div class="history-preview">{{ (v.content || '').slice(0, 120) }}{{ v.content?.length > 120 ? '…' : '' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ МОДАЛ: ГАРЯЧІ КЛАВІШІ ═══ -->
      <div v-if="showHotkeys" class="modal-overlay" @click.self="showHotkeys = false">
        <div class="modal-box hotkeys-box">
          <div class="modal-header">
            <h2><i class="ph ph-keyboard"></i> {{ at.hotkeysTitle }}</h2>
            <button class="btn-modal-close" @click="showHotkeys = false"><i class="ph ph-x"></i></button>
          </div>
          <div class="hotkeys-body">
            <div class="hotkeys-section">
              <div class="hotkeys-section-title">{{ at.hkEditor }}</div>
              <div class="hotkey-row"><kbd>Alt</kbd><kbd>S</kbd><span>{{ at.hkSave }}</span></div>
              <div class="hotkey-row"><kbd>Alt</kbd><kbd>N</kbd><span>{{ at.hkNew }}</span></div>
              <div class="hotkey-row"><kbd>Alt</kbd><kbd>P</kbd><span>{{ at.hkPreview }}</span></div>
            </div>
            <div class="hotkeys-section">
              <div class="hotkeys-section-title">{{ at.hkNav }}</div>
              <div class="hotkey-row"><kbd>Alt</kbd><kbd>F</kbd><span>{{ at.hkSearch }}</span></div>
              <div class="hotkey-row"><kbd>Alt</kbd><kbd>R</kbd><span>{{ at.hkRandom }}</span></div>
              <div class="hotkey-row"><kbd>Escape</kbd><span>{{ at.hkClose }}</span></div>
            </div>
            <div class="hotkeys-section">
              <div class="hotkeys-section-title">{{ at.hkTags }}</div>
              <div class="hotkey-row"><kbd>Enter</kbd><span>{{ at.hkAddTag }}</span></div>
              <div class="hotkey-row"><kbd>,</kbd><span>{{ at.hkAddTagAlt }}</span></div>
              <div class="hotkey-row"><kbd>Backspace</kbd><span>{{ at.hkRemoveTag }}</span></div>
            </div>
            <div class="hotkeys-tip">
              <i class="ph ph-info"></i> {{ at.hkTip }}
            </div>
          </div>
        </div>
      </div>

    </template>
  `,

}).mount('#app');
