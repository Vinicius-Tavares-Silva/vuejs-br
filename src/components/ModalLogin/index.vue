<template>
  <div class="flex justify-between">
    <h1 class="text-4xl font-black text-gray-800">Entre na sua conta</h1>
    <button
      class="text-4xl text-gray-600 focus:outline-none"
      @click="close"
    >
      &times;
    </button>
  </div>

  <div class="mt-16">
    <form @submit.prevent="handleSubmit">

      <label class="block">
        <span class="text-lg font-medium text-gray-800">E-mail</span>
        <input
          class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
          :class="{
            'border-brand-danger': !!state.email.errorMessage
          }"
          type="email"
          placeholder="Digite seu e-mail"
          v-model="state.email.value"
        >
        <span
          v-if="!!state.email.errorMessage"
          class="block font-medium text-brand-danger"
        >
          {{ state.email.errorMessage }}
        </span>
      </label>
      <label class="block mt-9">
        <span class="text-lg font-medium text-gray-800">Senha</span>
        <input
          class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
          :class="{
            'border-brand-danger': !!state.password.errorMessage
          }"
          type="password"
          placeholder="Digite sua senha"
          v-model="state.password.value"
        >
        <span
          v-if="!!state.password.errorMessage"
          class="block font-medium text-brand-danger"
        >
          {{ state.password.errorMessage }}
        </span>
      </label>
      <button
        class="px-8 py-3 mt-10 text-2xl font-bold text-white rounded-full bg-brand-main focus:outline-none transition-all duaration-150"
        type="submit"
        :disabled="state.isLoading"
        :class="{
          'opacity-50': state.isLoading,
        }"
      >
        <icon v-if="state.isLoading" name="loading" class="animate animate-spin" />
        <span v-else>Entrar</span>
      </button>

    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useField } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useModal from '@/hooks/useModal'
import Icon from '@/components/Icon'
import { validateEmptyAndLength3, validateEmptyAndEmail } from '@/utils/validators'
import services from '@/services'

export default {
  components: {
    Icon,
  },
  setup() {
    const modal = useModal()
    const router = useRouter()
    const toast = useToast()

    const {
      value: emailValue,
      errorMessage: emailErrorMessage
    } = useField('email', validateEmptyAndEmail)
    const {
      value: passordValue,
      errorMessage: passordErrorMessage
    } = useField('password', validateEmptyAndLength3)

    const state = reactive({
      hasErrors: false,
      isLoading: false,
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage,
      },
      password: {
        value: passordValue,
        errorMessage: passordErrorMessage,
      },
    })

    async function handleSubmit() {
      try {
        toast.clear()
        state.isLoading = true
        const { data, errors } = await services.auth.login({
          email: state.email.value,
          password: state.password.value,
        })

        if (!errors) {
          localStorage.setItem('token', data.token)
          router.push({ name: 'Feedbacks' })
          state.isLoading = false
          modal.close()
          return
        }

        if (errors.status === 404) {
          toast.error('E-mail não encontrado')
        }
        if (errors.status === 401) {
          toast.error('E-mail ou senha inválidos')
        }
        if (errors.status === 400) {
          toast.error('Ocorreu um erro ao fazer login')
        }

        state.isLoading = false
      } catch (error) {
        state.isLoading = false
        state.hasErrors = !!error
        toast.error('Ocorreu um erro ao fazer login')
      }
    }

    return {
      state,
      handleSubmit,
      close: modal.close
    }
  }
}
</script>
