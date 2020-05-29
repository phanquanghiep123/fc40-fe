import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

/* Dashboard */
import HomePage from 'containers/HomePage/Loadable';

/* Management */
import RoleManagementPage from 'containers/Management/RoleManagementPage/Loadable';
import UserManagementPage from 'containers/Management/UserManagementPage/Loadable';

/* [NSC] BBGH */
import BBGHCreatePage from 'containers/NSC_BBGH/BBGHCreatePage/Loadable';
import BBGHEditPage from 'containers/NSC_BBGH/BBGHEditPage/Loadable';
import BBGHViewPage from 'containers/NSC_BBGH/BBGHViewPage/Loadable';
import DeliveryOrderListPage from 'containers/NSC_BBGH/ListPage/Loadable';

/* [NSC] BBGNHH */
import BBGNHHCreatePage from 'containers/NSC_BBGNHH/CreatePage/Loadable';
import BBGNHHEditPage from 'containers/NSC_BBGNHH/EditPage/Loadable';
import BBGNHHViewPage from 'containers/NSC_BBGNHH/ViewPage/Loadable';

/* [NSC] ReciveBBGH */
import ReceivingDeliveryOrderPage from 'containers/NSC_ReciveBBGH/Loadable';

/* [NSC] TotalWeight */
import TotalWeight from 'containers/NSC_TotalWeight/ListPage/Loadable';
import TotalWeightFileListPage from 'containers/NSC_TotalWeight/FileListPage/Loadable';

/* [NSC] ImportedStockReceipt */
import WeighedImportedPage from 'containers/NSC_ImportedStockReceipt/WeightPage/Loadable';
import ImportedReceiptsWeighing from 'containers/NSC_ImportedStockReceipt/WeighingPage/Loadable';
import ImportedStockReceiptListPage from 'containers/NSC_ImportedStockReceipt/ListPage/Loadable';

/* [NSC] ExportedStockReceipt */
import ExportedStockReceiptListPage from 'containers/NSC_ExportedStockReceipt/ListPage/Loadable';

/* [NSC] ConfirmDataLSX */
import ConfirmDataLSX from 'containers/NSC_ConfirmDataLSX/Loadable';

/* [NSC] PXK */
import PXK from 'containers/NSC_PXK/PXK/Loadable';
import PXKDetail from 'containers/NSC_PXK/Detail/Loadable';
import PXKReceiptList from 'containers/NSC_PXK/ReceiptList/Loadable';
import PXKDieuChinhPage from 'containers/NSC_PXK/DieuChinh/Loadable';

/* [NSC] Điều chỉnh */
import NSCDieuChinhPage from 'containers/NSC_DieuChinh/Loadable';

/* [NSC] Đặt hàng NCC */
import NCCListImportPage from 'containers/NSC_OrderNCC/ListImport/Loadable';
import NCCListMailSentPage from 'containers/NSC_OrderNCC/ListMailSent/Loadable';

/* [NSC] Supplier */
import SupplierListPage from 'containers/NSC_Supplier/ListPage/Loadable';
import SupplierCreatePage from 'containers/NSC_Supplier/CreatePage/Loadable';
import SupplierEditPage from 'containers/NSC_Supplier/EditPage/Loadable';
import SupplierDetailPage from 'containers/NSC_Supplier/DetailPage/Loadable';
import UpdateInventoryPage from 'containers/UpdateInventory/Loadable';
import Synchronize from 'containers/SynchronizePage/Loadable';
import ImportApprovedPricePage from 'containers/NSC_ApprovedPrice/ImportApprovedPrice/Loadable';
import ApprovalPriceList from 'containers/CC_ApprovalPrice/ListPage/Loadable';
/* [NSC] Quản lý kho */
import StockManagement from 'containers/NSC_StockManagement/ListPage/Loadable';
import AddProducts from 'containers/NSC_StockManagement/AddProducts/Loadable';
import RetailListPage from 'containers/CC_Retail/ListPage/Loadable';
import WithdrawalRequestPage from 'containers/NSC_WithdrawalRequest/CreateEditPage/Loadable';
import ExportBaskets from 'containers/ExportBaskets/Loadable';
import BCDUSLDHListPage from '../NSC_Report/BCSUSLDHListPage/Loadable';
import SplitReport from '../NSC_PXK/SplitReport/Loadable';
import PickingImportFile from '../NSC_Picking/ImportFile';
import PickingListPage from '../NSC_Picking/ListPage/Loadable';
import CancelRequestDetailPage from '../NSC_CancelRequest/DetailPage/Loadable';
import CancelRequestListPage from '../NSC_CancelRequest/ListPage/Loadable';
import FileDeliveryListPage from '../NSC_FileDelivery/ListPage/Loadable';
/* [NSC] OrderNCC SettingEmail */
import SettingEmailPage from '../NSC_OrderNCC/SettingEmailPage/Loadable';
/* [NSC] BBGNHH */
import BBGNHH from '../NSC_BBGNHH/ListPage/Loadable';
/* [NSC] PXK Deli Khay sọt */
import PXKDeliBasket from '../NSC_PXK/PXK_DeliBasket/Loadable';
import PXKVinmartDistribution from '../NSC_PXK/PXK_VinmartDistribution/Loadable';
/* [CC] Approval price */
/*! [CC] Approval price */
/* [CC] Import floor */
import ImportPriceList from '../CC_ImportPrice/ListPage/Loadable';
/*! [CC] Import floor */
import Inventory from '../NSC_StockManagement/Inventory/Loadable';
/* [NSC] DBSL */
import OutputPorecastsList from '../NSC_DBSL/ListPage/Loadable';
/*! [NSC] DBSL */

