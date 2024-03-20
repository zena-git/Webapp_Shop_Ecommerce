package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.config.VNPay;
import com.example.webapp_shop_ecommerce.dto.response.payment.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @GetMapping
    public ResponseEntity<?> payment(@RequestParam(name = "billAmount") Integer billAmount, @RequestParam(name = "vnp_OrderInfo") String vnp_OrderInfo, @RequestParam(name = "ordertype") String orderType) throws UnsupportedEncodingException {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";

            String vnp_TxnRef = VNPay.getRandomNumber(8);
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String vnp_IpAddr = VNPay.getIpAddress(request);
            String vnp_TmnCode = VNPay.vnp_TmnCode;

            int amount = billAmount * 100;

            Map vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_BankCode", "NCB");

            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");

            vnp_Params.put("vnp_ReturnUrl", VNPay.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));

            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());

            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            //Add Params of 2.1.0 Version
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            //Billing
//            vnp_Params.put("vnp_Bill_Mobile", req.getParameter("txt_billing_mobile"));
//            vnp_Params.put("vnp_Bill_Email", req.getParameter("txt_billing_email"));
//            String fullName = (req.getParameter("txt_billing_fullname")).trim();
//            if (fullName != null && !fullName.isEmpty()) {
//                int idx = fullName.indexOf(' ');
//                String firstName = fullName.substring(0, idx);
//                String lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
//                vnp_Params.put("vnp_Bill_FirstName", firstName);
//                vnp_Params.put("vnp_Bill_LastName", lastName);
//
//            }

//            vnp_Params.put("vnp_Bill_Address", req.getParameter("txt_inv_addr1"));
//            vnp_Params.put("vnp_Bill_City", req.getParameter("txt_bill_city"));
//            vnp_Params.put("vnp_Bill_Country", req.getParameter("txt_bill_country"));
//            if (req.getParameter("txt_bill_state") != null && !req.getParameter("txt_bill_state").isEmpty()) {
//                vnp_Params.put("vnp_Bill_State", req.getParameter("txt_bill_state"));
//            }

            // Invoice
//            vnp_Params.put("vnp_Inv_Phone", req.getParameter("txt_inv_mobile"));
//            vnp_Params.put("vnp_Inv_Email", req.getParameter("txt_inv_email"));
//            vnp_Params.put("vnp_Inv_Customer", req.getParameter("txt_inv_customer"));
//            vnp_Params.put("vnp_Inv_Address", req.getParameter("txt_inv_addr1"));
//            vnp_Params.put("vnp_Inv_Company", req.getParameter("txt_inv_company"));
//            vnp_Params.put("vnp_Inv_Taxcode", req.getParameter("txt_inv_taxcode"));
//            vnp_Params.put("vnp_Inv_Type", req.getParameter("cbo_inv_type"));
            //Build data to hash and querystring
            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = VNPay.hmacSHA512(VNPay.secretKey, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VNPay.vnp_PayUrl + "?" + queryUrl;

            PaymentResponse paymentResponse = new PaymentResponse("Ok", "Successfully", paymentUrl);


            return ResponseEntity.status(HttpStatus.OK).body(paymentResponse);
    }
}
