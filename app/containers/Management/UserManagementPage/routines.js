import { createRequestRoutine } from 'utils/sagaUtils';

export const rolesRoutine = createRequestRoutine(
  'roles',
  'fc40/UserManagementPage',
);
export const usersRoutine = createRequestRoutine(
  'users',
  'fc40/UserManagementPage',
);
