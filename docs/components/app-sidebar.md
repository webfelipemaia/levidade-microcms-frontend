# AppSidebar

Menu lateral responsivo construído com o padrão **Offcanvas** do Bootstrap.

## 🎨 Estilização Customizada
Este componente estende o Bootstrap com algumas especificidades. Por exemplo, recebe uma borda esquerda de `3px solid #0d6efd` e fundo azul claro. Além disso, itens dentro de `.submenu` possuem recuo à esquerda (`padding-left: 2.5rem`) para hierarquia visual.

### Responsividade
- Em telas **MD (Medium)** ou maiores, ele se comporta como uma barra fixa.
- Em telas menores, utiliza a classe `.offcanvas-start` para aparecer como um menu deslizante.

## 🧩 Slots e Customização
Atualmente, o conteúdo é estático, mas pode ser expandido para aceitar slots de categorias de menu.

<ClientOnly>
  <AppSidebar />
</ClientOnly>

<script setup>
// Importação do componente real usando o alias @
import AppSidebar from '@/components/layout/ui/sidebar/AppSidebar.vue'
</script>
