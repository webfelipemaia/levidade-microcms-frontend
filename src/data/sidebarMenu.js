export const sidebarMenu = [
  {
    label: 'Dashboard',
    icon: 'bi bi-house',
    to: '/home'
  },
  {
    label: 'Articles',
    icon: 'bi bi-file-text',
    to: '/admin/articles'
  },
  {
    label: 'Categories',
    icon: 'bi bi-collection',
    to: '/admin/categories'
  },
  {
    label: 'Usuários',
    icon: 'bi bi-people',
    routeNames: [
      'admin.users',
      'admin.roles',
      'admin.permissions',
      'admin.acl',
      'roles.edit',
      'roles.permissions',
      'permission.edit'
    ],
    children: [
      {
        label: 'Users',
        to: '/admin/users'
      },
      {
        label: 'Roles',
        to: '/admin/roles'
      },
      {
        label: 'Permissions',
        to: '/admin/permissions'
      },
      {
        label: 'Controle de Acesso (ACL)',
        to: '/admin/acl',
        role: 'Administrator'
      }
    ]
  },
  {
    label: 'Relatórios',
    icon: 'bi bi-table',
    to: '/relatorios',
    can: 'users:read'
  },
  {
    label: 'Configurações',
    icon: 'bi bi-gear',
    to: '/admin/settings',
    adminOnly: true
  }
]
