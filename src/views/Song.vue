<template>
  <!-- eslint-disable max-len -->
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="
            newSong(song);
            toggleAudio;
          "
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"> </i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{ $tc('song.comment_count', song.commentCount, {
                count: song.commentCount
              }) }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="commentShowAlert"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import { songsCollection, commentsCollection, auth } from '@/includes/firebase';

export default defineComponent({
  name: 'Song',
  data() {
    return {
      song: {} as any,
      schema: {
        comment: 'required|min:3',
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Please wait! Your comment is being submitted',
      comments: [] as Array<unknown>,
      sort: '1',
    };
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id as string).get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    const { sort } = this.$route.query;

    this.sort = sort === '1' || sort === '2' ? sort : '1';

    this.song = docSnapshot.data();
    await this.getComments();
  },
  methods: {
    ...mapActions(['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = 'bg-blue-500';
      this.commentAlertMessage = 'Please wait! Your comment is being submitted';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
      };

      await commentsCollection.add(comment);

      this.song.commentCount += 1;
      await songsCollection.doc(this.$route.params.id as string).update({
        commentCount: this.song.commentCount,
      });

      await this.getComments();

      this.commentInSubmission = false;
      this.commentAlertVariant = 'bg-green-500';
      this.commentAlertMessage = 'Comment added!';

      resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get();

      this.comments = [];

      snapshots.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data(),
        });
      });
    },
  },
  computed: {
    ...mapState({
      userLoggedIn: (state: any) => state.auth.userLoggedIn,
    }),
    ...mapGetters(['playing']),
    sortedComments() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
        }

        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
});
</script>
