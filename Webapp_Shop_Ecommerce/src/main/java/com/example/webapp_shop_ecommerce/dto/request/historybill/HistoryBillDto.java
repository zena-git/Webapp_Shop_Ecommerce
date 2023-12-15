package com.example.webapp_shop_ecommerce.dto.request.historybill;


import com.example.webapp_shop_ecommerce.dto.request.bill.BillDto;
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
public class HistoryBillDto {
    private Long id;
    private BillDto bill;
    private String describe;
}
