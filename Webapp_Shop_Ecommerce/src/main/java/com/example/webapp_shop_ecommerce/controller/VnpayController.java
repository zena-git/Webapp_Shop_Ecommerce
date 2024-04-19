package com.example.webapp_shop_ecommerce.controller;

import com.example.webapp_shop_ecommerce.config.VnpayConfig;
import com.example.webapp_shop_ecommerce.dto.request.payment.PaymentRequest;
import com.example.webapp_shop_ecommerce.dto.request.payment.QuerydrRequest;
import com.example.webapp_shop_ecommerce.dto.request.payment.RefundRequest;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.dto.response.payment.PaymentResponse;
import com.example.webapp_shop_ecommerce.entity.Bill;
import com.example.webapp_shop_ecommerce.entity.PaymentHistory;
import com.example.webapp_shop_ecommerce.infrastructure.enums.BillType;
import com.example.webapp_shop_ecommerce.infrastructure.enums.TrangThaiBill;
import com.example.webapp_shop_ecommerce.repositories.IBillRepository;
import com.example.webapp_shop_ecommerce.service.IBillService;
import com.example.webapp_shop_ecommerce.service.IHistoryBillService;
import com.example.webapp_shop_ecommerce.service.IPaymentHistoryService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.persistence.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;
@RestController
@RequestMapping("/api/v1/payment")
public class VnpayController {
    @Autowired
    IBillRepository billRepo;
    @Autowired
    IPaymentHistoryService paymentHistoryService;
    @Autowired
    IBillService billService;

