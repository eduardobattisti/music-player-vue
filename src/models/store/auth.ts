import { Commit, ActionPayload } from 'vuex';

export interface IState {
  authModalShow: boolean;
  userLoggedIn: boolean;
}

export interface IMutations {
  toggleAuthModal(state: IState): void;
  toggleAuth(state: IState): void;
}

interface IRegisterPayload {
  email: string;
  name: string;
  age: string;
  password: string;
  country: string;
}

interface ILoginPayload {
  email: string;
  password: string;
}

export interface IActions {
  register({ commit }: {commit: Commit}, payload: IRegisterPayload): Promise<void>;
  login({ commit }: {commit: Commit}, payload: ILoginPayload): Promise<void>;
  initLogin({ commit }: {commit: Commit}, payload: ActionPayload): Promise<void>;
  initLogin({ commit }: {commit: Commit}): Promise<void>;
  signOut({ commit }: {commit: Commit}): Promise<void>;
}

export interface IAuthModule {
  state: IState;
  mutations: IMutations;
  actions: IActions;
}
