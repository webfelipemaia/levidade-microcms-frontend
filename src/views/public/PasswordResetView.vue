<template>
  <main>
    <section class="py-5 py-lg-8">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
            <div class="text-center">
              <NavbarBrand linkClasses="justify-content-center" imgStyle="height: 90px;"></NavbarBrand>
              <h1 class="mb-1">Redefinir Senha</h1>
              <p class="mb-0">Digite o código recebido por email</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-5 col-lg-6 col-md-8 col-12">
            <div class="card shadow-sm mb-6">
              <div class="card-body">
                <!-- Etapa 1: Inserir código -->
                <div v-if="step === 1">
                  <form @submit.prevent="verifyCode" class="needs-validation mb-6">
                    <app-alert v-if="error" :type="(error === 'Código reenviado com sucesso!') ? 'success': 'danger'" @close="error = ''">
                      {{ error }}
                    </app-alert>

                    <div class="mb-3">
                      <label class="form-label">
                        Email de recuperação
                      </label>
                      <div class="alert alert-info">
                        <strong>{{ email }}</strong>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-outline-secondary ms-2"
                          @click="changeEmail">
                          Alterar
                        </button>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label for="recoveryCode" class="form-label">
                        Código de 6 dígitos
                        <span class="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        v-model="recoveryCode" 
                        class="form-control text-center" 
                        id="recoveryCode"
                        placeholder="000000"
                        maxlength="6"
                        pattern="[0-9]{6}"
                        required
                        :disabled="isLoading">
                      <div class="form-text">
                        Digite o código de 6 dígitos enviado para seu email
                      </div>
                    </div>

                    <div class="d-grid">
                      <button 
                        class="btn btn-primary" 
                        type="submit"
                        :disabled="isLoading || recoveryCode.length !== 6">
                        <span v-if="isLoading">
                          <span class="spinner-border spinner-border-sm me-2"></span>
                          Verificando...
                        </span>
                        <span v-else>Verificar Código</span>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Etapa 2: Nova senha -->
                <div v-if="step === 2">
                  <form @submit.prevent="resetPassword" class="needs-validation mb-6">
                    <app-alert v-if="error" type="danger" @close="error = ''">
                      {{ error }}
                    </app-alert>

                    <div class="mb-3">
                      <label class="form-label">
                        Redefinindo senha para: <strong>{{ email }}</strong>
                      </label>
                    </div>

                    <div class="mb-3">
                      <label for="newPassword" class="form-label">
                        Nova Senha
                        <span class="text-danger">*</span>
                      </label>
                      <input 
                        type="password" 
                        v-model="newPassword" 
                        class="form-control" 
                        id="newPassword"
                        placeholder="Digite sua nova senha"
                        required
                        minlength="6"
                        :disabled="isLoading">
                    </div>

                    <div class="mb-4">
                      <label for="confirmPassword" class="form-label">
                        Confirmar Nova Senha
                        <span class="text-danger">*</span>
                      </label>
                      <input 
                        type="password" 
                        v-model="confirmPassword" 
                        class="form-control" 
                        id="confirmPassword"
                        placeholder="Confirme sua nova senha"
                        required
                        :disabled="isLoading">
                    </div>

                    <div class="d-grid">
                      <button 
                        class="btn btn-primary" 
                        type="submit"
                        :disabled="isLoading || !passwordsMatch">
                        <span v-if="isLoading">NavbarBrand
                          <span class="spinner-border spinner-border-sm me-2"></span>
                          Redefinindo...
                        </span>
                        <span v-else>Redefinir Senha</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div class="text-center mt-3">
                  <p class="mb-0">
                    Não recebeu o código?
                    <a href="#" @click="resendCode" class="text-primary">Reenviar código</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import AppAlert from '@/components/layout/ui/AppAlert.vue'
import NavbarBrand from '@/components/layout/ui/nav/NavbarBrand.vue'

const route = useRoute()
const router = useRouter()

const email = ref('')
const recoveryCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetToken = ref('')
const step = ref(1)
const isLoading = ref(false)
const error = ref('')

// Carregar email da query string ou sessionStorage
onMounted(() => {
  const routeEmail = route.query.email
  const storedEmail = sessionStorage.getItem('recoveryEmail')
  
  if (routeEmail) {
    email.value = routeEmail
    sessionStorage.setItem('recoveryEmail', routeEmail)
  } else if (storedEmail) {
    email.value = storedEmail
  } else {
    // Se não tem email, voltar para recuperação
    router.push('/password/recover')
  }
})

const passwordsMatch = computed(() => {
  return newPassword.value === confirmPassword.value && newPassword.value.length >= 6
})

const verifyCode = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await api.post('/api/v1/public/auth/verify-recovery-code', {
      email: email.value,
      code: recoveryCode.value
    })

    resetToken.value = response.data.resetToken
    step.value = 2

  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao verificar código'
  } finally {
    isLoading.value = false
  }
}

const resetPassword = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await api.post('/api/v1/public/auth/reset-password-with-code', {
      email: email.value,
      resetToken: resetToken.value,
      newPassword: newPassword.value
    })

    // Limpar storage e redirecionar
    sessionStorage.removeItem('recoveryEmail')
    router.push('/login?message=password_reset_success')

  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao redefinir senha'
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await api.post('api/v1/public/auth/forgot-password', {
      email: email.value
    })
    
    error.value = 'Código reenviado com sucesso!'
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao reenviar código'
  } finally {
    isLoading.value = false
  }
}

const changeEmail = () => {
  sessionStorage.removeItem('recoveryEmail')
  router.push('/password/recover')
}
</script>

<style scoped>
.alert-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>