export const demoFormData = {
  code: '',
  status: [
    {
      value: '00',
      label: 'Tất Cả',
    },
    {
      value: '01',
      label: 'Chờ Phê Duyệt',
    },
    {
      value: '02',
      label: 'Không Phê Duyệt',
    },
    {
      value: '03',
      label: 'Phê Duyệt',
    },
    {
      value: '04',
      label: 'Đã Huỷ Sản Phẩm',
    },
  ],
  causeOfCancellation: [
    {
      value: '00',
      label: 'Tất Cả',
    },
    {
      value: '01',
      label: 'Kinh Doanh Không Bán Được',
    },
    {
      value: '02',
      label: 'Các Nguyên Nhân Còn Lại',
    },
  ],
  unit: [
    {
      value: '01',
      label: 'NSC Sài Đồng',
    },
    {
      value: '02',
      label: 'NSC Số 2',
    },
    {
      value: '03',
      label: 'NSC Số 3',
    },
  ],
  approver: [
    {
      value: '00',
      label: 'Tất Cả',
    },
    {
      value: '01',
      label: 'Nguyễn Văn Toàn',
    },
    {
      value: '02',
      label: 'Nguyễn Văn Toàn',
    },
    {
      value: '03',
      label: 'Nguyễn Văn Toàn',
    },
    {
      value: '04',
      label: 'Nguyễn Văn Toàn',
    },
  ],
};
export const demoTableData = [
  {
    approve_level: 'Cấp 1',
    approverLevel1: '00000000-0000-0000-0000-000000000000',
    approverLevel2: '1bf439ef-7a5b-4476-9c6d-2c9a480baaa6',
    causeOfCancellation: 'Kinh doanh không bán được',
    created_date: '04/07/2019',
    id: 1,
    isApproved: false,
    isVisible: true,
    level: 'Cấp 1',
    org: 'Farm Tam Đảo',
    plantCode: '2001',
    receiptCode: '2001.190627.001',
    requesterName: 'Nguyen Van A',
    status: 'Chờ phê duyệt',
  },
  {
    approve_level: 'Cấp 2',
    approverLevel1: '00000000-0000-0000-0000-000000000000',
    approverLevel2: '1bf439ef-7a5b-4476-9c6d-2c9a480baaa6',
    causeOfCancellation: 'Kinh doanh không bán được',
    created_date: '04/07/2019',
    id: 1,
    isApproved: true,
    isVisible: false,
    level: 'Cấp 2',
    org: 'Farm Tam Đảo',
    plantCode: '2001',
    receiptCode: '2001.190627.001',
    requesterName: 'Nguyen Van A',
    status: 'Chờ phê duyệt',
  },
  {
    approve_level: 'Cấp 3',
    approverLevel1: '00000000-0000-0000-0000-000000000000',
    approverLevel2: '1bf439ef-7a5b-4476-9c6d-2c9a480baaa6',
    causeOfCancellation: 'Kinh doanh không bán được',
    created_date: '04/07/2019',
    id: 1,
    isApproved: false,
    isVisible: false,
    level: 'Cấp 1',
    org: 'Farm Tam Đảo',
    plantCode: '2001',
    receiptCode: '2001.190627.001',
    requesterName: 'Nguyen Van A',
    status: 'Chờ phê duyệt',
  },
  {
    approve_level: 'Cấp 4',
    approverLevel1: '00000000-0000-0000-0000-000000000000',
    approverLevel2: '1bf439ef-7a5b-4476-9c6d-2c9a480baaa6',
    causeOfCancellation: 'Kinh doanh không bán được',
    created_date: '04/07/2019',
    id: 1,
    isApproved: false,
    isVisible: false,
    level: 'Cấp 2',
    org: 'Farm Tam Đảo',
    plantCode: '2001',
    receiptCode: '2001.190627.001',
    requesterName: 'Nguyen Van A',
    status: 'Đã phê duyệt',
  },
  {
    approve_level: 'Cấp 5',
    approverLevel1: '00000000-0000-0000-0000-000000000000',
    approverLevel2: '1bf439ef-7a5b-4476-9c6d-2c9a480baaa6',
    causeOfCancellation: 'Kinh doanh không bán được',
    created_date: '04/07/2019',
    id: 1,
    isApproved: true,
    isVisible: true,
    level: 'Cấp 2',
    org: 'Farm Tam Đảo',
    plantCode: '2001',
    receiptCode: '2001.190627.001',
    requesterName: 'Nguyen Van A',
    status: 'Đã phê duyệt',
  },
];
