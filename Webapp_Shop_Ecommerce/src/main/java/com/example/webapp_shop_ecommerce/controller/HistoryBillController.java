package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.dto.request.historybill.HistoryBillRequest;
import com.example.webapp_shop_ecommerce.entity.HistoryBill;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.service.IBaseService;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final IBaseService<HistoryBill, Long> baseService;
    @Autowired
    private IHistoryBillService HistoryBillService;
    @Autowired
    public HistoryBillController(IBaseService<HistoryBill, Long> baseService) {
        this.baseService = baseService;
    }


    @GetMapping
    public ResponseEntity<List<HistoryBillRequest>> findProductAll(){
        List<HistoryBillRequest> lst = new ArrayList<>();
        List<HistoryBill> lstPro = baseService.findAllDeletedFalse(Pageable.unpaged()).getContent();
        lst = lstPro.stream().map(entity -> mapper.map(entity, HistoryBillRequest.class)).collect(Collectors.toList());
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ResponseObject> saveProduct(@RequestBody HistoryBillRequest historyBillDto){
        return baseService.createNew(mapper.map(historyBillDto, HistoryBill.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id){
        System.out.println("Delete ID: " + id);
        return baseService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(@RequestBody HistoryBillRequest historyBillDto, @PathVariable("id") Long id){
        System.out.println("Update ID: " + id);
        HistoryBill historyBill = null;
        Optional<HistoryBill> otp = baseService.findById(id);
        if (otp.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("Fail", "Không Thấy ID", 1, historyBillDto), HttpStatus.BAD_REQUEST);
        }

        if (otp.isPresent()){
            historyBill = baseService.findById(id).orElseThrow(IllegalArgumentException::new);
            historyBill = mapper.map(historyBillDto, HistoryBill.class);
            historyBill.setId(id);
            return baseService.update(historyBill);
        }
        return new ResponseEntity<>(new ResponseObject("Fail", "Không Thế Update", 1, historyBillDto), HttpStatus.BAD_REQUEST);


    }
}
