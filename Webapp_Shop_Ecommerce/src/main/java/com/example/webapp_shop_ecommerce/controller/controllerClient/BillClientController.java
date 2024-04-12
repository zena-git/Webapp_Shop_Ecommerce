package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillClientResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.service.IBillService;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/bill")
public class BillClientController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IBillService billService;
    @Autowired
    IHistoryBillService historyBillService;
    @GetMapping()
    public ResponseEntity<?> findAll(@RequestParam(value = "status", defaultValue = "") String status) {

        List<BillClientResponse> lst = billService.findBillByCustomerAndStatusAndStatusNot(status, TrangThaiBill.NEW.getLabel()).stream().map(entity -> mapper.map(entity, BillClientResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findObjById(@PathVariable("id") Long id) {
        Optional<Bill> otp = billService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        BillResponse bill = otp.map(pro -> mapper.map(pro, BillResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(bill, HttpStatus.OK);
    }
    @GetMapping("/codeBill/{code}")
    public ResponseEntity<?> findObjByCode(@PathVariable("code") String code) {
        Optional<Bill> otp = billService.findBillByCode(code);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy mã hóa đơn " + code, 1, null), HttpStatus.BAD_REQUEST);
        }
        BillClientResponse bill = otp.map(pro -> mapper.map(pro, BillClientResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(bill, HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<ResponseObject> saveBill(@RequestBody BillRequest billDto) throws UnsupportedEncodingException {
        return billService.buyBillClient(billDto);
    }

    @PostMapping("/guest")
    public ResponseEntity<ResponseObject> saveBillGuest(@RequestBody BillRequest billDto) throws UnsupportedEncodingException {
        return billService.buyBillClientGuest(billDto);
    }

    @DeleteMapping("/codeBill/{code}")
    public ResponseEntity<?> deleteBill(@PathVariable("code") String code) {
        Optional<Bill> otp = billService.findBillByCode(code);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy mã hóa đơn " + code, 1, null), HttpStatus.BAD_REQUEST);
        }
        Bill bill = otp.get();

        if (bill.getPaymentMethod().equals("1") && bill.getStatus().equalsIgnoreCase(TrangThaiBill.CHO_THANH_TOAN.getLabel())) {
            return new ResponseEntity<>(new ResponseObject("error", "Không thể hủy hóa đơn thanh tóoán chuyển khoản" + code, 1, code), HttpStatus.BAD_REQUEST);
        }
        bill.setStatus(TrangThaiBill.HUY.getLabel());
        billService.update(bill);
        historyBillService.addHistoryBill(bill, TrangThaiBill.HUY.getLabel(), "");
        return new ResponseEntity<>(new ResponseObject("success", "Đã hủy hóa đơn thành công " + code, 0, code), HttpStatus.OK);

    }
}
