import { Howl } from 'howler';
import { Commit, Dispatch } from 'vuex';

interface ISong {
  commentCount: number;
  displayName: string;
  genre: string;
  modifiedName: string;
  originalName: string;
  uid: string;
  url: string;
}

interface IState {
  currentSong: ISong | Record<string, never>;
  sound: Howl | Record<string, never>;
  seek: string;
  duration: string;
  playerProgress: string;
}

interface IMutations {
  newSong(state: IState, payload: ISong): void;
  updatePosition(state: IState): void;
}

interface IGetters {
  playing(state: IState): boolean;
}

interface IActions {
  newSong(
    { commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch },
    payload: ISong
  ): void;
  toggleAudio({ state }: {state: IState}): void;
  progress(
    { commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }
  ): void;
  updateSeek({ state, dispatch }: { state: IState, dispatch: Dispatch }, payload: MouseEvent): void;
}

export interface IPlayerModule {
  state: IState;
  mutations: IMutations;
  getters: IGetters;
  actions: IActions;
}
