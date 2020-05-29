const userField = [
  'userName',
  'email',
  'lastName',
  'firstName',
  'phoneNumber',
  'isLdap',
  'isActive',
  'locked',
  'dateExpried',
  'userId',
];

export const mappingUserSchema = data => {
  const schema = {};
  userField.forEach(item => {
    schema[item] = data[item];
  });
  return schema;
};
