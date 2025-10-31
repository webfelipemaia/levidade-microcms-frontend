<template>
   <main>
      <section class="py-5 py-lg-8">
         <div class="container">
            <div class="row">
               <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
                  <div class="text-center">
                     <NavbarBrand linkClasses="justify-content-center" :imgStyle="{ height: '90px' }"></NavbarBrand>
                     <h1 class="mb-1">Welcome Back</h1>
                     <p class="mb-0">
                        Don't have an account yet?
                        <a href="/register" class="text-primary">Register here</a>
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
                        <form @submit.prevent="handleLogin" class="needs-validation mb-6" novalidate="">

                           <app-alert 
                             v-if="authStore.error && showAlert" 
                             :type="'danger'" 
                             :class="{ 'rate-limited': isRateLimited }"
                             @close="showAlert = false">
                             {{ authStore.error.message || authStore.error }}
                             <span v-if="remainingTime > 0">
                               <br>Tente novamente em {{ formatTime(remainingTime) }}
                             </span>
                           </app-alert>                         
                           
                           <div class="mb-3">
                              <label for="signinEmailInput" class="form-label">
                                 Email
                                 <span class="text-danger">*</span>
                              </label>
                              <input 
                                type="email" 
                                v-model="form.email" 
                                class="form-control" 
                                id="signinEmailInput"
                                required
                                :disabled="isLockedOut">
                           </div>
                           
                           <div class="mb-3">
                              <label for="formSignUpPassword" class="form-label">Password</label>
                              <div class="password-field position-relative">
                                 <input 
                                   type="password" 
                                   v-model="form.password" 
                                   class="form-control fakePassword"
                                   id="formSignUpPassword" 
                                   required
                                   :disabled="isLockedOut">
                                 <span><i class="bi bi-eye-slash passwordToggler"></i></span>
                              </div>
                           </div>

                           <div class="mb-4 d-flex align-items-center justify-content-between">
                              <div class="form-check">
                                 <input 
                                   class="form-check-input" 
                                   type="checkbox" 
                                   id="rememberMeCheckbox"
                                   :disabled="isLockedOut">
                                 <label class="form-check-label" for="rememberMeCheckbox">Remember me</label>
                              </div>

                              <div><a href="/password/recover" class="text-primary">Forgot Password</a></div>
                           </div>

                           <div class="d-grid">
                              <button 
                                class="btn btn-primary" 
                                type="submit"
                                >
                                <span v-if="authStore.isLoading">Signing In...</span>
                                <span v-else-if="isLockedOut">
                                  Wait {{ formatTime(remainingTime) }}
                                </span>
                                <span v-else>Sign In</span>
                              </button>
                           </div>

                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   </main>
</template>

<script setup>
import { onUnmounted, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppAlert from '@/components/layout/ui/AppAlert.vue';
import NavbarBrand from '@/components/layout/ui/nav/NavbarBrand.vue'

const authStore = useAuthStore()
const route = useRoute()
const showAlert = ref(true)

// rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 1 * 60 * 1000; // 5 minutos

const form = ref({
   email: '',
   password: ''
})

const loginAttempts = ref(0);
const lockoutEndTime = ref(0);
const remainingTime = ref(0);
let countdownInterval = null;

onMounted(() => {
  loadFromStorage();
  checkLockoutStatus();
});

const isLockedOut = computed(() => {
  return remainingTime.value > 0;
});

const isRateLimited = computed(() => {
  return route.query.rateLimited === 'true' ||
         authStore.error?.message?.includes('Muitas tentativas') ||
         isLockedOut.value;
});

const loadFromStorage = () => {
  const attempts = localStorage.getItem('loginAttempts');
  const lockoutEnd = localStorage.getItem('lockoutEndTime');
  
  if (attempts) loginAttempts.value = parseInt(attempts);
  if (lockoutEnd) lockoutEndTime.value = parseInt(lockoutEnd);
};

const saveToStorage = () => {
  localStorage.setItem('loginAttempts', loginAttempts.value.toString());
  localStorage.setItem('lockoutEndTime', lockoutEndTime.value.toString());
};

const checkLockoutStatus = () => {
  const now = Date.now();
  
  if (lockoutEndTime.value > now) {
    startCountdown(lockoutEndTime.value - now);
  } else if (lockoutEndTime.value > 0) {
    resetLoginAttempts();
  }
};

const isCredentialsError = () => {
  if (!authStore.error) return false;
  
  const errorMessage = authStore.error.message || '';
  return errorMessage.includes('Credenciais') || 
         errorMessage.includes('Falha no login') ||
         errorMessage.includes('Verifique suas credenciais');
};

const handleFailedLogin = () => {
  if (isCredentialsError()) {
    loginAttempts.value++;
    
    if (loginAttempts.value >= MAX_LOGIN_ATTEMPTS) {
      startLockout();
    } else {
      saveToStorage();
    }
  }
};

const startLockout = () => {
  lockoutEndTime.value = Date.now() + LOCKOUT_DURATION;
  startCountdown(LOCKOUT_DURATION);
  saveToStorage();
  authStore.handleRateLimitError();
};

const startCountdown = (duration) => {
  remainingTime.value = duration;
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    remainingTime.value -= 1000;
    
    if (remainingTime.value <= 0) {
      clearInterval(countdownInterval);
      resetLoginAttempts();
    }
  }, 1000);
};

const resetLoginAttempts = () => {
  loginAttempts.value = 0;
  lockoutEndTime.value = 0;
  remainingTime.value = 0;
  
  localStorage.removeItem('loginAttempts');
  localStorage.removeItem('lockoutEndTime');
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
};

const formatTime = (milliseconds) => {
  const seconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

async function handleLogin() {
  if (isLockedOut.value) {
    return;
  }
  
  try {
    await authStore.login(form.value.email, form.value.password);    
    resetLoginAttempts();
    
  } catch (error) {
    console.error('Login error:', error);
    setTimeout(() => {
      handleFailedLogin();
    }, 100);
  }
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>