/**
 * @description
 * Mã màn hình
 */
export const SCREEN_CODE = {
  BBGH: 'BBGH', // Biên bản giao hàng
  HOME: 'HOME', // Trang chủ

  IMPORT_FILE_1: 'IMPORT_FILE_1', // import file cân tổng
  IMPORT_STOCK: 'IMPORT_STOCK', // phiếu cân nhập kho
  DSCT: 'DSCT', // Danh sách cân tổng
  XNLSX: 'XNLSX', // Xác nhận tạo lệnh sản xuất

  PXK: 'PXK', // Phiếu xuất kho
  DLDC: 'DLDC', // Dữ Liệu Điều Chỉnh
  DLDCCCTT: 'DLDCCCTT', // Dữ Liệu Điều Chỉnh Chia Chọn Thực Tế

  PYCH: 'PYCH', // Phiếu Yêu Cầu Hủy
  PXBX: 'PXBX', // Phiếu yêu cầu bán xá

  CCDK: 'CCDK', // Chia chọn dự kiến
  DHNCC: 'DHNCC', // Đặt hàng NCC
  DSNCC: 'DSNCC', // Danh sách NCC (Master Data):
  BBGNHH: 'BBGNHH', // Danh sách biên bản giao nhận hàng hóa (BBGNHH)
  TTKS: 'TTKS', // thông tin khay sọt sau chia chọn thực tế
  DSCCTT: 'DSCCTT', // Xem danh sách dữ liệu deli
  DSGS: 'DSGS', // Danh sách giá sàn
  DSGDPD: 'DSGDPD', // Danh sách giá đã phê duyệt
  BCDUSLDH: 'BCDUSLDH', // Báo cáo đáp ứng sản lượng đặt hàng
  QLND: 'QLND', // Quản lý người dùng

  DSDBSL: 'DSDBSL', // Danh sách DBSL

  DSKHSL: 'DSKHSL', // Danh sách Kế hoạch sản lượng

  DSBCSX: 'DSBCSX', // Danh sách báo cáo sản xuất
  TTBCSX: 'TTBCSX', // Tính toán báo cáo sản xuất

  DSSLBTP: 'DSSLBTP', // Danh sách SL BTP thực tế
  DSLSSLBTP: 'DSLSSLBTP', // Danh sách lịch sử phân bổ

  QLK: 'QLK', // Quản lý kho
  KHTH: 'KHTH', // Kế hoạch thu hoạch
  PXKS: 'PXKS', // Phiếu xuất khay sọt
  MASTERKS: 'MASTERKS', // Danh sách Master khay sọt
  DSPNKS: 'DSPNKS', // Danh sách phiếu nhập khay sọt
  PRINTABLE: 'PRINTABLE', // Màn hình sử dụng chức năng in và in lại

  PNKS: 'PNKS', // Phiếu nhập khay sọt
  PXNKSSH: 'PXNKSSH', // Danh sách phiếu xuất/nhập khay sọt sở hữu

  QLKKS: 'QLKKS', // Danh sách quản lý kho khay sọt

  DSBCTKKS: 'DSBCTKKS', // Báo cáo tồn kho khay sọt
  DSLSBCTKKS: 'DSLSBCTKKS', // Tính toán báo cáo tồn kho vật lý
  BCXTLXHKS: 'BCXTLXHKS', // Báo cáo tình trạng xuất thanh lý xuất hủy khay sọt
  BCKSDD: 'BCKSDD', // Báo cáo khay sọt đi đường
  BCCTGDXN: 'BCCTGDXN', // Báo cáo chi tiết giao dịch xuất nhập
  CBCCTGDXN: 'CBCCTGDXN', // Chạy báo cáo chi tiết giao dịch xuất nhập
  BCSLKSMCM: 'BCSLKSMCM', // báo cáo khay sọt mượn/cho mượn
  CBCSLKSMCM: 'CBCSLKSMCM', // Chạy Báo cáo số lượng khay sọt mượn cho mượn

  DSBBKK: 'DSBBKK', // Danh sách biên bản kiểm kê
  BCCTKK: 'BCCTKK', // Xem báo cáo chi tiết kiểm kê

  BCTSSDKS: 'BCCTKK', // Báo cáo tần suất sử dụng khay sọt

  PXCM: 'PXCM', // Phiếu xuất chuyển mã
};