    @Autowired
    IHistoryBillService  historyBillService;
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) throws UnsupportedEncodingException {

        Optional<Bill> optionalBill = billRepo.findBillByCode(request.getCodeBill());
        if (optionalBill.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, request.getCodeBill()), HttpStatus.BAD_REQUEST);
        }
        Bill bill = optionalBill.get();
        Integer amount = bill.getIntoMoney().intValue()*100;
        String bankCode = request.getBankCode();

        String vnp_TxnRef = bill.getCodeBill();
        String vnp_IpAddr = VnpayConfig.getIpAddress();

        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnpayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnpayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan hoa don: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", VnpayConfig.orderType);

        String locate = request.getLanguage();
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", request.getReturnUrl()+"/paymentIPN");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

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
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl =VnpayConfig.vnp_PayUrl + "?" + queryUrl;

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setCode("00");
        paymentResponse.setMessage("Success");
        paymentResponse.setData(paymentUrl);

        return new ResponseEntity<>(new ResponseObject("success", "success", 1, paymentUrl), HttpStatus.OK);

    }

    @GetMapping("/refund")
    public ResponseEntity<?> vnpayRefund(
            @RequestParam("vnp_Amount") String amounts,
            @RequestParam("vnp_TxnRef") String vnp_TxnRef,
            @RequestParam("vnp_PayDate") String vnp_TransactionDate,
            @RequestParam("vnp_CardType") String vnp_TransactionType

    ) throws IOException {
        //Command: refund
        String vnp_RequestId = VnpayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "refund";
        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;
        long amount = Integer.parseInt(amounts)*100;
        String vnp_Amount = String.valueOf(amount);
        String vnp_OrderInfo = "Hoan tien GD OrderId:" + vnp_TxnRef;
        String vnp_TransactionNo = ""; //Assuming value of the parameter "vnp_TransactionNo" does not exist on your system.
        String vnp_CreateBy = "admin";

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        String vnp_IpAddr = VnpayConfig.getIpAddress();

        JsonObject  vnp_Params = new JsonObject ();

        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TransactionType", vnp_TransactionType);
        vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.addProperty("vnp_Amount", vnp_Amount);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);

        if(vnp_TransactionNo != null && !vnp_TransactionNo.isEmpty())
        {
            vnp_Params.addProperty("vnp_TransactionNo", "{get value of vnp_TransactionNo}");
        }

        vnp_Params.addProperty("vnp_TransactionDate", vnp_TransactionDate);
        vnp_Params.addProperty("vnp_CreateBy", vnp_CreateBy);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

        String hash_Data= String.join("|", vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode,
                vnp_TransactionType, vnp_TxnRef, vnp_Amount, vnp_TransactionNo, vnp_TransactionDate,
                vnp_CreateBy, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hash_Data.toString());

        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        URL url = new URL (VnpayConfig.vnp_ApiUrl);
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(vnp_Params.toString());
        wr.flush();
        wr.close();
        int responseCode = con.getResponseCode();
        System.out.println("nSending 'POST' request to URL : " + url);
        System.out.println("Post Data : " + vnp_Params);
        System.out.println("Response Code : " + responseCode);
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String output;
        StringBuffer response = new StringBuffer();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();
        System.out.println(response.toString());

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }


    @PostMapping("/querydr")
    public ResponseEntity<?> vnpayQuery(@RequestBody QuerydrRequest request) throws IOException {

        if (!"00".equalsIgnoreCase(request.getVnpResponseCode())){
            return new ResponseEntity<>(new ResponseObject("error", "Giao Dich Không Thành Công", 1, request.getVnpTxnRef()), HttpStatus.BAD_REQUEST);
        }

        Optional<Bill> optionalBill = billRepo.findBillByCode(request.getVnpTxnRef());
        if (optionalBill.isEmpty()){
            return new ResponseEntity<>(new ResponseObject("error", "Không Tìm Thấy Hóa Đơn", 1, request.getVnpTxnRef()), HttpStatus.BAD_REQUEST);
        }
        Bill bill = optionalBill.get();

        String vnp_RequestId = VnpayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "querydr";
        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;
        String vnp_OrderInfo = "Kiem tra ket qua GD hoa don: " + request.getVnpTxnRef();
        //String vnp_TransactionNo = req.getParameter("transactionNo");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        String vnp_IpAddr = VnpayConfig.getIpAddress();

        JsonObject vnp_Params = new JsonObject ();

        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TxnRef", request.getVnpTxnRef());
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionNo", request.getTransactionNo());
        vnp_Params.addProperty("vnp_TransactionDate", request.getVnpPayDate());
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

        String hash_Data= String.join("|", vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode, request.getVnpTxnRef(), request.getVnpPayDate(), vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hash_Data.toString());

        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        URL url = new URL (VnpayConfig.vnp_ApiUrl);
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(vnp_Params.toString());
        wr.flush();
        wr.close();
        int responseCode = con.getResponseCode();
        System.out.println("nSending 'POST' request to URL : " + url);
        System.out.println("Post Data : " + vnp_Params);
        System.out.println("Response Code : " + responseCode);
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String output;
        StringBuffer response = new StringBuffer();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();
        String responseString = response.toString();
        System.out.println("Ket Qua : " + responseString);
        JsonObject jsonResponse = JsonParser.parseString(responseString).getAsJsonObject();
        String vnp_ResponseCode = jsonResponse.get("vnp_ResponseCode").getAsString();
        String vnp_Message = jsonResponse.get("vnp_Message").getAsString();

        if("00".equalsIgnoreCase(vnp_ResponseCode) && !bill.getStatus().equalsIgnoreCase(TrangThaiBill.HOAN_THANH.getLabel())) {

            String vnp_TransactionNo = jsonResponse.get("vnp_TransactionNo").getAsString();
            String vnp_PayDate = jsonResponse.get("vnp_PayDate").getAsString();
            String description = jsonResponse.get("vnp_OrderInfo").getAsString();

            PaymentHistory paymentHistory = new PaymentHistory();
            paymentHistory.setBill(bill);
            paymentHistory.setDescription(description);
            paymentHistory.setPaymentMethod("1");
            paymentHistory.setPaymentDate(LocalDateTime.now());
            paymentHistory.setType("0");
            paymentHistory.setStatus("0");
            paymentHistory.setPaymentAmount(bill.getIntoMoney());
            paymentHistory.setTradingCode(vnp_TransactionNo);
            paymentHistory.setDeleted(false);

            // Định nghĩa định dạng cho chuỗi ngày giờ
            DateTimeFormatter formatters = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            // Phân tích chuỗi thành LocalDateTime
            LocalDateTime paymentDate = LocalDateTime.parse(vnp_PayDate, formatters);
            paymentHistory.setPaymentDate(paymentDate);
            if (bill.getBillType().equalsIgnoreCase(BillType.OFFLINE.getLabel())){
                bill.setStatus(TrangThaiBill.HOAN_THANH.getLabel());
            }else {
                bill.setStatus(TrangThaiBill.DA_XAC_NHAN.getLabel());
            }
            billService.update(bill);
            paymentHistoryService.createNew(paymentHistory);

            historyBillService.addHistoryBill(bill,TrangThaiBill.DA_THANH_TOAN.getLabel(), "");
            if (bill.getBillType().equalsIgnoreCase(BillType.ONLINE.getLabel())){
                historyBillService.addHistoryBill(bill,TrangThaiBill.DA_XAC_NHAN.getLabel(), "");
            }
            System.out.println("Thanh Toans Ok");
            return new ResponseEntity<>(new ResponseObject("success", vnp_Message, Integer.parseInt(vnp_ResponseCode), jsonResponse.toString()), HttpStatus.OK);
        }else {
            System.out.println("Thanh Toans Fail");
            return new ResponseEntity<>(new ResponseObject("fail", vnp_Message, Integer.parseInt(vnp_ResponseCode), jsonResponse.toString()), HttpStatus.BAD_REQUEST);
        }

    }

}
