<template>
  <!-- eslint-disable max-len -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click.prevent="showForm = !showForm">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="showAlert"
          :class="alertVariant"
        >
          {{ alertMessage }}
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="inSubmission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script  lang="ts">
import {
  defineComponent, ref, reactive, toRefs,
} from 'vue';
import { songsCollection, storage } from '@/includes/firebase';

export default defineComponent({
  name: 'CompositionItem',
  setup(props) {
    const showForm = ref(false);
    const schema = reactive({
      modifiedName: 'required',
      genre: 'alpha_spaces',
    });
    const inSubmission = ref(false);
    const showAlert = ref(false);
    const alertVariant = ref('bg-blue-500');
    const alertMessage = ref('Please wait! Updating song info.');

    const { song, index, removeSong } = toRefs(props);

    async function edit(values) {
      inSubmission.value = true;
      showAlert.value = true;
      alertVariant.value = 'bg-blue-500';
      alertMessage.value = 'Please wait! Updating song info.';

      try {
        await songsCollection.doc(song.value.docID).update(values);
      } catch (error) {
        inSubmission.value = false;
        alertVariant.value = 'bg-red-500';
        alertMessage.value = 'Something went wrong! Try again later.';
      }

      props.updateSong(index, values);
      props.updateUnsavedFlag(false);

      inSubmission.value = false;
      alertVariant.value = 'bg-green-500';
      alertMessage.value = 'Success!';
    }

    async function deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${song.value.originalName}`);

      await songRef.delete();
      await songsCollection.doc(song.value.docID).delete();

      removeSong.value(index);
    }

    return {
      showForm,
      schema,
      inSubmission,
      showAlert,
      alertVariant,
      alertMessage,
      edit,
      deleteSong,

    };
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      required: true,
    },
  },
});
</script>
