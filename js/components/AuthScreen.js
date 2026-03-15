/* ====== ЕКРАН АВТОРИЗАЦІЇ ====== */
import { auth, googleProvider } from '../firebase-config.js';

const AUTH_I18N = {
  en: {
    login: 'Sign In', register: 'Sign Up',
    googleLogin: 'Continue with Google', googleRegister: 'Continue with Google',
    or: 'or',
    emailPh: 'Email', passwordPh: 'Password',
    namePh: 'Name / nickname', passwordMinPh: 'Password (min. 6 chars)', confirmPh: 'Confirm password',
    signingIn: 'Signing in…', signIn: 'Sign In',
    creating: 'Creating…', createAccount: 'Create account',
    noAccount: 'Create account', haveAccount: 'Already have an account',
    errors: {
      'auth/user-not-found':         'User not found.',
      'auth/wrong-password':         'Wrong password.',
      'auth/invalid-credential':     'Invalid email or password.',
      'auth/invalid-email':          'Invalid email format.',
      'auth/email-already-in-use':   'Email already in use.',
      'auth/weak-password':          'Password is too weak.',
      'auth/too-many-requests':      'Too many attempts. Try later.',
      'auth/network-request-failed': 'Network error.',
      'auth/popup-blocked':          'Popup blocked by browser.',
      'passwords-mismatch':          'Passwords do not match.',
      'name-required':               'Please enter your name.',
    },
  },
  uk: {
    login: 'Вхід', register: 'Реєстрація',
    googleLogin: 'Увійти через Google', googleRegister: 'Продовжити через Google',
    or: 'або',
    emailPh: 'Email', passwordPh: 'Пароль',
    namePh: "Ім'я / нікнейм", passwordMinPh: 'Пароль (мін. 6 символів)', confirmPh: 'Повторіть пароль',
    signingIn: 'Вхід…', signIn: 'Увійти',
    creating: 'Створення…', createAccount: 'Створити акаунт',
    noAccount: 'Створити акаунт', haveAccount: 'Вже є акаунт',
    errors: {
      'auth/user-not-found':         'Користувача не знайдено.',
      'auth/wrong-password':         'Невірний пароль.',
      'auth/invalid-credential':     'Невірний email або пароль.',
      'auth/invalid-email':          'Невірний формат email.',
      'auth/email-already-in-use':   'Цей email вже зареєстровано.',
      'auth/weak-password':          'Пароль занадто простий.',
      'auth/too-many-requests':      'Забагато спроб. Спробуйте пізніше.',
      'auth/network-request-failed': 'Помилка мережі.',
      'auth/popup-blocked':          'Спливаюче вікно заблоковане.',
      'passwords-mismatch':          'Паролі не збігаються.',
      'name-required':               'Введіть імʼя.',
    },
  },
  ru: {
    login: 'Вход', register: 'Регистрация',
    googleLogin: 'Войти через Google', googleRegister: 'Продолжить через Google',
    or: 'или',
    emailPh: 'Email', passwordPh: 'Пароль',
    namePh: 'Имя / никнейм', passwordMinPh: 'Пароль (мин. 6 символов)', confirmPh: 'Повторите пароль',
    signingIn: 'Вход…', signIn: 'Войти',
    creating: 'Создание…', createAccount: 'Создать аккаунт',
    noAccount: 'Создать аккаунт', haveAccount: 'Уже есть аккаунт',
    errors: {
      'auth/user-not-found':         'Пользователь не найден.',
      'auth/wrong-password':         'Неверный пароль.',
      'auth/invalid-credential':     'Неверный email или пароль.',
      'auth/invalid-email':          'Неверный формат email.',
      'auth/email-already-in-use':   'Email уже зарегистрирован.',
      'auth/weak-password':          'Пароль слишком простой.',
      'auth/too-many-requests':      'Слишком много попыток.',
      'auth/network-request-failed': 'Ошибка сети.',
      'auth/popup-blocked':          'Всплывающее окно заблокировано.',
      'passwords-mismatch':          'Пароли не совпадают.',
      'name-required':               'Введите имя.',
    },
  },
  de: {
    login: 'Anmelden', register: 'Registrieren',
    googleLogin: 'Mit Google anmelden', googleRegister: 'Mit Google fortfahren',
    or: 'oder', emailPh: 'E-Mail', passwordPh: 'Passwort',
    namePh: 'Name / Nickname', passwordMinPh: 'Passwort (min. 6 Zeichen)', confirmPh: 'Passwort bestätigen',
    signingIn: 'Anmelden…', signIn: 'Anmelden',
    creating: 'Erstellen…', createAccount: 'Konto erstellen',
    noAccount: 'Konto erstellen', haveAccount: 'Bereits registriert',
    errors: { 'auth/user-not-found':'Benutzer nicht gefunden.', 'auth/wrong-password':'Falsches Passwort.', 'auth/invalid-credential':'Ungültige E-Mail oder Passwort.', 'auth/invalid-email':'Ungültiges E-Mail-Format.', 'auth/email-already-in-use':'E-Mail bereits registriert.', 'auth/weak-password':'Passwort zu schwach.', 'auth/too-many-requests':'Zu viele Versuche.', 'auth/network-request-failed':'Netzwerkfehler.', 'auth/popup-blocked':'Popup blockiert.', 'passwords-mismatch':'Passwörter stimmen nicht überein.', 'name-required':'Bitte Namen eingeben.' },
  },
  fr: {
    login: 'Connexion', register: 'Inscription',
    googleLogin: 'Se connecter avec Google', googleRegister: 'Continuer avec Google',
    or: 'ou', emailPh: 'E-mail', passwordPh: 'Mot de passe',
    namePh: 'Nom / pseudo', passwordMinPh: 'Mot de passe (min. 6 caractères)', confirmPh: 'Confirmer le mot de passe',
    signingIn: 'Connexion…', signIn: 'Se connecter',
    creating: 'Création…', createAccount: 'Créer un compte',
    noAccount: 'Créer un compte', haveAccount: 'Déjà un compte',
    errors: { 'auth/user-not-found':'Utilisateur introuvable.', 'auth/wrong-password':'Mot de passe incorrect.', 'auth/invalid-credential':'E-mail ou mot de passe invalide.', 'auth/invalid-email':'Format e-mail invalide.', 'auth/email-already-in-use':'E-mail déjà utilisé.', 'auth/weak-password':'Mot de passe trop faible.', 'auth/too-many-requests':'Trop de tentatives.', 'auth/network-request-failed':'Erreur réseau.', 'auth/popup-blocked':'Popup bloquée.', 'passwords-mismatch':'Les mots de passe ne correspondent pas.', 'name-required':'Veuillez entrer votre nom.' },
  },
  pl: {
    login: 'Logowanie', register: 'Rejestracja',
    googleLogin: 'Zaloguj przez Google', googleRegister: 'Kontynuuj przez Google',
    or: 'lub', emailPh: 'Email', passwordPh: 'Hasło',
    namePh: 'Imię / nick', passwordMinPh: 'Hasło (min. 6 znaków)', confirmPh: 'Potwierdź hasło',
    signingIn: 'Logowanie…', signIn: 'Zaloguj',
    creating: 'Tworzenie…', createAccount: 'Utwórz konto',
    noAccount: 'Utwórz konto', haveAccount: 'Mam już konto',
    errors: { 'auth/user-not-found':'Użytkownik nie znaleziony.', 'auth/wrong-password':'Błędne hasło.', 'auth/invalid-credential':'Błędny email lub hasło.', 'auth/invalid-email':'Nieprawidłowy format email.', 'auth/email-already-in-use':'Email już zajęty.', 'auth/weak-password':'Hasło za słabe.', 'auth/too-many-requests':'Za dużo prób.', 'auth/network-request-failed':'Błąd sieci.', 'auth/popup-blocked':'Popup zablokowany.', 'passwords-mismatch':'Hasła nie są zgodne.', 'name-required':'Wprowadź imię.' },
  },
  es: {
    login: 'Iniciar sesión', register: 'Registrarse',
    googleLogin: 'Entrar con Google', googleRegister: 'Continuar con Google',
    or: 'o', emailPh: 'Correo electrónico', passwordPh: 'Contraseña',
    namePh: 'Nombre / apodo', passwordMinPh: 'Contraseña (mín. 6 caracteres)', confirmPh: 'Confirmar contraseña',
    signingIn: 'Entrando…', signIn: 'Entrar',
    creating: 'Creando…', createAccount: 'Crear cuenta',
    noAccount: 'Crear cuenta', haveAccount: 'Ya tengo cuenta',
    errors: { 'auth/user-not-found':'Usuario no encontrado.', 'auth/wrong-password':'Contraseña incorrecta.', 'auth/invalid-credential':'Correo o contraseña inválidos.', 'auth/invalid-email':'Formato de correo inválido.', 'auth/email-already-in-use':'Correo ya registrado.', 'auth/weak-password':'Contraseña muy débil.', 'auth/too-many-requests':'Demasiados intentos.', 'auth/network-request-failed':'Error de red.', 'auth/popup-blocked':'Ventana emergente bloqueada.', 'passwords-mismatch':'Las contraseñas no coinciden.', 'name-required':'Por favor ingresa tu nombre.' },
  },
  zh: {
    login: '登录', register: '注册',
    googleLogin: '使用 Google 登录', googleRegister: '使用 Google 继续',
    or: '或', emailPh: '电子邮件', passwordPh: '密码',
    namePh: '姓名 / 昵称', passwordMinPh: '密码（最少6位）', confirmPh: '确认密码',
    signingIn: '登录中…', signIn: '登录',
    creating: '创建中…', createAccount: '创建账户',
    noAccount: '创建账户', haveAccount: '已有账户',
    errors: { 'auth/user-not-found':'用户未找到。', 'auth/wrong-password':'密码错误。', 'auth/invalid-credential':'邮箱或密码无效。', 'auth/invalid-email':'邮箱格式无效。', 'auth/email-already-in-use':'邮箱已被注册。', 'auth/weak-password':'密码太弱。', 'auth/too-many-requests':'尝试次数过多。', 'auth/network-request-failed':'网络错误。', 'auth/popup-blocked':'弹窗被拦截。', 'passwords-mismatch':'密码不匹配。', 'name-required':'请输入姓名。' },
  },
};

