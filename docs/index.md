# Hello VitePress + Vue 3 🚀

Este é o meu ambiente de documentação técnica.

- **Status:** Em construção
- **Tech:** Vue.js, TypeScript e VitePress.

<button @click="count++" style="padding: 10px; background: #42b883; border-radius: 8px; color: white;">
  Contador Simples: {{ count }}
</button>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>