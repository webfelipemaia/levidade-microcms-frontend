<script setup>

import { useAuthStore } from '../stores/authStore';


function onSubmit(values, { setErrors }) {
    const authStore = useAuthStore();
    const { username, password } = values;

    return authStore.login(username, password)
        .catch(error => setErrors({ apiError: error }));
}
</script>

<template>
    <div>
        <h2>Login</h2>
        <form @submit="onSubmit">
            <div class="form-group">
                <label>Username</label>
                <input name="username" type="text" class="form-control"  />
                <div class="invalid-feedback"></div>
            </div>            
            <div class="form-group">
                <label>Password</label>
                <input name="password" type="password" class="form-control"  />
                <div class="invalid-feedback"></div>
            </div>            
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Login
                </button>
            </div>
        </form>
    </div>
</template>