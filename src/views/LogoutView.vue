<template>
  <main>
    <section class="py-5 py-lg-8">
      <div class="container">
        <div class="row">
          <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
            <div class="text-center">
              <NavbarBrand
                linkClasses="justify-content-center"
                imgStyle="height: 90px;"
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
        <div class="row">
          <div class="col-md">
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
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

async function logout() {
  authStore.logout();
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
