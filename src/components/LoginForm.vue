<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    :class="loginAlertVariant"
    v-if="loginShowAlert"
  >
    {{ loginAlertMsg }}
  </div>
  <vee-form
    :validation-schema="loginSchema"
    @submit="login"
  >
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage
        class="text-red-600"
        name="password"
      />
    </div>
    <button
      type="submit"
      :disabled="loginInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { ILoginForm } from '@/models/components/LoginForm';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const store = useStore();

    const loginSchema: ILoginForm = reactive({
      email: 'required|email',
      password: 'required|min:3|max:32',
    });

    const loginInSubmission = ref(false);
    const loginShowAlert = ref(false);
    const loginAlertVariant = ref('bg-blue-500');
    const loginAlertMsg = ref('Please wait! We are logging  you in.');

    const login = async (values: ILoginForm): Promise<void> => {
      loginInSubmission.value = true;
      loginShowAlert.value = true;
      loginAlertVariant.value = 'bg-blue-500';
      loginAlertMsg.value = 'Please wait! We are logging  you in.';

      try {
        await store.dispatch('login', values);
      } catch (error) {
        loginInSubmission.value = false;
        loginAlertVariant.value = 'bg-red-500';
        loginAlertMsg.value = 'Invalid login details.';
        return;
      }

      loginAlertVariant.value = 'bg-green-500';
      loginAlertMsg.value = 'Success! You are now logged in.';

      window.location.reload();
    };

    return {
      loginSchema,
      loginInSubmission,
      loginShowAlert,
      loginAlertVariant,
      loginAlertMsg,
      login,
    };
  },
});
</script>
