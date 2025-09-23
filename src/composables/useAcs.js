// src/composables/useAcl.js
import { computed } from 'vue'
import { useAclStore } from '@/stores/aclStore'
import { useAuthStore } from '@/stores/authStore'

export function useAcl() {
  const aclStore = useAclStore()
  const authStore = useAuthStore()

  // Dados reativos
  const userPermissions = computed(() => aclStore.userPermissionsData || [])
  const aclMatrix = computed(() => aclStore.aclMatrixData || {})
  const isLoading = computed(() => aclStore.isLoading)
  const isLoaded = computed(() => aclStore.isLoaded)

  // Métodos com tratamento de erro
  const hasPermission = (permissionId) => {
    return computed(() => {
      if (!authStore.user?.id) return false
      try {
        return aclStore.hasUserPermission(permissionId)
      } catch (error) {
        console.error('Error checking permission:', error)
        return false
      }
    })
  }

  const hasRolePermission = (roleId, permissionId) => {
    return computed(() => {
      try {
        return aclStore.hasRolePermission(roleId, permissionId)
      } catch (error) {
        console.error('Error checking role permission:', error)
        return false
      }
    })
  }

  const hasRole = (roleId) => {
    return computed(() => authStore.user?.roleId === roleId)
  }

  const fetchAclData = async (forceRefresh = false) => {
    try {
      return await aclStore.fetchAclData(forceRefresh)
    } catch (error) {
      console.error('Error fetching ACL data:', error)
      throw error
    }
  }

  const fetchUserPermissions = async (userId, forceRefresh = false) => {
    try {
      return await aclStore.fetchUserPermissions(userId, forceRefresh)
    } catch (error) {
      console.error('Error fetching user permissions:', error)
      throw error
    }
  }

  const getRolePermissions = (roleId) => {
    try {
      return aclStore.getRolePermissions(roleId) || []
    } catch (error) {
      console.error('Error getting role permissions:', error)
      return []
    }
  }

  return {
    // Dados
    userPermissions,
    aclMatrix,
    isLoading,
    isLoaded,
    
    // Métodos
    hasPermission,
    hasRolePermission,
    hasRole,
    fetchAclData,
    fetchUserPermissions,
    getRolePermissions,
    
    // Métodos diretos com tratamento de erro
    getPermissionRoles: (permissionId) => {
      try {
        return aclStore.getPermissionRoles(permissionId) || []
      } catch (error) {
        console.error('Error getting permission roles:', error)
        return []
      }
    }
  }
}