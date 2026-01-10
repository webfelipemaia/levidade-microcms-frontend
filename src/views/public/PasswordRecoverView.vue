<template>
  <main>
    <section class="py-5 py-lg-8">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
            <div class="text-center">
              <LNavbarBrand linkClasses="justify-content-center" :imgStyle="{ height: '90px' }"></LNavbarBrand>
              <h1 class="mb-1">Recuperar Senha</h1>
              <p class="mb-0">
                Lembrou sua senha?
                <router-link to="/login" class="text-primary">Faça login aqui</router-link>
              </p>
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
                <form @submit.prevent="handleRecover" class="needs-validation mb-6" novalidate>
                  
                  <l-alert 
                    v-if="successMessage" 
                    type="success" 
                    @close="successMessage = ''">
                    {{ successMessage }}
                  </l-alert>

                  <l-alert 
                    v-if="errorMessage" 
                    type="danger" 
                    @close="errorMessage = ''">
                    {{ errorMessage }}
                  </l-alert>
                  
                  <div class="mb-4">
                    <label for="recoverEmail" class="form-label">
                      Email
                      <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      v-model="email" 
                      class="form-control" 
                      id="recoverEmail"
                      placeholder="Seu email cadastrado"
                      required
                      :disabled="isLoading">
                    <div class="form-text">
                      Enviaremos um código de 6 dígitos para seu email
                    </div>
                  </div>

                  <div class="d-grid">
                    <button 
                      class="btn btn-primary" 
                      type="submit"
                      :disabled="isLoading || !email">
                      <span v-if="isLoading">
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando...
                      </span>
                      <span v-else>Enviar Código de Recuperação</span>
                    </button>
                  </div>
                </form>

                <div class="text-center">
                  <p class="mb-0">
                    Não tem uma conta?
                    <router-link to="/register" class="text-primary">Cadastre-se aqui</router-link>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import LAlert from '@/components/feedback/LAlert.vue'
import LNavbarBrand from '@/components//navigation/LNavbarBrand.vue'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleRecover = async () => {
  if (!email.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await api.post('api/v1/public/auth/forgot-password', {
      email: email.value
    })

    if (response.data.success) {
      successMessage.value = 'Código enviado com sucesso! Verifique seu email.'
      
      setTimeout(() => {
        router.push({
          path: '/password/reset',
          query: { email: email.value }
        })
      }, 2000)
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 
                 'Erro ao enviar código. Verifique o email e tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}
</style>