/* [NSC] DBSL */
import OutputOfSemiFinishedProducts from '../NSC_SLBTP/ListPage/Loadable';
/*! [NSC] DBSL */
/* [NSC] Báo Cáo Sản Xuất */
import ProceedProductionReport from '../NSC_Report/ProceedProductionReport/Loadable';
/* [NSC] DBSL */
import AttributionProduction from '../NSC_LSXSX/ListPage/Loadable';
/*! [NSC] DBSL */
import ProductionReport from '../NSC_Report/ProductionReport/Loadable';
/* [Farm] Kế hoạch sản lượng */
import ProjectedCropQuantity from '../Farm/ProjectedCropQuantity';
/* [Farm] Kế hoạch thu hoạch */
import ListOwnerBasket from '../ListOwnerBasket/Loadable';
import HarvestPlan from '../Farm/HarvestPlan/Loadable';
import MasterBaskets from '../Baskets/MasterBaskets/Loadable';
// Nhập Kho Khay Sọt
import ImportedBaskets from '../Baskets/Imported/ImportedBaskets/Loadable';
import ImportedBasketsTray from '../ImportedBasketsTray/Loadable';
/*   [Baskets] Phiếu xuất khay s ọt  */
import ExportedBaskets from '../Baskets/Export/ExportedBaskets/CreatePage/Loadable';
/* [Baskets] tính toán báo cáo tồn vật lý khay sọt */
import HistoryPhysicalInventoryReport from '../Baskets/HistoryPhysicalInventoryReport/ListPage/Loadable';
/* [Baskets] Báo cáo hàng tồn kho vật lý khay sọt */
import PhysicalInventoryReport from '../Baskets/PhysicalInventoryReport/ListPage/Loadable';
import StockBasketManagement from '../Baskets/StockBasketManagement/Loadable';
/*   [Baskets] Báo cáo tình trạng thanh lý hủy khay sọt  */
import PalletBasketCancelationReport from '../KS_Report/KS_BCTLHKS/Loadable';
/*   [Baskets] Báo cáo khay sọt đi đường  */
import PalletBasketReport from '../KS_Report/KS_BCKSDD/Loadable';
/*   [Baskets] Báo cáo chi tiết giao dịch xuất nhập  */
import TransactionReport from '../Baskets/BK_BCCTGDNX/ListPage/Loadable';
/*   [Baskets] Báo cáo số lượng khay sọt mượn/ cho mượn  */
import BorrowBasketReport from '../Baskets/BorrowBasketReport/ListPage/Loadable';

import InventoryBasket from '../InventoryBasket/Loadable';

import ExportImportPropertyList from '../ExportImportPropertyList/Loadable';
/* [Baskets] Báo cáo kiểm kê */
import BasketStocktaking from '../Baskets/BasketStocktaking/ListPage/Loadable';

import ListBbkk from '../BBKK/ListBbkk/Loadable';
import PostprocessKK from '../BBKK/PostprocessKk/Loadable';
import AdjustStockTaking from '../BBKK/AdjustStockTaking/Loadable';

// Báo cáo tần xuất sử dụng khay sọt
import BasketUsingFrequenceReport from '../Baskets/BasketUsingFrequenceReport/Loadable';
import BasketUsingFrequenceCalculation from '../Baskets/BasketUsingFrequenceCalculation/Loadable';