export const CODE = {
  // BBGH
  taoBBGH: 'CC0001C', // Tạo BBGH
  suaBBGH: 'CC0001U', // Chỉnh sửa BBGH
  xemBBGH: 'CC0001R', // Xem BBGH
  xoaBBGH: 'CC0001D', // Xóa BBGH

  // Phiếu yêu cầu bán xá
  xemPXBX: 'CC0130R', // Xem PXBX
  taoPXBX: 'CC0130C', // Tạo PXBX
  suaPXBX: 'CC0130U', // Chỉnh sửa PXBX
  xoaPXBX: 'CC0130D', // Xóa PXBX
  duyetPXBX: 'CC0131U', // Duyệt PXBX
  duyetLaiPXBX: 'CC0132U', // Duyệt lại PXBX

  // Danh sách giá sàn
  xemDSGS: 'CC0140C',
  taoGS: 'CC0141C',

  // Danh Danh sách giá đã phê duyệt
  xemDSGDPD: 'CC0090R',
  taoGDPD: 'CC0090C',

  // others
  suaTiepNhan: 'CC0002U', // Chỉnh sửa tiếp nhận
  taoPCNK: 'CC0003C', // Tạo mới PCNK
  suaPCNK: 'CC0003U', // Chỉnh sửa PCNK
  xemPCNK: 'CC0003R', // Xem PCNK
  xoaPCNK: 'CC0003D', // Xóa PCNK
  taoTTCT: 'CC0040C', // ĐK thông tin cân tổng
  xemTTCT: 'CC0040R', // Xem thông tin cân tổng
  suaTTCT: 'CC0040U', // Edit thông tin cân tổng
  taoLSX: 'CC0041C', // Xác nhận dữ liệu tạo LSX
  xemLSX: 'CC0041R', // Xem danh sách lệnh sản xuất
  taoPXK: 'CC0050C', // Tạo mới phiếu xuất kho
  suaPXK: 'CC0050U', // Chỉnh sửa PXK
  xemPXK: 'CC0050R', // Xem PXK
  xoaPXK: 'CC0050D', // Xóa PXK
  xemApproverList: 'CC0061U', // Xem danh sách Approver Danh sách phiếu huỷ
  xemDLDC: 'CC0070R', // Xem Dữ Liệu Điều Chỉnh
  taoUser: 'ID0001C', // Thêm mới user
  suaUser: 'ID0001U', // Chỉnh sửa user
  xemUser: 'ID0001R', // Xem danh sách user
  xoaUser: 'ID0001D', // Xóa user
  taoRole: 'ID0002C', // Thêm mới role
  suaRole: 'ID0002U', // Chỉnh sửa role
  xemRole: 'ID0002R', // Xem danh sách role
  xoaRole: 'ID0002D', // Xóa role
  taoCTDP: 'CP0040C', // Import thông tin cân tổng điều phối
  suaCTDP: 'CP0040U', // Update thông tin cân tổng điều phối
  xemCTDP: 'CP0040R', // Xem thông tin cân tổng điều phối
  xoaCTDP: 'CP0040D', // Xóa thông tin cân tổng điều phối

  taoYCH: 'CC0060C', // Tạo phiếu yêu cầu hủy
  xemYCH: 'CC0060R', // Xem phiếu yêu cầu hủy
  suaYCH: 'CC0060U', // Sửa phiếu yêu cầu hủy
  xoaYCH: 'CC0060D', // Xóa phiếu yêu cầu hủy
  pheDuyetYCH: 'CC0061U', // Phê duyệt phiếu yêu cầu hủy
  pheDuyetLaiYCH: 'CC0062U', // Phê duyệt lại phiếu yêu cầu hủy

  // PYCH Khay sot
  taoYCHKS: 'CC0240C', // Tạo phiếu yêu cầu hủy thanh lý hủy khay sọt
  xemYCHKS: 'CC0240R', // Xem phiếu yêu cầu hủy
  suaYCHKS: 'CC0240U', // Sửa phiếu yêu cầu hủy
  xoaYCHKS: 'CC0240D', // Xóa phiếu yêu cầu hủy
  pheDuyetYCHKS: 'CC0241U', // Phê duyệt phiếu yêu cầu hủy
  pheDuyetLaiYCHKS: 'CC0242U', // Phê duyệt lại phiếu yêu cầu hủy

  taoCCDK: 'CP0050C', // Upload chia chọn dự kiến
  xemCCDK: 'CP0050R', // Xem chia chọn dự kiến
  xemDHNCC: 'CP0060R', // Xem dữ liệu đặt hàng Nhà Cung Cấp
  suaDHNCC: 'CP0060U', // Import dữ liệu đặt hàng Nhà Cung Cấp
  suaMailNCC: 'CP0061U', // Gửi mail cho Nhà Cung Cấp
  // Dữ Liệu Điều Chỉnh Chia Chọn Thực Tế
  xemDLDCCCTT: 'CC0080R', // Xem danh sách dữ liệu điều chỉnh chia chọn thực tế
  suaDLDCCCTT: 'CC0080C', // Sửa danh sách dữ liệu điều chỉnh chia chọn thực tế
  // Chia chọn thực tế
  xemCCTT: 'CC0160R',
  // thông tin khay sọt sau chia chọn thực tế
  taoTTKS: 'CC0200C', // Đăng kí thông tin khay sọt sau chia chọn thực tế

  // Trang chủ
  read: 'read', // local
  // Danh sách NCC (Master Data):
  xemDSNCC: 'RP0010R', // Xem danh sách NCC
  taoNCC: 'RP0010C', // Tạo mới NCC
  suaNCC: 'RP0010U', // Chỉnh sửa NCC
  xoaNCC: 'RP0010D', //  Xóa NCC
  // Danh sách biên bản giao nhận hàng hóa (BBGNHH)
  xemBBGNHH: 'CC0100R', // Xem danh sách biên bản giao nhận hàng hóa.
  taoBBGNHH: 'CC0100C', // Tạo BBGNHH
  suaBBGNHH: 'CC0100U', // Chỉnh sủa BBGNHH
  xoaBBGNHH: 'CC0100D', // Xóa BBGNHH
  // báo cáo
  xemBCDUSLDH: 'CC0150R', // Xem danh sách báo cáo đáp ứng sản lượng đặt hàng.

  xemDSDBSL: 'FE0010R', // Xem danh sách DBSL

  // Kế hoạch sản lượng
  xemDSKHSL: 'FE0020R', // Xem danh sách kế hoạch sản lượng
  taoDSKHSL: 'FE0020C', // Tạo/Import kế hoạch sản lượng

  // Báo cáo sản xuất
  xemBCSX: 'RA0030R', // Xem báo cáo sản xuất,
  taoBCSX: 'RA0030C', // Tạo/chạy báo cáo sản xuất

  // Báo cáo SL BTP thực tế
  xemDSSLBTP: 'RA0020R',
  chayBCSLBTP: 'RA0010C',
  xemDSLSSLBTP: 'RA0020C',

  // Quản lý kho
  kiemkeSP: 'CC0171C', // kKiểm kê kho
  danhgiaSP: 'CC0170C', // Đánh giá sản phẩm QLK
  themSP: 'CC0172C', // Thêm sản phẩm QLK
  //  Kế hoạch thu hoạch
  xemKHTH: 'FE0030R',
  taoKHTH: 'FE0030C',
  suaKHTH: 'FE0030U',

  // Danh sách phiếu nhập khay sọt
  xemDSPNKS: 'CC0220R',
  suaDSPNKS: 'CC0220U',
  xoaDSPNKS: 'CC0220D',
  taoDSPNKS: 'CC0220C',

  // Danh sách biên bản kiểm kê
  xemDSBBKK: 'CC0310R',
  suaDSBBKK: 'CC0310U',
  xoaDSBBKK: 'CC0310D',
  taoDSBBKK: 'CC0310C',
  huyDSBBKK: 'CC0311U',
  dieuChinhDSBBKK: 'CC0320C',
  xemDieuChinhDSBBKK: 'CC0320R',
  xlSauKKDSBBKK: 'CC0312U',
  xoaKKDSBBKK: 'CC0313D',
  suaKKDSBBKK: 'CC0313U',

  // Danh sách phiếu xuất khay sọt
  xemPXKS: 'CC0230R', // Xem PXKS
  suaPXKS: 'CC0230U', // Chỉnh sửa PXKS
  taoPXKS: 'CC0230C', // Tạo mới PXKS
  xoaPXKS: 'CC0230D', // Xóa PXKS
  inLai: 'CC0250R', // in lại PXKS, PNKS
  xacnhanPXKS: 'CC0290U', // xác nhận phiếu xuất khay sọt

  xemMasterKS: 'CC0210R', // Xem thông tin master khay sọt
  xoaMasterKS: 'CC0210D', // Xóa Master khay sọt

  backdatePNKS: 'CC0260U', // Backdate Phiếu nhập khay sọt

  xemPXNKSSH: 'CC0300R', // Xem Danh sách phiếu xuất/nhập khay sọt sở hữu
  taoPXNKSSH: 'CC0221C', // tao phiếu xuất/nhập khay sọt sở hữu
  // taoPXNKSSH: 'CC0300C', // tao phiếu xuất/nhập khay sọt sở hữu
  xemQLKKS: 'CC0270R', // Danh sách quản lý kho khay sot
  kiemkeKKS: 'CC0270U', // Kiểm kê kho khay sot

  // Báo cáo tồn kho vật lý khay sọt
  xemDSBCTKKS: 'RA0040R',
  xemDSLSBCTKKS: 'RA0040C',

  // Báo cáo tình trạng xuất thanh lý xuất hủy khay sọt
  xemBCXTLXHKS: 'RA0050R',
  // Chạy Báo cáo tình trạng xuất thanh lý xuất hủy khay sọt
  chayBCXTLXHKS: 'RA0050C',
  // Báo khay sọt đi đường
  xemBCKSDD: 'RA0060R',
  // Chạy Báo khay sọt đi đường
  chayBCKSDD: 'RA0060C',
  // Báo cáo chi tiết giao dịch xuất nhập
  xemBCCTGDXN: 'RA0080R',
  xemCBCCTGDXN: 'RA0080C',
  // Báo cáo số lượng khay sọt mượn cho mượn
  xemBCSLKSMCM: 'RA0070R',
  xemCBCSLKSMCM: 'RA0070C',
  // Báo cáo chi tiết kiểm kê
  xemBCCTKK: 'RA0090R',

  // Báo cáo tần suất sử dụng khay sọt
  xemBCTSSDKS: 'RA0100R',
  chayBCTSSDKS: 'RA0100C',
  dongboSAPBCTSSDKS: 'RA0101C',

  // Phiếu xuất chuyển mã
  taoPXCM: 'CC0051C',
  xoaPXCM: 'CC0051D',
  xemPXCM: 'CC0051R',
  suaPXCM: 'CC0051U',
  backdatePXCM: 'CC0052U',
};