export default {
  name: 'AuthScreen',
  data() {
    return {
      mode: 'login',
      loginEmail: '', loginPassword: '', loginLoading: false, loginError: '',
      regName: '', regEmail: '', regPassword: '', regConfirm: '', regLoading: false, regError: '',
      lang: localStorage.getItem('lang') || 'en',
    };
  },
  computed: {
    t() { return AUTH_I18N[this.lang] || AUTH_I18N.en; },
  },
  methods: {
    switchMode(m) { this.mode = m; this.loginError = ''; this.regError = ''; },
    errMsg(code) { return this.t.errors[code] || code; },

    async handleLogin() {
      this.loginLoading = true; this.loginError = '';
      try {
        await auth.signInWithEmailAndPassword(this.loginEmail, this.loginPassword);
      } catch(err) { this.loginError = this.errMsg(err.code); }
      this.loginLoading = false;
    },

    async handleRegister() {
      this.regError = '';
      if (!this.regName.trim()) { this.regError = this.errMsg('name-required'); return; }
      if (this.regPassword !== this.regConfirm) { this.regError = this.errMsg('passwords-mismatch'); return; }
      this.regLoading = true;
      try {
        const cred = await auth.createUserWithEmailAndPassword(this.regEmail, this.regPassword);
        await cred.user.updateProfile({ displayName: this.regName.trim() });
      } catch(err) { this.regError = this.errMsg(err.code); }
      this.regLoading = false;
    },

    async handleGoogle() {
      try {
        await auth.signInWithPopup(googleProvider);
      } catch(err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          this.loginError = this.errMsg(err.code);
        }
      }
    },
  },

  template: `
    <div class="auth-overlay">
      <div class="auth-box">

        <template v-if="mode === 'login'">
          <h2>{{ t.login }}</h2>
          <button class="btn btn-google" @click="handleGoogle">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G">
            {{ t.googleLogin }}
          </button>
          <div class="auth-divider"><span>{{ t.or }}</span></div>
          <input v-model="loginEmail" type="email" :placeholder="t.emailPh" @keyup.enter="handleLogin">
          <input v-model="loginPassword" type="password" :placeholder="t.passwordPh" @keyup.enter="handleLogin">
          <p v-if="loginError" class="auth-error">{{ loginError }}</p>
          <button class="btn save" :disabled="loginLoading" @click="handleLogin">
            {{ loginLoading ? t.signingIn : t.signIn }}
          </button>
          <button class="btn btn-ghost" @click="switchMode('register')">{{ t.noAccount }}</button>
        </template>

        <template v-else>
          <h2>{{ t.register }}</h2>
          <button class="btn btn-google" @click="handleGoogle">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G">
            {{ t.googleRegister }}
          </button>
          <div class="auth-divider"><span>{{ t.or }}</span></div>
          <input v-model="regName"     type="text"     :placeholder="t.namePh">
          <input v-model="regEmail"    type="email"    :placeholder="t.emailPh">
          <input v-model="regPassword" type="password" :placeholder="t.passwordMinPh">
          <input v-model="regConfirm"  type="password" :placeholder="t.confirmPh" @keyup.enter="handleRegister">
          <p v-if="regError" class="auth-error">{{ regError }}</p>
          <button class="btn save" :disabled="regLoading" @click="handleRegister">
            {{ regLoading ? t.creating : t.createAccount }}
          </button>
          <button class="btn btn-ghost" @click="switchMode('login')">{{ t.haveAccount }}</button>
        </template>

      </div>
    </div>
  `,
};
