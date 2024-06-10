import axios from 'axios'

class RoleService {
  getAll() {
    return axios.get("roles/");
  }

  get(id) {
    return axios.get(`/roles/${id}`);
  }

  create(data) {
    return axios.post("/roles", data);
  }

  update(id, data) {
    return axios.put(`/tutorials/${id}`, data);
  }

  delete(id) {
    return axios.delete(`/tutorials/${id}`);
  }

  deleteAll() {
    return axios.delete(`/tutorials`);
  }

  findByTitle(title) {
    return axios.get(`/tutorials?title=${title}`);
  }
}

export default new RoleService();