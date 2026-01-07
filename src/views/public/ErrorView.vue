<template>
    <div class="error-container d-flex align-items-center justify-content-center text-center">
        <div class="error-content p-5 shadow-lg border-0">
            <div class="mb-2">
                <i :class="['bi', errorConfig.icon, errorConfig.colorClass]" style="font-size: 6rem;"></i>
            </div>
            <h1 class="display-2 fw-bold">{{ errorCode }}</h1>
            <h2 class="mb-3 fw-bold">{{ errorConfig.title }}</h2>
            <p class="text-muted mb-4" v-html="errorConfig.message"></p>
            
            <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button @click="$router.push('/home')" class="btn btn-primary px-4 gap-3">
                    Voltar para Home
                </button>
                <button @click="$router.back()" class="btn btn-outline-secondary px-4">
                    Página Anterior
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const errorCode = computed(() => route.params.code || route.meta.defaultCode || '404');

const errorConfig = computed(() => {
    const configs = {
        '404': {
            title: 'Não Encontrado',
            message: 'Não foi possível encontrar esta página.<br>Se você acredita que isso é um erro, entre em contato com o administrador.',
            icon: 'bi-signpost-2',
            colorClass: 'text-primary'
        },
        '403': {
            title: 'Acesso Proibido',
            message: 'Você não possui as permissões necessárias para acessar esta página.<br>Se você acredita que isso é um erro, entre em contato com o administrador.',
            icon: 'bi-shield-lock',
            colorClass: 'text-danger'
        },
        '401': {
            title: 'Acesso Negado',
            message: 'Suas credenciais são inválidas para este tipo de acesso ou sua sessão expirou.',
            icon: 'bi-person-x',
            colorClass: 'text-danger'
        },
        '500': {
            title: 'Erro Interno',
            message: 'O servidor encontrou um problema inesperado e não pôde completar a solicitação.',
            icon: 'bi-exclamation-triangle',
            colorClass: 'text-secondary'
        }
    };
    return configs[errorCode.value] || configs['404'];
});
</script>

<style lang="scss" scoped>
.error-container {
    min-height: 80vh;
    .error-content {
        max-width: 600px;
        border-radius: 15px;
    }
}
</style>