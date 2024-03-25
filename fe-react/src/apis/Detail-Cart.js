import axiosIns from "../plugin/axios"

const listProductOnCart = (idKH) => axiosIns.get(`/gio-hang-chi-tiet/view-all/${idKH}`);
// const addProductOnCart = (idSp, { addGHCT }) => axiosIns.post(`/gio-hang-chi-tiet/add/${idSp}`, { addGHCT });
const addProductOnCart = (idKH, idCtsp, soLuong) => axiosIns.post(`/gio-hang-chi-tiet/add/${idKH}`, { idCtsp, soLuong });
const upadteProductOnCart = (idSp, idGh, soLuong) =>
  axiosIns.put(`/gio-hang-chi-tiet/update/${idSp}/${idGh}`, { soLuong });
const deleteProductOnCart = (idGHCT) => axiosIns.delete(`/gio-hang-chi-tiet/delete/${idGHCT}`);
// Add Bill
const postAddBillAddBill = (idKH, tongTien, kieuHoaDon, trangThai) =>
  axiosIns.post('/hoa-don/add', { idKH, tongTien, kieuHoaDon, trangThai });
const postAddBillNoAccount = (tongTien, kieuHoaDon, trangThai) =>
  axiosIns.post('/hoa-don/add', { tongTien, kieuHoaDon, trangThai });

const postAddDirectClient = (idHd, newHDCT) => axiosIns.post(`/gio-hang-chi-tiet/add-to-hdct/${idHd}`, newHDCT);
const updateCartClient = (idHdct, idCtsp, soLuong) =>
  axiosIns.put(`/gio-hang-chi-tiet/update-product/${idHdct}`, {
    idCtsp,
    soLuong,
  });
export {
  postAddDirectClient,
  listProductOnCart,
  postAddBillAddBill,
  deleteProductOnCart,
  addProductOnCart,
  upadteProductOnCart,
  updateCartClient,
  postAddBillNoAccount,
};
