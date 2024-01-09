package com.example.webapp_shop_ecommerce.dto.request.historybill;


import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class HistoryBillRequest {
    private Long id;
    private BillRequest bill;
    private String describe;
}
