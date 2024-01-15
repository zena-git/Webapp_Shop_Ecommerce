package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.historybill.HistoryBillRequest;
import com.example.webapp_shop_ecommerce.dto.response.historybill.HistoryBillResponse;
import com.example.webapp_shop_ecommerce.dto.response.products.ProductResponse;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Product;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/historyBill")
public class HistoryBillController {
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IHistoryBillService historyBillService;

    @GetMapping
    public ResponseEntity<?> findProductAll(@RequestParam(value = "page", defaultValue = "-1") Integer page,
                                            @RequestParam(value = "size", defaultValue = "-1") Integer size){
        Pageable pageable = Pageable.unpaged();
        if (size < 0) {
            size = 5;
        }
        if (page >= 0) {
            pageable = PageRequest.of(page, size);
        }
        System.out.println("page=" + page + " size=" + size);
        List<HistoryBill> lstPro = historyBillService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        List<HistoryBillResponse> resultDto = lstPro.stream().map(entity -> mapper.map(entity, HistoryBillResponse.class)).collect(Collectors.toList());
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findHistoryBillById(@PathVariable("id") Long id) {
        Optional<HistoryBill> otp = historyBillService.findById(id);
        if (otp.isEmpty()) {
            return new ResponseEntity<>(new ResponseObject("Fail", "Không tìm thấy id " + id, 1, null), HttpStatus.BAD_REQUEST);
        }
        HistoryBillResponse historyBill = otp.map(pro -> mapper.map(pro, HistoryBillResponse.class)).orElseThrow(IllegalArgumentException::new);
        return new ResponseEntity<>(historyBill, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody HistoryBillRequest historyBillDto){
        return historyBillService.createNew(mapper.map(historyBillDto, HistoryBill.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return historyBillService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody HistoryBillRequest historyBillDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        HistoryBill historyBill = null;
        Optional<HistoryBill> otp = historyBillService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, historyBillDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            historyBill = historyBillService.findById(id).orElseThrow(IllegalArgumentException::new);
            historyBill = mapper.map(historyBillDto, HistoryBill.class);
            historyBill.setId(id);
            return historyBillService.update(historyBill);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, historyBillDto), HttpStatus.BAD_REQUEST);


    }
}
