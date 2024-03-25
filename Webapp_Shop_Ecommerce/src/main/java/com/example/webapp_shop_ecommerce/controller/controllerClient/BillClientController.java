package com.example.webapp_shop_ecommerce.controller.controllerClient;

import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.address.AddressResponse;
import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import com.example.webapp_shop_ecommerce.entity.Address;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.service.IBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping()
    public ResponseEntity<?> findAll() {
        List<BillResponse> lst = billService.findBillByCustomer().stream().map(entity -> mapper.map(entity, BillResponse.class)).collect(Collectors.toList());
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
    @PostMapping()
    public ResponseEntity<ResponseObject> saveBill(@RequestBody BillRequest billDto){
        return billService.buyBillClient(billDto);
    }

    @PostMapping("/guest")
    public ResponseEntity<ResponseObject> saveBillGuest(@RequestBody BillRequest billDto){
        return billService.buyBillClientGuest(billDto);
    }
}