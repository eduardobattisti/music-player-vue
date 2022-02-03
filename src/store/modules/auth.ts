import { auth, usersCollection } from '@/includes/firebase';

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
    async register({ commit }, payload): Promise<void> {
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
    async login({ commit }, payload): Promise<void> {
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
    async signOut({ commit }): Promise<void> {
      await auth.signOut();
      commit('toggleAuth');
    },
  },
};
