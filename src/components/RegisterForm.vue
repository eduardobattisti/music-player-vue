<template>
  <!-- Registration Form -->
  <div
    class="text-white text-center font-bold p-5 mb-4"
    v-if="regShowAlert"
    :class="regAlertVariant"
  >
    {{ regAlertMsg }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage
        class="text-red-600"
        name="name"
      />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage
        class="text-red-600"
        name="age"
      />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        v-slot="{ field, errors }"
      >
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                  transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password"
          v-bind="field"
        />
        <div
          class="text-red-600"
          v-for="error in errors"
          :key="error"
        >{{ error }}</div>
      </vee-field>
      <ErrorMessage
        class="text-red-600"
        name="password"
      />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
        :bails="false"
      />
      <ErrorMessage
        class="text-red-600"
        name="confirm_password"
      />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage
        class="text-red-600"
        name="country"
      />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t
        for="tos"
        class="inline-block"
        keypath="register.accept"
        tag="label"
      >
        <a href="#">
          {{ t('register.TOS') }}
        </a>
      </i18n-t>
      <ErrorMessage
        class="text-red-600 block"
        name="tos"
      />
    </div>
    <button
      type="submit"
      :disabled="regInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded
              transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { IRegisterForm } from '@/models/components/RegisterForm';

export default defineComponent({
  name: 'RegisterForm',
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const tab = ref('login');
    const schema = reactive({
      name: 'required|min:3|max:100|alpha_spaces',
      email: 'required|min:3|max:100|email',
      age: 'required|min_value:18|max_value:100',
      password: 'required|min:3|max:100',
      confirm_password: 'passwords_mismatch:@password',
      country: 'required|country_excluded:Antarctica',
      tos: 'tos|',
    });
    const userData = reactive({
      country: 'USA',
    });
    const regInSubmission = ref(false);
    const regShowAlert = ref(false);
    const regAlertVariant = ref('bg-blue-500');
    const regAlertMsg = ref('Please wait! Your account is being created!');

    const register = async (values: IRegisterForm): Promise<void> => {
      regShowAlert.value = true;
      regInSubmission.value = true;
      regAlertVariant.value = 'bg-blue-500';
      regAlertMsg.value = 'Please wait! Your account is being created!';
      try {
        await store.dispatch('register', values);
      } catch (error) {
        regInSubmission.value = false;
        regAlertVariant.value = 'bg-red-500';
        regAlertMsg.value = 'An unexpected error occurred. Please try again later.';
        return;
      }

      regAlertVariant.value = 'bg-green-500';
      regAlertMsg.value = 'Success! Your account has been created.';
      window.location.reload();
    };

    return {
      t,
      tab,
      schema,
      userData,
      regInSubmission,
      regShowAlert,
      regAlertVariant,
      regAlertMsg,
      register,
    };
  },
});
</script>
