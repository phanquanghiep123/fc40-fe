import React from 'react';

import MuiTable from '../../app/components/MuiTable';

class TableBasic extends React.PureComponent {
  state = {
    columns: [
      {
        title: 'STT',
        field: 'id',
        width: '2em',
        readonly: true,
        cellStyle: {
          textAlign: 'center',
        },
        headerStyle: {
          textAlign: 'center',
        },
      },
      {
        title: 'Thông Tin Xe',
        field: 'info',
        hidden: true,
      },
      {
        title: 'Biển Số Xe',
        field: 'licensePlate',
        parentField: 'info',
      },
      {
        title: 'Lái Xe',
        field: 'driver',
        parentField: 'info',
      },
      {
        title: 'Tải Trọng Xe (Tấn)',
        field: 'carWeight',
      },
      {
        title: 'Giờ Xuất Phát',
        field: 'startedTime',
      },
    ],
  };

  generatorData() {
    return new Array(100).fill(null).map((_, idx) => ({
      id: idx + 1,
      driver: 'Trần Tuấn',
      licensePlate: '29L-1234',
      phone: '0911223344',
      startedTime: '09:00',
      deliveredTime: '01:00',
      arrivedTime: '12:00',
      carWeight: 1.5,
      carPallet: true,
      temperature: 0,
      coolerWorking: true,
      carTimes: 0,
      carCleaning: true,
    }));
  }

  render() {
    const { columns } = this.state;

    return (
      <MuiTable
        data={this.generatorData()}
        title="Danh Sách Bên Vận Chuyển"
        columns={columns}
        options={{
          border: true,
        }}
        editable={{
          onRowAdd: () => {},
          onRowUpdate: () => {},
          onRowDelete: () => {},
        }}
      />
    );
  }
}

export default TableBasic;
