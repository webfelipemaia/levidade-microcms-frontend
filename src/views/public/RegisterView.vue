<template>
  <main>
    <section class="">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="text-center">
              <LNavbarBrand
                linkClasses="justify-content-center"
                :imgStyle="{ height: '90px' }"
              ></LNavbarBrand>
              <h1 class="mb-1">Welcome Back</h1>
              <p class="mb-2">
                Already registered?
                <a href="/login" class="text-primary">Login</a>
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
            <div class="card shadow-sm mb-5">
              <div class="card-body">
                <form @submit.prevent="register"  class="needs-validation mb-5" novalidate="">
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
                      required=""
                    />
                  </div>
                  <div class="mb-3">
                    <label for="formSignUpPassword" class="form-label"
                      >Password</label
                    >
                    <div class="password-field position-relative">
                      <input
                        type="password"
                        v-model="form.password"
                        class="form-control fakePassword"
                        id="formSignUpPassword"
                        required=""
                      />
                      <span
                        ><i class="bi bi-eye-slash passwordToggler"></i
                      ></span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="formSignUpConfirmPassword" class="form-label"
                      >Confirm Password</label
                    >
                    <div class="password-field position-relative">
                      <input
                        type="password"
                        v-model="form.confirmPassword"
                        class="form-control fakePassword"
                        id="formSignUpConfirmPassword"
                        required=""
                      />
                      <span
                        ><i class="bi bi-eye-slash passwordToggler"></i
                      ></span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="signinNameInput" class="form-label">
                      Name
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.name"
                      class="form-control"
                      id="signinNameInput"
                      required=""
                    />
                  </div>
                  <div class="mb-3">
                    <label for="signinLastNameInput" class="form-label">
                      Last Name
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.lastname"
                      class="form-control"
                      id="signinLastNameInput"
                      required=""
                    />
                  </div>
                  <div
                    class="mb-4 d-flex align-items-center justify-content-between"
                  >
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="rememberMeCheckbox"
                      />
                      <label class="form-check-label" for="rememberMeCheckbox"
                        >Remember me</label
                      >
                    </div>

                    <div>
                      <a href="password/recover" class="text-primary">Forgot Password</a>
                    </div>
                  </div>

                  <div class="d-grid">
                    <button class="btn btn-primary" type="submit">
                      Create Account
                    </button>
                  </div>
                </form>

                <div v-if="authStore.error" class="alert alert-danger mt-3" role="alert">
                  {{ authStore.error }}
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
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import LNavbarBrand from "@/components/navigation/LNavbarBrand.vue";

const authStore = useAuthStore();

const form = ref({
  email: null,
  password: null,
  confirmPassword: null,
  name: null,
  lastname: null,
});

async function register() {
  authStore.register(
    form.value.email,
    form.value.password,
    form.value.confirmPassword,
    form.value.name,
    form.value.lastname
  );
}
</script>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.spinner-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border-radius: 8px;
}

.spinner-border {
  display: block;
}

.spinner-text {
  margin: 2rem;
  font-size: 28px;
}
</style>
