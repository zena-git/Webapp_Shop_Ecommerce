package com.example.webapp_shop_ecommerce.dto.request.historybill;


import com.example.webapp_shop_ecommerce.dto.request.bill.BillRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    private String type;
    @NotBlank(message = "Ghi chú không được để trống")
    @Size(min = 20, message = "Tối thiểu phải 20 kí tự.")
    @Size(max = 200, message = "Tối đa 200 kí tự.")
    private String description;
}
