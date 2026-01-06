// src/stores/aclStore.js
import { defineStore } from 'pinia';
import { useRoleStore } from '@/stores/roleStore';
import { usePermissionStore } from '@/stores/permissionStore';
import { useAuthStore } from './authStore';

export const useAclStore = defineStore('acl', {
    state: () => ({
        isLoading: false,
        apiStatus: 'disconnected',
        aclMatrix: {},
        userPermissions: [],
        lastFetch: null,
        cacheDuration: 5 * 60 * 1000 // 5 minutos
    }),
    
    actions: {
        // Busca todos os dados necessários para montar a ACL
        async fetchAclData(forceRefresh = false) {
            // Verifica se precisa atualizar
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
                
                // Normaliza os dados de rolesPermissions
                const normalizedRolesPermissions = this.normalizeRolesPermissions(permissionStore.rolesPermissions);
                
                // Monta a matriz de ACL
                this.buildAclMatrix(
                    roleStore.roles, 
                    permissionStore.permissions, 
                    normalizedRolesPermissions
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
        
        // Normaliza a estrutura de rolesPermissions
        normalizeRolesPermissions(rolesPermissions) {
            if (!rolesPermissions) return [];
            
            // Se já é um array, retorna diretamente
            if (Array.isArray(rolesPermissions)) {
                return rolesPermissions;
            }
            
            // Se é um objeto com propriedade data (resposta da API)
            if (rolesPermissions.data && Array.isArray(rolesPermissions.data)) {
                return rolesPermissions.data;
            }
            
            // Se é um objeto com status e data
            if (rolesPermissions.status === 'success' && Array.isArray(rolesPermissions.data)) {
                return rolesPermissions.data;
            }
            
            console.warn('Estrutura inesperada de rolesPermissions:', rolesPermissions);
            return [];
        },
        
        // Monta a matriz de ACL com base nos dados
        buildAclMatrix(roles, permissions, rolesPermissions) {
            const matrix = {};
            
            // Verifica se os dados são válidos
            if (!Array.isArray(roles) || !Array.isArray(permissions) || !Array.isArray(rolesPermissions)) {
                console.error('Dados inválidos para construir matriz ACL:', {
                    roles: Array.isArray(roles),
                    permissions: Array.isArray(permissions),
                    rolesPermissions: Array.isArray(rolesPermissions)
                });
                this.aclMatrix = {};
                return;
            }
            
            // Para cada role
            roles.forEach(role => {
                matrix[role.id] = {};
                
                // Para cada permission
                permissions.forEach(permission => {
                    // Verifica se existe relação na tabela Roles_Permissions
                    const hasPermission = rolesPermissions.some(
                        rp => rp.roleId === role.id && rp.permissionId === permission.id
                    );
                    
                    matrix[role.id][permission.id] = hasPermission;
                });
            });
            
            this.aclMatrix = matrix;
        },
        
        // Busca as permissões de um usuário específico
        async fetchUserPermissions(userId, forceRefresh = false) {
            if (!forceRefresh && this.userPermissions.length > 0) {
                return this.userPermissions;
            }
            
            this.isLoading = true;
            
            try {
                const authStore = useAuthStore();
                const roleStore = useRoleStore();
                const permissionStore = usePermissionStore();
                
                // Garante que temos os dados mais recentes
                await this.fetchAclData(forceRefresh);
                
                /* // Busca as roles do usuário
                await roleStore.getUsersRoles();
                
                // Normaliza usersRoles
                const normalizedUsersRoles = this.normalizeUsersRoles(roleStore.usersRoles);
                
                // Encontra as roles do usuário específico
                const userRoles = normalizedUsersRoles.filter(
                    userRole => userRole.userId === userId
                );
                
                // Normaliza rolesPermissions
                const normalizedRolesPermissions = this.normalizeRolesPermissions(permissionStore.rolesPermissions);
                
                // Consolida todas as permissões do usuário
                this.userPermissions = [];
                userRoles.forEach(userRole => {
                    const rolePermissions = normalizedRolesPermissions.filter(
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
                }); */

                // Em vez de buscar no usersRoles (que pode ser pesado), 
                // vamos pegar as roles que já vieram no login do usuário
                const userRoleNames = authStore.user?.roles || []; // Ex: ["Editor"]

                // Encontrar os objetos de role completos para pegar os IDs
                const rolesObjects = roleStore.roles.filter(r => userRoleNames.includes(r.name));
                const roleIds = rolesObjects.map(r => r.id); // Ex: [3]

                const normalizedRolesPermissions = this.normalizeRolesPermissions(permissionStore.rolesPermissions);

                this.userPermissions = [];
                
                // Pegar permissões associadas a esses IDs
                roleIds.forEach(id => {
                    const rps = normalizedRolesPermissions.filter(rp => rp.roleId === id);
                    rps.forEach(rp => {
                        const permission = permissionStore.permissions.find(p => p.id === rp.permissionId);
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
        
        // Normaliza a estrutura de usersRoles
        normalizeUsersRoles(usersRoles) {
            if (!usersRoles) return [];
            
            if (Array.isArray(usersRoles)) {
                return usersRoles;
            }
            
            if (usersRoles.data && Array.isArray(usersRoles.data)) {
                return usersRoles.data;
            }
            
            if (usersRoles.status === 'success' && Array.isArray(usersRoles.data)) {
                return usersRoles.data;
            }
            
            console.warn('Estrutura inesperada de usersRoles:', usersRoles);
            return [];
        },
        
        // Verifica se uma role tem uma permissão específica
        hasRolePermission(roleId, permissionId) {
            return this.aclMatrix[roleId] && this.aclMatrix[roleId][permissionId] === true;
        },
        
        // Verifica se o usuário atual tem uma permissão específica
        hasUserPermission(permissionId) {
            return this.userPermissions.some(permission => permission.id === permissionId);
        },
        
        // Retorna todas as permissões de uma role específica
        getRolePermissions(roleId) {
            const permissionStore = usePermissionStore();
            const rolePermissions = [];
            
            if (this.aclMatrix[roleId] && Array.isArray(permissionStore.permissions)) {
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
        
        // Retorna todas as roles que têm uma permissão específica
        getPermissionRoles(permissionId) {
            const roleStore = useRoleStore();
            const permissionRoles = [];
            
            if (!Array.isArray(roleStore.roles)) return permissionRoles;
            
            roleStore.roles.forEach(role => {
                if (this.aclMatrix[role.id] && this.aclMatrix[role.id][permissionId]) {
                    permissionRoles.push(role);
                }
            });
            
            return permissionRoles;
        },
        
        // Limpa os dados da store
        clearAclData() {
            this.aclMatrix = {};
            this.userPermissions = [];
            this.apiStatus = 'disconnected';
            this.lastFetch = null;
        },
        
        // Invalida o cache
        invalidateCache() {
            this.lastFetch = null;
        }
    },
    
    getters: {
        aclMatrixData: (state) => state.aclMatrix,
        userPermissionsData: (state) => state.userPermissions,
        isLoaded: (state) => state.apiStatus === 'connected' && Object.keys(state.aclMatrix).length > 0,
        isCacheValid: (state) => {
            if (!state.lastFetch) return false;
            return (Date.now() - state.lastFetch) < state.cacheDuration;
        }
    }
});