export const initSchema = {
  roleId: null,
  name: null,
  value: null,
  description: null,
  isMaster: null,
  isActive: null,
  createdAt: null,
};

export default function Schema(init = {}) {
  this.roleId = init.roleId;
  this.name = init.name;
  this.value = init.value;
  this.description = init.description;
  this.isMaster = init.isMaster;
  this.isActive = init.isActive;
  this.createdAt = init.createdAt;
}
