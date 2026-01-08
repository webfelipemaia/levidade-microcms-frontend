<template>
    <div class="card shadow-sm">
      <div class="card-header bg-light fw-semibold">
        Editar Perfil
      </div>
  
      <div class="card-body">
        <form @submit.prevent="saveProfile" class="row g-3">
  
          <div class="col-md-6">
            <label for="name" class="form-label">Nome</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-control"
              placeholder="Seu nome"
              required
            />
          </div>
  
          <div class="col-md-6">
            <label for="lastname" class="form-label">Sobrenome</label>
            <input
              id="lastname"
              v-model="form.lastname"
              type="text"
              class="form-control"
              placeholder="Seu sobrenome"
              required
            />
          </div>
  
          <div class="col-md-12">
            <label for="email" class="form-label">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Seu e-mail"
              required
            />
          </div>
  
          <div v-if="form.roles?.length" class="col-md-12">
            <label class="form-label">Papéis (roles)</label>
            <ul class="list-group small">
              <li v-for="role in form.roles" :key="role" class="list-group-item">
                {{ role }}
              </li>
            </ul>
          </div>
  
          <!-- Botões -->
          <div class="col-12 d-flex justify-content-end mt-3">
            <button type="button" class="btn btn-secondary me-2" @click="resetForm">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from "vue"
  
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  })
  
  const emit = defineEmits(["update-profile"])
  
  const form = reactive({
    id: props.user.id,
    name: props.user.name,
    lastname: props.user.lastname,
    email: props.user.email,
    roles: props.user.roles || [],
  })
  
  watch(
    () => props.user,
    (newUser) => {
      Object.assign(form, newUser)
    },
    { deep: true }
  )
  
  function saveProfile() {
    emit("update-profile", { ...form })
  }
  
  function resetForm() {
    Object.assign(form, props.user)
  }
  </script>
  