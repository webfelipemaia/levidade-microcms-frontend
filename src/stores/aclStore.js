import { defineStore } from 'pinia';
import { useRoleStore } from '../stores/roleStore';
import { usePermissionStore } from '../stores/permissionStore';

export const useAclStore = defineStore('acl', {
    state: () => ({
        isLoading: false,
        apiStatus: 'disconnected',
        aclMatrix: {},
        userPermissions: [],
        acl: {},
        lastFetch: null,
        cacheDuration: 5 * 60 * 1000 // 5 minutos em milissegundos
    }),
    
    actions: {
        // Busca todos os dados necessários para montar a ACL com cache
        async fetchAclData(forceRefresh = false) {
            // Verifica se precisa atualizar (cache expirado ou força refresh)
            const now = Date.now();
            if (!forceRefresh && this.lastFetch && (now - this.lastFetch < this.cacheDuration)) {
                return;
            }
            
            this.isLoading = true;
            this.apiStatus = 'loading';
            
            try {
                const roleStore = useRoleStore();
                const permissionStore = usePermissionStore();
                
                // Busca roles e permissões
                await Promise.all([
                    roleStore.getRoles(),
                    permissionStore.getPermissions(),
                    permissionStore.getRolesPermissions()
                ]);
                
                // Monta a matriz de ACL
                this.buildAclMatrix(
                    roleStore.roles, 
                    permissionStore.permissions, 
                    permissionStore.rolesPermissions
                );
                
                this.apiStatus = 'connected';
                this.lastFetch = now;
            } catch (error) {
                console.error('Erro ao buscar dados de ACL:', error);
                this.apiStatus = 'disconnected';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },
        
        // Monta a matriz de ACL
        buildAclMatrix(roles, permissions, rolesPermissions) {
            const matrix = {};
            
            roles.forEach(role => {
                matrix[role.id] = {};
                
                permissions.forEach(permission => {
                    const hasPermission = rolesPermissions.some(
                        rp => rp.roleId === role.id && rp.permissionId === permission.id
                    );
                    
                    matrix[role.id][permission.id] = hasPermission;
                });
            });
            
            this.aclMatrix = matrix;
        },
        
        // Busca as permissões de um usuário específico com cache
        async fetchUserPermissions(userId, forceRefresh = false) {
            if (!forceRefresh && this.userPermissions.length > 0) {
                return this.userPermissions;
            }
            
            this.isLoading = true;
            
            try {
                const roleStore = useRoleStore();
                const permissionStore = usePermissionStore();
                                
                await this.fetchAclData(forceRefresh);
                await roleStore.getUsersRoles();
                
                const userRoles = roleStore.usersRoles.filter(
                    userRole => userRole.userId === userId
                );
                
                this.userPermissions = [];
                userRoles.forEach(userRole => {
                    const rolePermissions = permissionStore.rolesPermissions.filter(
                        rp => rp.roleId === userRole.roleId
                    );
                    
                    rolePermissions.forEach(rp => {
                        const permission = permissionStore.permissions.find(
                            p => p.id === rp.permissionId
                        );
                        
                        if (permission && !this.userPermissions.some(up => up.id === permission.id)) {
                            this.userPermissions.push(permission);
                        }
                    });
                });
                
                return this.userPermissions;
            } catch (error) {
                console.error('Erro ao buscar permissões do usuário:', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },
        
        // Métodos auxiliares
        hasRolePermission(roleId, permissionId) {
            return this.aclMatrix[roleId] && this.aclMatrix[roleId][permissionId] === true;
        },
        
        hasUserPermission(permissionId) {
            return this.userPermissions.some(permission => permission.id === permissionId);
        },
        
        getRolePermissions(roleId) {
            const permissionStore = usePermissionStore();
            const rolePermissions = [];
            
            if (this.aclMatrix[roleId]) {
                Object.keys(this.aclMatrix[roleId]).forEach(permissionId => {
                    if (this.aclMatrix[roleId][permissionId]) {
                        const permission = permissionStore.permissions.find(
                            p => p.id === parseInt(permissionId)
                        );
                        if (permission) {
                            rolePermissions.push(permission);
                        }
                    }
                });
            }
            
            return rolePermissions;
        },
        
        getPermissionRoles(permissionId) {
            const roleStore = useRoleStore();
            const permissionRoles = [];
            
            roleStore.roles.forEach(role => {
                if (this.aclMatrix[role.id] && this.aclMatrix[role.id][permissionId]) {
                    permissionRoles.push(role);
                }
            });
            
            return permissionRoles;
        },
        
        clearAclData() {
            this.aclMatrix = {};
            this.userPermissions = [];
            this.apiStatus = 'disconnected';
            this.lastFetch = null;
        },
        
        // Invalida o cache forçando próxima busca a ser fresh
        invalidateCache() {
            this.lastFetch = null;
        }
    },
    
    getters: {
        aclMatrixData: (state) => state.aclMatrix,
        userPermissionsData: (state) => state.userPermissions,
        isLoaded: (state) => state.apiStatus === 'connected' && Object.keys(state.aclMatrix).length > 0,
        
        // Verifica se o cache está válido
        isCacheValid: (state) => {
            if (!state.lastFetch) return false;
            return (Date.now() - state.lastFetch) < state.cacheDuration;
        }
    }
});