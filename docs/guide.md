# Layout Shell (App.vue)

O `App.vue` define a estrutura mestre da interface. Ele é um layout do tipo **View-Sidebar-Footer**.

## Estrutura Visual
O layout é dividido em três áreas principais:
1. **Header (AppNavigation):** Fixado no topo.
2. **Body (Flex Wrapper):** Contém a `AppSidebar` à esquerda e o conteúdo principal à direita.
3. **Footer (AppFooter):** Fixado ao final do conteúdo.

## Classes de Layout
Utilizamos utilitários do Bootstrap para garantir a fluidez:
- `.d-flex`: No wrapper principal para alinhar Sidebar e Conteúdo.
- `.align-items-stretch`: Garante que a Sidebar ocupe toda a altura disponível.
- `.maincontent`: Classe customizada para gerenciar o espaçamento interno do dashboard.