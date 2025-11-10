import { defineStore } from 'pinia';
import api from '@/services/api';
import { useValidationErrors } from '@/composables/useValidation';

export const usePermissionStore = defineStore({
  id: "permission",
  state: () => ({
    permissions: [],
    rolesPermissions: [],
    message: null,
  }),

  actions: {
    async getPermissions() {
      try {
        const response = await api.get(`api/v1/private/permission`);
        if (response.data.status === "error") {
          this.message = response.data;
        } else {
          this.permissions = response.data;
        }
      } catch (error) {
        this.message = {
          status: "error",
          message: "Erro ao carregar permissões",
        };
      }
    },

    async getPaginatedPermissions({ page, pageSize, search, order, date }) {
      try {
        const finalOrder = Array.isArray(order)
          ? order
          : JSON.parse(order || '[["createdAt", "DESC"]]');
        const params = {
          page,
          pageSize,
          search: search || undefined,
          order: JSON.stringify(finalOrder),
        };

        if (date) params.date = date;

        const response = await api.get(`api/v1/private/permission/paginated`, {
          params,
        });

        return {
          data: response.data.data,
          total: response.data.total,
        };
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        return {
          data: [],
          total: 0,
        };
      }
    },

    async getRolesPermissions() {
      try {
        const response = await api.get(`/api/v1/private/permission/roles/`);
        if (response.data.status === "error") {
          this.message = response.data;
        } else {
          this.rolesPermissions = response.data;
        }
      } catch (error) {
        this.message = {
          status: "error",
          message: "Erro ao carregar permissões por função",
        };
      }
    },

    async getUsersRoles() {
      try {
        const response = await api.get(`/api/v1/private/users/roles/`);
        if (response.data.status === "error") {
          this.message = response.data;
        } else {
          this.rolesPermissions = response.data;
        }
      } catch (error) {
        this.message = {
          status: "error",
          message: "Erro ao carregar funções de usuários",
        };
      }
    },

    async createPermission(data) {
      try {
        const response = await api.post("api/v1/private/permission/", {
          name: data.name,
        });
        this.message = response.data;
      } catch (error) {
        let errorMessage = error.response.data?.message;
        this.message = {
          status: "error",
          message: useValidationErrors(errorMessage),
        };
      }
    },

    async updatePermission(data) {
      try {
        const response = await api.patch(
          `api/v1/private/permission/${data.id}`,
          data
        );
        this.message = response.data;
      } catch (error) {
        let errorMessage = error.response.data?.message;
        this.message = {
          status: "error",
          message: useValidationErrors(errorMessage),
        };
      }
    },

    async deletePermission(data) {
      try {
        const response = await api.delete(
          `api/v1/private/permission/${data.id}`
        );
        this.message = response.data;
        await api.get(`api/v1/private/permission`);
      } catch (error) {
        let errorMessage = error.response.data?.message;
        this.message = { status: "error", message: errorMessage };
      }
    },

    async doneSuccessfully(response) {
      if (response.data.status === "success") {
        const response = await api.get(`api/v1/private/permission`);
        if (response.data.status !== "error") {
          this.permissions = response.data;
        }
      }
    },

    clearSuccessMessage() {
      this.message = null;
    },
  },
});
