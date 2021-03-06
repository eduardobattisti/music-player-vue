import { auth, usersCollection } from '@/includes/firebase';
import { IAuthModule } from '@/models/store/auth';

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state): void {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const {
        email, name, age, password, country,
      } = payload;

      const userCred = await auth.createUserWithEmailAndPassword(email, password);

      await usersCollection.doc(userCred.user?.uid).set({
        name,
        email,
        age,
        country,
      });

      await userCred.user?.updateProfile({
        displayName: name,
      });

      commit('toggleAuth');
    },
    async login({ commit }, payload) {
      const { email, password } = payload;
      await auth.signInWithEmailAndPassword(email, password);

      commit('toggleAuth');
    },
    initLogin({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async signOut({ commit }) {
      await auth.signOut();
      commit('toggleAuth');
    },
  },
} as IAuthModule;
