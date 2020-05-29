import ImportCreate from './ImportCreate';
import { TYPE_PNKS } from './constants';

export default class ImportView extends ImportCreate {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => true;

  getColumnDef = (typeNewImport, formik, configData) => {
    const { columnDefs } = configData;
    if (
      configData.value === TYPE_PNKS.PNKS_DIEU_CHUYEN ||
      configData.value === TYPE_PNKS.PNKS_MUON
    ) {
      // remove column action
      columnDefs.pop();
    }
    if (configData.value === TYPE_PNKS.PNKS_TRA) {
      // remove column locatorReceiverName
      columnDefs.splice(5, 1);
    }

    if (configData.value === TYPE_PNKS.PNKS_MOI) {
      // createFrom = 1 SAP
      // createFrom = 2 FC40
      if (formik && formik.values.createFrom === 1 && !typeNewImport) {
        columnDefs.pop();
        columnDefs.pop();
        columnDefs.pop();
      }
    }
    return columnDefs;
  };
}