export default [
  {
    path: '/',
    title: 'Trang chủ',
    component: HomePage,
  },
  {
    path: '/bao-cao-dap-ung-san-luong-dat-hang',
    title: 'Báo cáo đáp ứng sản lượng đặt hàng',
    canDo: CODE.xemBCDUSLDH,
    canOn: SCREEN_CODE.BCDUSLDH,
    component: BCDUSLDHListPage,
  },
  {
    path: '/danh-sach-phieu-xuat-kho/xem-phieu-xuat-kho/:id',
    title: 'Xem phiếu xuất kho',
    component: PXK,
  },
  {
    path: '/danh-sach-phieu-xuat-kho/chinh-sua-phieu-xuat-kho/:id',
    title: 'Chỉnh sửa phiếu xuất kho',
    component: PXK,
  },
  {
    path: '/tao-phieu-xuat-kho',
    title: 'Tạo phiếu xuất kho',
    component: PXK,
  },
  {
    path: '/danh-sach-phieu-xuat-kho/tao-phieu-xuat-kho',
    title: 'Tạo phiếu xuất kho',
    component: PXK,
  },
  {
    path: '/danh-sach-phieu-dang-can-xuat-kho/xem-phieu-xuat-kho/:id',
    title: 'Xem phiếu xuất kho',
    component: PXK,
  },
  {
    path: '/danh-sach-phieu-xuat-kho/chi-tiet-phieu-xuat-kho/:id',
    title: 'Xem phiếu xuất kho',
    component: PXKDetail,
  },
  {
    path: '/danh-sach-phieu-dang-can-xuat-kho',
    title: 'Danh sách phiếu đang cân xuất kho',
    component: PXKReceiptList,
  },
  {
    path: '/danh-sach-phieu-xuat-kho/danh-sach-phieu-dang-can-xuat-kho',
    title: 'Danh sách phiếu đang cân xuất kho',
    component: PXKReceiptList,
  },
  {
    path: '/dong-bo-sap',
    title: 'Đồng Bộ',
    component: Synchronize,
  },
  {
    path: '/xac-nhan-du-lieu-tao-lenh-san-xuat',
    title: 'Xác nhận dữ liệu tạo LSX',
    component: ConfirmDataLSX,
  },
  {
    path: '/danh-sach-du-lieu-dieu-chinh-chia-chon-thuc-te',
    title: 'Danh sách dữ liệu điều chỉnh - Chia chọn thực tế',
    component: PXKDieuChinhPage,
  },
  {
    path: '/danh-sach-du-lieu-dieu-chinh',
    title: 'Danh sách dữ liệu điều chỉnh',
    component: NSCDieuChinhPage,
  },
  {
    path: '/danh-sach-phieu-xuat-kho',
    title: 'Danh sách phiếu xuất kho',
    component: ExportedStockReceiptListPage,
  },
  {
    path: '/danh-sach-can-hang',
    title: 'Danh sách cân hàng',
    component: TotalWeight,
  },
  {
    path: '/danh-sach-can-tong-dieu-phoi',
    title: 'Danh sách cân tổng điều phối ',
    component: TotalWeightFileListPage,
  },
  {
    path: '/danh-sach-phieu-can-nhap-kho',
    title: 'Danh sách Phiếu Cân Nhập Kho',
    component: ImportedStockReceiptListPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang',
    title: 'Danh sách Biên Bản Giao Hàng',
    component: DeliveryOrderListPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/:id',
    title: 'Xem biên bản giao hàng',
    component: BBGHViewPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/chinh-sua-bien-ban-giao-hang/:id',
    title: 'Chỉnh sửa biên bản giao hàng',
    component: BBGHEditPage,
  },
  {
    path:
      '/danh-sach-phieu-xuat-kho/tao-phieu-xuat-kho/chinh-sua-bien-ban-giao-hang/:id',
    title: 'Chỉnh sửa biên bản giao hàng',
    component: BBGHEditPage,
  },
  {
    path:
      '/danh-sach-phieu-xuat-kho/chinh-sua-phieu-xuat-kho/:pid/chinh-sua-bien-ban-giao-hang/:id',
    title: 'Chỉnh sửa biên bản giao hàng',
    component: BBGHEditPage,
  },
  {
    path:
      '/danh-sach-phieu-xuat-kho/xem-phieu-xuat-kho/:pid/chinh-sua-bien-ban-giao-hang/:id',
    title: 'Chỉnh sửa biên bản giao hàng',
    component: BBGHEditPage,
  },
  {
    path: '/tao-phieu-xuat-kho/chinh-sua-bien-ban-giao-hang/:id',
    title: 'Chỉnh sửa biên bản giao hàng',
    component: BBGHEditPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/tao-moi-bien-ban-giao-hang',
    title: 'Tạo mới biên bản giao hàng',
    component: BBGHCreatePage,
  },
  {
    path: '/tao-moi-bien-ban-giao-hang',
    title: 'Tạo mới biên bản giao hàng',
    component: BBGHCreatePage,
  },
  {
    path:
      '/danh-sach-bien-ban-giao-nhan-hang-hoa/tao-moi-bien-ban-giao-nhan-hang-hoa',
    title: 'Tạo mới biên bản giao nhận hàng hóa',
    canDo: CODE.taoBBGNHH,
    canOn: SCREEN_CODE.BBGNHH,
    component: BBGNHHCreatePage,
  },
  {
    path:
      '/danh-sach-bien-ban-giao-nhan-hang-hoa/chinh-sua-bien-ban-giao-nhan-hang-hoa/:id',
    title: 'Chỉnh sửa biên bản giao nhận hàng hóa',
    component: BBGNHHEditPage,
    canDo: CODE.suaBBGNHH,
    canOn: SCREEN_CODE.BBGNHH,
  },
  {
    path:
      '/danh-sach-bien-ban-giao-nhan-hang-hoa/xem-bien-ban-giao-nhan-hang-hoa/:id',
    title: 'Xem biên bản giao nhận hàng hóa',
    component: BBGNHHViewPage,
  },
  {
    path: '/tao-moi-bien-ban-giao-nhan-hang-hoa',
    title: 'Tạo mới biên bản giao nhận hàng hóa',
    canDo: CODE.taoBBGNHH,
    canOn: SCREEN_CODE.BBGNHH,
    component: BBGNHHCreatePage,
  },
  {
    path: '/chinh-sua-bien-ban-giao-nhan-hang-hoa/:id',
    title: 'Chỉnh sửa biên bản giao nhận hàng hóa',
    canDo: CODE.suaBBGNHH,
    canOn: SCREEN_CODE.BBGNHH,
    component: BBGNHHEditPage,
  },
  {
    path: '/xem-bien-ban-giao-nhan-hang-hoa/:id',
    title: 'Xem biên bản giao nhận hàng hóa',
    component: BBGNHHViewPage,
  },
  {
    path:
      '/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/:pid/tiep-nhan-bien-ban-giao-hang/:id',
    title: 'Tiếp nhận Biên Bản Giao Hàng',
    component: ReceivingDeliveryOrderPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/tiep-nhan-bien-ban-giao-hang/:id',
    title: 'Tiếp nhận Biên Bản Giao Hàng',
    component: ReceivingDeliveryOrderPage,
  },
  {
    path: '/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho',
    title: 'Cân Nhập Kho',
    component: WeighedImportedPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/can-san-pham-nhap-kho',
    title: 'Cân Nhập Kho',
    component: WeighedImportedPage,
  },
  {
    path: '/can-san-pham-nhap-kho',
    title: 'Cân Nhập Kho',
    component: WeighedImportedPage,
  },
  {
    path: '/danh-sach-phieu-can-nhap-kho/danh-sach-phieu-dang-can-nhap-kho',
    title: 'Danh sách phiếu đang cân nhập kho',
    component: ImportedReceiptsWeighing,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/danh-sach-phieu-dang-can-nhap-kho',
    title: 'Danh sách phiếu đang cân nhập kho',
    component: ImportedReceiptsWeighing,
  },
  {
    path: '/danh-sach-phieu-dang-can-nhap-kho',
    title: 'Danh sách phiếu đang cân nhập kho',
    component: ImportedReceiptsWeighing,
  },
  {
    path: '/quan-ly-phan-quyen',
    title: 'Quản lý phân quyền',
    component: RoleManagementPage,
  },
  {
    path: '/quan-ly-nguoi-dung',
    title: 'Quản lý người dùng',
    component: UserManagementPage,
  },
  {
    path: '/import-file-chia-chon-du-kien',
    title: 'Import file chia chọn dự kiến',
    component: PickingImportFile,
  },
  {
    path: '/danh-sach-file-import',
    title: 'Danh sách file import',
    component: PickingListPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy',
    title: 'Danh sách phiếu yêu cầu huỷ',
    canDo: [CODE.xemYCH, CODE.xemYCHKS],
    canOn: SCREEN_CODE.PYCH,
    component: CancelRequestListPage,
  },
  {
    path: '/tao-moi-phieu-yeu-cau-huy',
    title: 'Tạo mới phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy/tao-moi-phieu-yeu-cau-huy',
    title: 'Tạo mới phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/chinh-sua-phieu-yeu-cau-huy/:id',
    title: 'Chỉnh sửa phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy/chinh-sua-phieu-yeu-cau-huy/:id',
    title: 'Chỉnh sửa phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/phe-duyet-phieu-yeu-cau-huy/:id',
    title: 'Phê duyệt yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy/phe-duyet-phieu-yeu-cau-huy/:id',
    title: 'Phê duyệt yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/phe-duyet-lai-phieu-yeu-cau-huy/:id',
    title: 'Phê duyệt lại phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy/phe-duyet-lai-phieu-yeu-cau-huy/:id',
    title: 'Phê duyệt lại phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/xem-phieu-yeu-cau-huy/:id',
    title: 'Xem phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/danh-sach-phieu-yeu-cau-huy/xem-phieu-yeu-cau-huy/:id',
    title: 'Xem phiếu yêu cầu huỷ',
    component: CancelRequestDetailPage,
  },
  {
    path: '/cap-nhat-ton-kho-fc40',
    title: 'Cập nhật tồn kho FC40',
    component: UpdateInventoryPage,
  },
  {
    path: '/cai-dat-email',
    title: 'Cài đặt Email',
    component: SettingEmailPage,
  },
  {
    path: '/danh-sach-file-import-dat-hang-ncc',
    title: 'Danh sách file import đặt hàng ncc',
    canDo: CODE.xemDHNCC,
    canOn: SCREEN_CODE.DHNCC,
    component: NCCListImportPage,
  },
  {
    path: '/danh-sach-file-import-dat-hang-ncc/lich-su-gui-mail/:id',
    title: 'Lịch sử gửi mail',
    canDo: CODE.xemDHNCC,
    canOn: SCREEN_CODE.DHNCC,
    component: NCCListMailSentPage,
  },
  {
    path: '/danh-sach-bien-ban-giao-nhan-hang-hoa',
    title: 'Danh sách biên bản giao nhận hàng hoá',
    canDo: CODE.xemBBGNHH,
    canOn: SCREEN_CODE.BBGNHH,
    component: BBGNHH,
  },
  {
    path: '/dang-ky-thong-tin-khay-sot',
    title: 'Đăng kí thông tin khay sọt sau chia chọn thực tế',
    canDo: CODE.taoTTKS,
    canOn: SCREEN_CODE.TTKS,
    component: PXKDeliBasket,
  },
  {
    path: '/import-gia-da-phe-duyet',
    title: 'Import file giá đã phê duyệt',
    component: ImportApprovedPricePage,
  },
  {
    path: '/danh-sach-nha-cung-cap',
    title: 'Danh sách Nhà Cung Cấp',
    canDo: CODE.xemDSNCC,
    canOn: SCREEN_CODE.DSNCC,
    component: SupplierListPage,
  },
  {
    path: '/tao-moi-nha-cung-cap',
    title: 'Tạo mới Nhà Cung Cấp',
    canDo: CODE.taoNCC,
    canOn: SCREEN_CODE.DSNCC,
    component: SupplierCreatePage,
  },
  {
    path: '/danh-sach-nha-cung-cap/tao-moi-nha-cung-cap',
    title: 'Tạo mới Nhà Cung Cấp',
    canDo: CODE.taoNCC,
    canOn: SCREEN_CODE.DSNCC,
    component: SupplierCreatePage,
  },
  {
    path: '/cap-nhat-nha-cung-cap/:id',
    title: 'Cập Nhật Nhà Cung Cấp',
    canDo: CODE.suaNCC,
    canOn: SCREEN_CODE.DSNCC,
    component: SupplierEditPage,
  },
  {
    path: '/danh-sach-nha-cung-cap/cap-nhat-nha-cung-cap/:id',
    title: 'Cập Nhật Nhà Cung Cấp',
    canDo: CODE.suaNCC,
    canOn: SCREEN_CODE.DSNCC,
    component: SupplierEditPage,
  },
  {
    path: '/chi-tiet-nha-cung-cap/:id',
    title: 'Chi tiết Nhà Cung Cấp',
    component: SupplierDetailPage,
  },
  {
    path: '/danh-sach-nha-cung-cap/chi-tiet-nha-cung-cap/:id',
    title: 'Chi tiết Nhà Cung Cấp',
    component: SupplierDetailPage,
  },
  {
    path: '/chia-hang-cho-vm-vmp',
    title: 'Chia hàng cho VinMart, VinMart+',
    component: PXKVinmartDistribution,
  },
  {
    path: '/bao-cao-tinh-trang-chia-hang',
    title: 'Báo Cáo Tình Trạng Chia Hàng',
    component: SplitReport,
  },
  {
    path: '/danh-sach-gia-phe-duyet',
    title: 'Danh sách giá phê duyệt',
    canDo: CODE.xemDSGDPD,
    canOn: SCREEN_CODE.DSGDPD,
    component: ApprovalPriceList,
  },
  {
    path: '/quan-ly-kho',
    title: 'Quản Lý Kho',
    component: StockManagement,
  },
  {
    path: '/quan-ly-kho/them-san-pham',
    title: 'Thêm Sản Phẩm',
    component: AddProducts,
  },
  {
    path: '/them-san-pham',
    title: 'Thêm Sản Phẩm',
  },
  {
    path: '/danh-sach-ban-xa',
    title: 'Danh sách bán xá',
    component: RetailListPage,
  },
  {
    path: '/tao-moi-yeu-cau-ban-xa',
    title: 'Tạo mới yêu cầu xuất bán xá',
    canDo: CODE.xemPXBX,
    canOn: SCREEN_CODE.PXBX,
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-ban-xa/tao-moi-yeu-cau-ban-xa',
    title: 'Tạo mới yêu cầu xuất bán xá',
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-ban-xa/sua/:id',
    title: 'Thay đổi yêu cầu xuất bán xá',
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-ban-xa/xem/:id',
    title: 'Xem yêu cầu xuất bán xá',
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-ban-xa/duyet-lai/:id',
    title: 'Duyệt lại yêu cầu xuất bán xá',
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-ban-xa/duyet/:id',
    title: 'Duyệt yêu cầu xuất bán xá',
    component: WithdrawalRequestPage,
  },
  {
    path: '/danh-sach-file-delivery',
    title: 'Danh Sách Dữ Liệu Deli',
    canDo: CODE.xemCCTT,
    canOn: SCREEN_CODE.DSCCTT,
    component: FileDeliveryListPage,
  },
  {
    path: '/danh-sach-gia-san',
    title: 'Danh sách giá sàn',
    canDo: CODE.xemDSGS,
    canOn: SCREEN_CODE.DSGS,
    component: ImportPriceList,
  },
  {
    path: '/danh-sach-du-bao-san-luong',
    title: 'Danh sách dự báo sản lượng',
    canDo: CODE.xemDSDBSL,
    canOn: SCREEN_CODE.DSDBSL,
    component: OutputPorecastsList,
  },
  {
    path: '/danh-sach-ghi-nhan-slbtp-thuc-te',
    title: 'Ghi nhận SL BTP thực tế',
    canDo: CODE.xemDSSLBTP,
    canOn: SCREEN_CODE.DSSLBTP,
    component: OutputOfSemiFinishedProducts,
  },
  {
    path: '/phan-bo-lich-su-xu-ly-san-xuat',
    title: 'Phân bổ TP cho LSX SX',
    canDo: CODE.xemDSLSSLBTP,
    canOn: SCREEN_CODE.DSLSSLBTP,
    component: AttributionProduction,
  },
  {
    path: '/danh-sach-ghi-nhan-slbtp-thuc-te/phan-bo-lich-su-xu-ly-san-xuat',
    title: 'Phân bổ TP cho LSX SX',
    canDo: CODE.xemDSLSSLBTP,
    canOn: SCREEN_CODE.DSLSSLBTP,
    component: AttributionProduction,
  },
  {
    path: '/bao-cao-san-xuat',
    title: 'Báo cáo sản xuất',
    canDo: CODE.xemBCSX,
    canOn: SCREEN_CODE.DSBCSX,
    component: ProductionReport,
  },
  {
    path: '/tinh-toan-bao-cao-san-xuat',
    title: 'Tính toán báo cáo sản xuất',
    canDo: CODE.taoBCSX,
    canOn: SCREEN_CODE.TTBCSX,
    component: ProceedProductionReport,
  },
  {
    path: '/bao-cao-san-xuat/tinh-toan-bao-cao-san-xuat',
    title: 'Tính toán báo cáo sản xuất',
    canDo: CODE.taoBCSX,
    canOn: SCREEN_CODE.TTBCSX,
    component: ProceedProductionReport,
  },
  {
    path: '/ke-hoach-san-luong',
    title: 'Kế hoạch sản lượng',
    canDo: CODE.xemDSKHSL,
    canOn: SCREEN_CODE.DSKHSL,
    component: ProjectedCropQuantity,
  },
  {
    path: '/quan-ly-kho/kiem-ke-kho',
    title: 'Kiểm Kê Kho',
    component: Inventory,
  },
  {
    path: '/kiem-ke-kho',
    title: 'Kiểm Kê Kho',
    component: Inventory,
  },
  {
    path: '/ke-hoach-thu-hoach',
    title: 'Kế Hoạch Thu Hoạch',
    canDo: CODE.xemKHTH,
    canOn: SCREEN_CODE.KHTH,
    component: HarvestPlan,
  },
  {
    path: '/danh-sach-khay-sot-so-huu',
    title: 'Danh sách khay sọt sở hữu',
    component: ListOwnerBasket,
  },
  {
    path: '/danh-sach-phieu-xuat-kho-khay-sot',
    title: 'Danh Sách Phiếu Xuất Khay Sọt',
    canDo: CODE.xemPXKS,
    canOn: SCREEN_CODE.PXKS,
    component: ExportBaskets,
  },
  {
    path: '/tao-phieu-xuat-kho-khay-sot',
    title: 'Tạo Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/xem-phieu-xuat-kho-khay-sot',
    title: 'Xem Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/chinh-sua-phieu-xuat-kho-khay-sot',
    title: 'Chỉnh Sửa Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/xac-nhan-phieu-xuat-kho-khay-sot',
    title: 'Xác Nhận Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-kho-khay-sot/tao-phieu-xuat-kho-khay-sot',
    title: 'Tạo Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-kho-khay-sot/xem-phieu-xuat-kho-khay-sot',
    title: 'Xem Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path:
      '/danh-sach-phieu-xuat-kho-khay-sot/chinh-sua-phieu-xuat-kho-khay-sot',
    title: 'Chỉnh Sửa Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-kho-khay-sot/xac-nhan-phieu-xuat-kho-khay-sot',
    title: 'Xác Nhận Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-kho-khay-sot/phieu-xuat-kho-khay-sot',
    title: 'Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-master-khay-sot',
    title: 'Danh sách Master Khay Sọt',
    canDo: CODE.xemMasterKS,
    canOn: SCREEN_CODE.MASTERKS,
    component: MasterBaskets,
  },
  {
    path: '/danh-sach-phieu-nhap-khay-sot',
    title: 'Danh Sách Phiếu Nhập Khay Sọt',
    canDo: CODE.xemDSPNKS,
    canOn: SCREEN_CODE.DSPNKS,
    component: ImportedBasketsTray,
  },
  {
    path: '/danh-sach-phieu-nhap-khay-sot/ke-hoach-thu-hoach',
    title: 'Danh sách phiếu nhập khay sọt',
    component: HarvestPlan,
  },
  {
    path: '/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot',
    title: 'Xem Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-phieu-nhap-khay-sot/chinh-sua-phieu-nhap-kho-khay-sot',
    title: 'Chỉnh Sửa Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-phieu-nhap-khay-sot/tao-phieu-nhap-kho-khay-sot',
    title: 'Tạo Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-nhap-so-huu/tao-phieu-nhap-kho-khay-sot',
    title: 'Tạo Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/chinh-sua-phieu-nhap-kho-khay-sot',
    title: 'Chỉnh Sửa Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/xem-phieu-nhap-kho-khay-sot',
    title: 'Xem Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-phieu-xuat-nhap-so-huu/xem-phieu-nhap-kho-khay-sot',
    title: 'Xem Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/tao-phieu-nhap-kho-khay-sot',
    title: 'Tạo Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/chinh-sua-phieu-nhap-kho-khay-sot',
    title: 'Chỉnh Sửa Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/xem-phieu-nhap-kho-khay-sot',
    title: 'Xem Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/tao-phieu-nhap-kho-khay-sot',
    title: 'Tạo Phiếu Nhập Kho Khay Sọt',
    component: ImportedBaskets,
  },
  {
    path: '/phieu-xuat-kho-khay-sot',
    title: 'Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/danh-sach-bien-ban-giao-hang/phieu-xuat-kho-khay-sot',
    title: 'Phiếu Xuất Khay Sọt',
    component: ExportedBaskets,
  },
  {
    path: '/tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemDSLSBCTKKS,
    canOn: SCREEN_CODE.DSLSBCTKKS,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path:
      '/bao-cao-ton-kho-vat-ly-khay-sot/tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemDSLSBCTKKS,
    canOn: SCREEN_CODE.DSLSBCTKKS,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path: '/bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemDSBCTKKS,
    canOn: SCREEN_CODE.DSBCTKKS,
    component: PhysicalInventoryReport,
  },
  {
    path: '/quan-ly-kho-khay-sot',
    title: 'Quản Lý Kho Khay Sọt',
    canDo: CODE.xemQLKKS,
    canOn: SCREEN_CODE.QLKKS,
    component: StockBasketManagement,
  },
  {
    path: '/bao-cao-xuat-thanh-ly-xuat-huy-khay-sot',
    title: 'Báo cáo xuất thanh lý, xuất hủy khay sọt',
    canDo: CODE.xemBCXTLXHKS,
    canOn: SCREEN_CODE.BCXTLXHKS,
    component: PalletBasketCancelationReport,
  },
  {
    path: '/bao-cao-khay-sot-di-duong',
    title: 'Báo cáo khay sọt đi đường',
    canDo: CODE.xemBCKSDD,
    canOn: SCREEN_CODE.BCKSDD,
    component: PalletBasketReport,
  },
  {
    path: '/danh-sach-phieu-xuat-nhap-so-huu',
    title: 'Danh Sách Phiếu Xuất/Nhập Sở Hữu',
    canDo: CODE.xemPXNKSSH,
    canOn: SCREEN_CODE.PXNKSSH,
    component: ExportImportPropertyList,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/xem-bien-ban-kiem-ke-khay-sot',
    title: 'Xem Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/tao-bien-ban-kiem-ke-khay-sot',
    title: 'Tạo Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/chinh-sua-bien-ban-kiem-ke-khay-sot',
    title: 'Chỉnh Sửa Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/huy-bien-ban-kiem-ke-khay-sot',
    title: 'Hủy Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/xem-bien-ban-kiem-ke-khay-sot',
    title: 'Xem Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/tao-bien-ban-kiem-ke-khay-sot',
    title: 'Tạo Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/chinh-sua-bien-ban-kiem-ke-khay-sot',
    title: 'Chỉnh Sửa Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/huy-bien-ban-kiem-ke-khay-sot',
    title: 'Hủy Biên Bản Kiểm Kê Khay Sọt',
    component: InventoryBasket,
  },
  {
    path: '/bao-cao-giao-dich-xuat-nhap',
    title: 'Báo Cáo chi tiết giao dịch xuất nhập',
    canDo: CODE.xemBCCTGDXN,
    canOn: SCREEN_CODE.BCCTGDXN,
    component: TransactionReport,
  },
  {
    path: 'tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemCBCCTGDXN,
    canOn: SCREEN_CODE.CBCCTGDXN,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path:
      '/bao-cao-giao-dich-xuat-nhap/tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemCBCCTGDXN,
    canOn: SCREEN_CODE.CBCCTGDXN,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path: '/bao-cao-chi-tiet-muon-cho-muon',
    title: 'Báo Cáo số lượng khay sọt mượn/ cho mượn',
    canDo: CODE.xemBCSLKSMCM,
    canOn: SCREEN_CODE.BCSLKSMCM,
    component: BorrowBasketReport,
  },
  {
    path:
      '/bao-cao-chi-tiet-muon-cho-muon/tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemCBCSLKSMCM,
    canOn: SCREEN_CODE.CBCSLKSMCM,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path: '/tinh-toan-bao-cao-ton-kho-vat-ly-khay-sot',
    title: 'Tính Toán Báo Cáo Tồn Kho Vật Lý Khay Sọt',
    canDo: CODE.xemCBCSLKSMCM,
    canOn: SCREEN_CODE.CBCSLKSMCM,
    component: HistoryPhysicalInventoryReport,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke',
    title: 'Danh Sách Biên Bản Kiểm Kê',
    canDo: CODE.xemDSBBKK,
    canOn: SCREEN_CODE.DSBBKK,
    component: ListBbkk,
  },
  {
    path: '/bao-cao-kiem-ke',
    title: 'Báo Cáo Kiểm Kê',
    canDo: CODE.xemBCCTKK,
    CanOn: SCREEN_CODE.BCCTKK,
    component: BasketStocktaking,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/xu-ly-sau-kiem-ke',
    title: 'Xử Lý Sau Kiểm Kê',
    component: PostprocessKK,
  },
  {
    path: '/xu-ly-sau-kiem-ke',
    title: 'Xử Lý Sau Kiểm Kê',
    component: PostprocessKK,
  },
  {
    path: '/dieu-chinh-bien-ban-kiem-ke-khay-sot',
    title: 'Điều chỉnh Kiểm Kê',
    component: AdjustStockTaking,
  },
  {
    path: '/danh-sach-bien-ban-kiem-ke/dieu-chinh-bien-ban-kiem-ke-khay-sot',
    title: 'Điều chỉnh Kiểm Kê',
    component: AdjustStockTaking,
  },
  {
    path: '/bao-cao-tan-suat-su-dung-khay-sot',
    title: 'Báo Cáo Tần Suất Sử Dụng Khay Sọt',
    component: BasketUsingFrequenceReport,
    canDo: CODE.xemBCTSSDKS,
    canOn: SCREEN_CODE.BCTSSDKS,
  },
  {
    path: '/xem-dieu-chinh-bien-ban-kiem-ke-khay-sot',
    title: 'Xem Điều chỉnh Kiểm Kê',
    component: AdjustStockTaking,
  },
  {
    path:
      '/danh-sach-bien-ban-kiem-ke/xem-dieu-chinh-bien-ban-kiem-ke-khay-sot',
    title: 'Điều chỉnh Kiểm Kê',
    component: AdjustStockTaking,
  },
  {
    path:
      '/bao-cao-tan-suat-su-dung-khay-sot/tinh-toan-bao-cao-tan-xuat-su-dung-khay-sot',
    title: 'Tính Toán Báo Cáo Tần Suất Sử Dụng Khay Sọt',
    component: BasketUsingFrequenceCalculation,
  },
  {
    path: '/tinh-toan-bao-cao-tan-xuat-su-dung-khay-sot',
    title: 'Tính Toán Báo Cáo Tần Suất Sử Dụng Khay Sọt',
    component: BasketUsingFrequenceCalculation,
  },
];
