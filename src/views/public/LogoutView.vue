<template>
  <main>
    <div v-if="isLoading" class="overlay">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status"></div>
        <span class="spinner-text">Logging out...</span>
      </div>
    </div>
    <section class="py-5 py-lg-8">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
            <div class="text-center">
              <NavbarBrand
                linkClasses="justify-content-center"
                :imgStyle="{ height: '90px' }"
              ></NavbarBrand>
              <h1 class="mb-1">Do you want to leave?</h1>
              <p class="mb-0">
                Continue browsing.
                <a href="/home" class="text-primary">Home</a>
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
                <div class="d-grid">
                  <button @click="logout" class="btn btn-primary" type="submit">
                    Logout
                  </button>
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
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import NavbarBrand from '@/components/layout/ui/nav/NavbarBrand.vue'

const authStore = useAuthStore();
const isLoading = ref(false);

async function logout() {
  isLoading.value = true;
  try {
    await authStore.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    isLoading.value = false;
  }
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
