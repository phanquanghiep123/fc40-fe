import { createRequestRoutine } from 'utils/sagaUtils';

export const roleRoutine = createRequestRoutine(
  'role',
  'fc40/RoleManagementPage',
);
export const rolesRoutine = createRequestRoutine(
  'roles',
  'fc40/RoleManagementPage',
);
export const usersRoutine = createRequestRoutine(
  'users',
  'fc40/RoleManagementPage',
);
export const privilegesRoutine = createRequestRoutine(
  'privileges',
  'fc40/RoleManagementPage',
);
export const regionOrgsRoutine = createRequestRoutine(
  'regionorgs',
  'fc40/RoleManagementPage',
);
