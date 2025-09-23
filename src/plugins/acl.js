// src/plugins/acl.js
import { useAclStore } from '@/stores/aclStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  install(app) {
    app.config.globalProperties.$acl = {
      // Verifica se o usuário atual tem uma permissão
      hasPermission(permissionId) {
        const authStore = useAuthStore()
        const aclStore = useAclStore()
        
        // Se tiver um usuário logado, verifica suas permissões
        if (authStore.user && authStore.user.id) {
          return aclStore.hasUserPermission(permissionId)
        }
        
        return false
      },

      // Verifica se uma role específica tem uma permissão
      hasRolePermission(roleId, permissionId) {
        const aclStore = useAclStore()
        return aclStore.hasRolePermission(roleId, permissionId)
      },

      // Verifica se o usuário atual tem uma role específica
      hasRole(roleId) {
        const authStore = useAuthStore()
        return authStore.user?.roleId === roleId
      },

      // Retorna todas as permissões do usuário atual
      getUserPermissions() {
        const authStore = useAuthStore()
        const aclStore = useAclStore()
        
        if (authStore.user && authStore.user.id) {
          return aclStore.userPermissions
        }
        
        return []
      },

      // Retorna as permissões de uma role específica
      getRolePermissions(roleId) {
        const aclStore = useAclStore()
        return aclStore.getRolePermissions(roleId)
      }
    }
  }
}