export const CAN_CODE = {
  // BBGH
  [CODE.taoBBGH]: SCREEN_CODE.BBGH, // Tạo BBGH
  [CODE.suaBBGH]: SCREEN_CODE.BBGH, // Chỉnh sửa BBGH
  [CODE.xemBBGH]: SCREEN_CODE.BBGH, // Xem BBGH
  [CODE.xoaBBGH]: SCREEN_CODE.BBGH, // Xóa BBGH

  // Phiếu yêu cầu bán xá
  [CODE.xemPXBX]: SCREEN_CODE.PXBX,
  [CODE.taoPXBX]: SCREEN_CODE.PXBX,
  [CODE.suaPXBX]: SCREEN_CODE.PXBX,
  [CODE.xoaPXBX]: SCREEN_CODE.PXBX,
  [CODE.duyetPXBX]: SCREEN_CODE.PXBX,
  [CODE.duyetLaiPXBX]: SCREEN_CODE.PXBX,

  // Danh sách giá sàn
  [CODE.xemDSGS]: SCREEN_CODE.DSGS,
  [CODE.taoGS]: SCREEN_CODE.DSGS,

  // Danh sách giá sàn
  [CODE.xemDSGDPD]: SCREEN_CODE.DSGDPD,
  [CODE.taoGDPD]: SCREEN_CODE.DSGDPD,

  // others
  [CODE.suaTiepNhan]: SCREEN_CODE.BBGH, // Chỉnh sửa tiếp nhận
  [CODE.taoPCNK]: SCREEN_CODE.IMPORT_STOCK, // Tạo mới PCNK
  [CODE.suaPCNK]: SCREEN_CODE.IMPORT_STOCK, // Chỉnh sửa PCNK
  [CODE.xemPCNK]: 'CC0003R', // Xem PCNK
  [CODE.xoaPCNK]: SCREEN_CODE.IMPORT_STOCK, // Xóa PCNK
  [CODE.taoUser]: SCREEN_CODE.QLND, // Thêm mới user
  [CODE.suaUser]: SCREEN_CODE.QLND, // Chỉnh sửa user
  [CODE.xemUser]: 'ID0001R', // Xem danh sách user
  [CODE.xoaUser]: 'ID0001D', // Xóa user
  [CODE.taoRole]: 'ID0002C', // Thêm mới role
  [CODE.suaRole]: 'ID0002U', // Chỉnh sửa role
  [CODE.xemRole]: 'ID0002R', // Xem danh sách role
  [CODE.xoaRole]: 'ID0002D', // Xóa role
  [CODE.taoCTDP]: SCREEN_CODE.IMPORT_FILE_1, // Import thông tin cân tổng điều phối
  [CODE.suaCTDP]: SCREEN_CODE.IMPORT_FILE_1, // Update thông tin cân tổng điều phối
  [CODE.xemCTDP]: 'CP0040R', // Xem thông tin cân tổng điều phối
  [CODE.xoaCTDP]: 'CP0040D', // Xóa thông tin cân tổng điều phối
  // Phiếu YCH
  [CODE.taoYCH]: SCREEN_CODE.PYCH, // Tạo phiếu yêu cầu hủy
  [CODE.xemYCH]: SCREEN_CODE.PYCH, // Xem phiếu yêu cầu hủy
  [CODE.suaYCH]: SCREEN_CODE.PYCH, // Sửa phiếu yêu cầu hủy
  [CODE.xoaYCH]: SCREEN_CODE.PYCH, // Xóa phiếu yêu cầu hủy
  [CODE.pheDuyetYCH]: SCREEN_CODE.PYCH, // Phê duyệt phiếu yêu cầu hủy
  [CODE.pheDuyetLaiYCH]: SCREEN_CODE.PYCH, // Phê duyệt lại phiếu yêu cầu hủy
  // Phiếu YCH Khay sọt
  [CODE.taoYCHKS]: SCREEN_CODE.PYCH, // Tạo phiếu yêu cầu hủy khay sọt
  [CODE.xemYCHKS]: SCREEN_CODE.PYCH, // Xem phiếu yêu cầu hủy khay sọt
  [CODE.suaYCHKS]: SCREEN_CODE.PYCH, // Sửa phiếu yêu cầu hủy khay sọt
  [CODE.xoaYCHKS]: SCREEN_CODE.PYCH, // Xóa phiếu yêu cầu hủy khay sọt
  [CODE.pheDuyetYCHKS]: SCREEN_CODE.PYCH, // Phê duyệt phiếu yêu cầu hủy khay sọt
  [CODE.pheDuyetLaiYCHKS]: SCREEN_CODE.PYCH, // Phê duyệt lại phiếu yêu cầu hủy khay sọt
  // DSCT
  [CODE.taoTTCT]: SCREEN_CODE.DSCT, // Xem danh sách cân tổng
  [CODE.xemTTCT]: SCREEN_CODE.DSCT, // Xem danh sách cân tổng
  [CODE.suaTTCT]: SCREEN_CODE.DSCT, // Sửa danh sách cân tổng
  // Xác nhận LSX
  [CODE.taoLSX]: SCREEN_CODE.XNLSX, // Xác nhận tạo lệnh sản xuất
  [CODE.xemLSX]: SCREEN_CODE.XNLSX, // Xem danh sách lệnh sản xuất
  // Dữ Liệu Điều Chỉnh
  [CODE.xemDLDC]: SCREEN_CODE.DLDC, // Xem danh sách dữ liệu điều chỉnh
  // Dữ Liệu Điều Chỉnh Chia Chọn Thực Tế
  [CODE.xemDLDCCCTT]: SCREEN_CODE.DLDCCCTT, // Xem danh sách dữ liệu điều chỉnh chia chọn thực tế
  [CODE.suaDLDCCCTT]: SCREEN_CODE.DLDCCCTT, // Chỉnh sửa dữ liệu điều chỉnh chia chọn thực tế
  // Phiếu xuất kho
  [CODE.taoPXK]: SCREEN_CODE.PXK, // Tạo Phiếu Xuất Kho
  [CODE.xemPXK]: SCREEN_CODE.PXK, // Xem Phiếu Xuất Kho
  [CODE.suaPXK]: SCREEN_CODE.PXK, // Sửa Phiếu Xuất Kho
  [CODE.xoaPXK]: SCREEN_CODE.PXK, // Xóa Phiếu Xuất Kho
  // Chia chọn dự kiến
  [CODE.taoCCDK]: SCREEN_CODE.CCDK, // Upload chia chọn dự kiến
  [CODE.xemCCDK]: SCREEN_CODE.CCDK, // Xem chia chọn dự kiến
  // Đặt hàng Nhà Cung Cấp
  [CODE.xemDHNCC]: SCREEN_CODE.DHNCC, // Xem dữ liệu đặt hàng NCC
  [CODE.suaDHNCC]: SCREEN_CODE.DHNCC, // Import dữ liệu đặt hàng NCC
  [CODE.suaMailNCC]: SCREEN_CODE.DHNCC, // Gửi mail cho NCC
  // Danh sách NCC (Master Data):
  [CODE.xemDSNCC]: SCREEN_CODE.DSNCC, // Xem danh sách NCC
  [CODE.taoNCC]: SCREEN_CODE.DSNCC, // Tạo mới NCC
  [CODE.suaNCC]: SCREEN_CODE.DSNCC, // Chỉnh sửa NCC
  [CODE.xoaNCC]: SCREEN_CODE.DSNCC, //  Xóa NCC
  // Danh sách biên bản giao nhận hàng hóa (BBGNHH)
  [CODE.xemBBGNHH]: SCREEN_CODE.BBGNHH, // Xem danh sách biên bản giao nhận hàng hóa.
  [CODE.taoBBGNHH]: SCREEN_CODE.BBGNHH, // Tạo BBGNHH
  [CODE.suaBBGNHH]: SCREEN_CODE.BBGNHH, // Chỉnh sủa BBGNHH
  [CODE.xoaBBGNHH]: SCREEN_CODE.BBGNHH, // Xóa BBGNHH
  // thông tin khay sọt sau chia chọn thực tế
  [CODE.taoTTKS]: SCREEN_CODE.TTKS, // Đăng kí thông tin khay sọt sau chia chọn thực tế
  [CODE.xemCCTT]: SCREEN_CODE.DSCCTT, // Xem chia chọn thực tế trên màn hình danh sách
  [CODE.xemBCDUSLDH]: SCREEN_CODE.BCDUSLDH, // Xem danh sách báo cáo đáp ứng sản lượng đặt hàng.

  // Dự báo sản lượng
  [CODE.xemDSDBSL]: SCREEN_CODE.DSDBSL, // Xem danh sách DBSL

  // Kế hoạch sản lượng
  [CODE.xemDSKHSL]: SCREEN_CODE.DSKHSL, // Xem danh sách Kế hoạch sản lượng
  [CODE.taoDSKHSL]: SCREEN_CODE.DSKHSL, // tạo/import sách Kế hoạch sản lượng

  // Báo cáo sản xuất
  [CODE.xemBCSX]: SCREEN_CODE.DSBCSX, // Xem báo cáo sản xuất
  [CODE.taoBCSX]: SCREEN_CODE.TTBCSX, // Tạo/Chạy báo cáo sản xuất

  // Báo cáo SL BTP thực tế
  [CODE.xemDSSLBTP]: SCREEN_CODE.DSSLBTP, // Xem danh sách SL BTP thực tế
  [CODE.xemDSLSSLBTP]: SCREEN_CODE.DSLSSLBTP, // Xem danh sách lịch sử SL BTP
  [CODE.chayBCSLBTP]: SCREEN_CODE.DSLSSLBTP, // Chạy report SL BTP thực tế

  // Quản lý kho
  [CODE.kiemkeSP]: SCREEN_CODE.QLK, // Kiểm kê kho
  [CODE.danhgiaSP]: SCREEN_CODE.QLK, // Đánh giá sản phẩm
  [CODE.themSP]: SCREEN_CODE.QLK, // Thêm sản phẩm
  // Kế hoạch thu hoạch
  [CODE.xemKHTH]: SCREEN_CODE.KHTH,
  [CODE.taoKHTH]: SCREEN_CODE.KHTH,
  [CODE.suaKHTH]: SCREEN_CODE.KHTH,
  // Trang chủ
  read: 'HOME', // local

  // Danh sách biên bản kiểm kê
  [CODE.xemDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.suaDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.taoDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.huyDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.dieuChinhDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.xemDieuChinhDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.xlSauKKDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.xoaDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.xoaKKDSBBKK]: SCREEN_CODE.DSBBKK,
  [CODE.suaKKDSBBKK]: SCREEN_CODE.DSBBKK,

  // Danh sách phiếu nhập khay sọt
  [CODE.xemDSPNKS]: SCREEN_CODE.DSPNKS,
  [CODE.suaDSPNKS]: SCREEN_CODE.DSPNKS,
  [CODE.xoaDSPNKS]: SCREEN_CODE.DSPNKS,
  [CODE.taoDSPNKS]: SCREEN_CODE.DSPNKS,

  // Phiếu xuất khay sọt
  [CODE.xemPXKS]: SCREEN_CODE.PXKS,
  [CODE.suaPXKS]: SCREEN_CODE.PXKS,
  [CODE.xoaPXKS]: SCREEN_CODE.PXKS,
  [CODE.taoPXKS]: SCREEN_CODE.PXKS,
  [CODE.xacnhanPXKS]: SCREEN_CODE.PXKS,

  [CODE.inLai]: SCREEN_CODE.PRINTABLE,

  // Master khay sọt
  [CODE.xemMasterKS]: SCREEN_CODE.MASTERKS, // Xem Master khay sọt
  [CODE.xoaMasterKS]: SCREEN_CODE.MASTERKS, // Xoá Master khay sọt

  [CODE.backdatePNKS]: SCREEN_CODE.PNKS, // backdate Phiếu nhập khay sọt
  [CODE.backdatePNKS]: SCREEN_CODE.PXKS, // backdate Phiếu nhập khay sọt

  [CODE.xemPXNKSSH]: SCREEN_CODE.PXNKSSH, // xem Danh sách phiếu xuất/nhập khay sọt sở hữu
  [CODE.taoPXNKSSH]: SCREEN_CODE.PXNKSSH, // xem Danh sách phiếu xuất/nhập khay sọt sở hữu

  [CODE.xemQLKKS]: SCREEN_CODE.QLKKS, // Danh sách quản lý kho khay sot
  [CODE.kiemkeKKS]: SCREEN_CODE.QLKKS, // Danh sách quản lý kho khay sot

  // Báo cáo tồn kho vật lý khay sọt
  [CODE.xemDSBCTKKS]: SCREEN_CODE.DSBCTKKS, // Xem danh sách SL BTP thực tế
  [CODE.xemDSLSBCTKKS]: SCREEN_CODE.DSLSBCTKKS, // Xem danh sách lịch sử SL BTP

  // Báo cáo tình trạng xuất thanh lý, xuất hủy khay sọt
  [CODE.xemBCXTLXHKS]: SCREEN_CODE.BCXTLXHKS,
  // Báo cáo tình trạng xuất thanh lý, xuất hủy khay sọt
  [CODE.chayBCXTLXHKS]: SCREEN_CODE.BCXTLXHKS,
  // Báo cáo khay sọt đi đường
  [CODE.xemBCKSDD]: SCREEN_CODE.BCKSDD,
  // Chạy báo cáo khay sọt đi đường
  [CODE.chayBCKSDD]: SCREEN_CODE.BCKSDD,
  // Báo cáo chi tiết giao dịch xuất nhập
  [CODE.xemBCCTGDXN]: SCREEN_CODE.BCCTGDXN, // xem danh sách báo cáo giao dịch xuất nhập
  [CODE.xemCBCCTGDXN]: SCREEN_CODE.CBCCTGDXN, // chạy báo cáo giao dịch xuất nhập
  // Báo cáo số lượng khay sọt mượn cho mượn
  [CODE.xemBCSLKSMCM]: SCREEN_CODE.BCSLKSMCM, // xem danh sách báo cáo mượn cho mượn
  [CODE.xemCBCSLKSMCM]: SCREEN_CODE.CBCSLKSMCM, // chạy báo cáo mượn cho mượn
  // Báo cáo chi tiết kiểm kê
  [CODE.xemBCCTKK]: SCREEN_CODE.BCCTKK, // xem báo cáo chi tiết kiểm kê

  [CODE.xemBCTSSDKS]: SCREEN_CODE.BCTSSDKS, // Xem báo cáo tần suất sử dụng khay sọt
  [CODE.chayBCTSSDKS]: SCREEN_CODE.BCTSSDKS, // Xem báo cáo tần suất sử dụng khay sọt
  [CODE.dongboSAPBCTSSDKS]: SCREEN_CODE.BCTSSDKS, // Đồng bộ SAP báo cáo tần suất sử dụng khay sọt

  // Phiếu xuất chuyển mã
  [CODE.xemPXCM]: SCREEN_CODE.PXCM,
  [CODE.taoPXCM]: SCREEN_CODE.PXCM,
  [CODE.xoaPXCM]: SCREEN_CODE.PXCM,
  [CODE.suaPXCM]: SCREEN_CODE.PXCM,
  [CODE.backdatePXCM]: SCREEN_CODE.PXCM,
};
