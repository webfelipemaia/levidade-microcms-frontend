<template>
    
    <main>
       <section class="py-5 py-lg-8">
          <div class="container">
             <div class="row">
                <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
                   <div class="text-center">
                      <NavbarBrand linkClasses="justify-content-center" imgStyle="height: 90px;"></NavbarBrand>
                      <h1 class="mb-1">Welcome Back</h1>
                      <p class="mb-0">
                         Don’t have an account yet?
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
                            <form @submit.prevent="login" class="needs-validation mb-6" novalidate="">
                               <div class="mb-3">
                                  <label for="signinEmailInput" class="form-label">
                                        Email
                                        <span class="text-danger">*</span>
                                  </label>
                                  <input type="email" v-model="form.email" class="form-control" id="signinEmailInput" required="">
                               </div>
                               <div class="mb-3">
                                  <label for="formSignUpPassword" class="form-label">Password</label>
                                  <div class="password-field position-relative">
                                        <input type="password" v-model="form.password" class="form-control fakePassword" id="formSignUpPassword" required="">
                                        <span><i class="bi bi-eye-slash passwordToggler"></i></span>
                                     </div>
                                  </div>
 
                               <div class="mb-4 d-flex align-items-center justify-content-between">
                                  <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="rememberMeCheckbox">
                                        <label class="form-check-label" for="rememberMeCheckbox">Remember me</label>
                                  </div>
 
                                  <div><a href="/" class="text-primary">Forgot Password</a></div>
                               </div>
 
                               <div class="d-grid">
                                  <button class="btn btn-primary" type="submit">Sign In</button>
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
    import { ref } from 'vue'
    import axios from 'axios'
    import { useAuthStore } from '../stores/authStore';
    
    const authStore = useAuthStore()
 
    axios.defaults.withCredentials = true
 
    const form = ref({
       email: null,
       password: null
    })
  
    async function login() {        
         authStore.login(form.value.email, 
                         form.value.password
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