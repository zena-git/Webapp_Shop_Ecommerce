package com.example.webapp_shop_ecommerce.dto.response.historybill;


import com.example.webapp_shop_ecommerce.dto.response.bill.BillResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class HistoryBillResponse {
    private Long id;
//    private BillResponse bill;
    private String type;

    private String description;
    private LocalDateTime createdDate;
    private String createdBy;

}
