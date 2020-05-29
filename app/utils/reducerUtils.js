export function mappingState(state, value) {
  let newState = state;
  Object.keys(value).forEach(key => {
    if (key === 'set') {
      Object.keys(value.set).forEach(subKey => {
        if (value.set[subKey] !== null) {
          newState = newState.set(subKey, value.set[subKey]);
        }
      });
    } else if (key === 'setIn') {
      Object.keys(value.setIn).forEach(subKey => {
        if (value.setIn[subKey] !== null) {
          const [parent, child] = subKey.split('_');
          newState = newState.setIn([parent, child], value.setIn[subKey]);
        }
      });
    }
  });
  return newState;
}
