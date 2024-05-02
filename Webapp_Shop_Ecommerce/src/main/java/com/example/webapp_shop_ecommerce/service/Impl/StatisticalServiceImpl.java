package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.response.statistical.*;
import com.example.webapp_shop_ecommerce.repositories.IStatisticalRepository;
import com.example.webapp_shop_ecommerce.service.IStatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class StatisticalServiceImpl implements IStatisticalService {
    @Autowired
    IStatisticalRepository statisticalRepo;
    @Override
    public ResponseEntity<?> findTopSale(LocalDateTime  startDate, LocalDateTime endDate) {
        Duration duration = Duration.between(startDate, endDate);
        long days = duration.toDays();

        List<ToppSaleResponse> resultList = new ArrayList<>();

        if (days < 14) {
            // Lặp qua từng ngày nếu giãn cách ngày nhỏ hơn 14
            for (LocalDateTime date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
                List<TopSaleReponse> dailyResult = statisticalRepo.getTopSaleDay(date, date.plusDays(1));
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(dailyResult);
                t.setTime(date.toString().split("T")[0]);
                resultList.add(t);
            }
        } else if (days >= 14 && days <= 56) {
            // Lặp qua từng tháng nếu giãn cách ngày từ 14 đến 56
            LocalDateTime endDateOfWeek = startDate.plusDays(7);
            while (endDateOfWeek.isBefore(endDate) || endDateOfWeek.isEqual(endDate)) {
                List<TopSaleReponse> weeklyResult = statisticalRepo.getTopSaleDay(startDate, endDateOfWeek);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(weeklyResult);
                t.setTime("Tuần " + startDate.get(WeekFields.ISO.weekOfWeekBasedYear()));
                resultList.add(t);

                startDate = endDateOfWeek.plusDays(1);
                endDateOfWeek = startDate.plusDays(7);
            }
            // Xử lý tuần cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                List<TopSaleReponse> lastWeeklyResult = statisticalRepo.getTopSaleDay(startDate, endDate);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(lastWeeklyResult);
                t.setTime("Tuần " + startDate.get(WeekFields.ISO.weekOfWeekBasedYear()));
                resultList.add(t);
            }
        } else if (days > 56 && days < 730) {
            // Lặp qua từng tháng nếu giãn cách ngày lớn hơn 56
            LocalDateTime endOfMonth = startDate.plusMonths(1).withDayOfMonth(1).minusDays(1);
            while (endOfMonth.isBefore(endDate) || endOfMonth.isEqual(endDate)) {
                List<TopSaleReponse> monthlyResult = statisticalRepo.getTopSaleDay(startDate, endOfMonth);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(monthlyResult);
                t.setTime(endOfMonth.getMonth().toString() + " " + endOfMonth.getYear());
                resultList.add(t);

                startDate = endOfMonth.plusDays(1);
                endOfMonth = startDate.plusMonths(1).withDayOfMonth(1).minusDays(1);
            }
            // Xử lý tháng cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                List<TopSaleReponse> lastMonthlyResult = statisticalRepo.getTopSaleDay(startDate, endDate);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(lastMonthlyResult);
                t.setTime(endDate.getMonth().toString() + " " + endDate.getYear());
                resultList.add(t);
            }
        }else {
            // Lặp qua từng năm nếu giãn cách ngày lớn hơn 730
            LocalDateTime endOfYear = startDate.plusYears(1).withDayOfYear(1).minusDays(1);
            while (endOfYear.isBefore(endDate) || endOfYear.isEqual(endDate)) {
                List<TopSaleReponse> yearlyResult = statisticalRepo.getTopSaleDay(startDate, endOfYear);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(yearlyResult);
                t.setTime(String.valueOf(endOfYear.getYear()));
                resultList.add(t);

                startDate = endOfYear.plusDays(1);
                endOfYear = startDate.plusYears(1).withDayOfYear(1).minusDays(1);
            }
            // Xử lý năm cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                List<TopSaleReponse> lastYearlyResult = statisticalRepo.getTopSaleDay(startDate, endDate);
                ToppSaleResponse t = new ToppSaleResponse();
                t.setProduct(lastYearlyResult);
                t.setTime(String.valueOf(endDate.getYear()));
                resultList.add(t);
            }
        }
        return new ResponseEntity<>(resultList, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllStatistical(LocalDateTime startDate, LocalDateTime endDate) {
        Duration duration = Duration.between(startDate, endDate);
        long days = duration.toDays();

        List<RevenueResponse> resultList = new ArrayList<>();

        if (days < 14) {
            // Lặp qua từng ngày nếu giãn cách ngày nhỏ hơn 14
            for (LocalDateTime date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
                StatisticalReponse dailyResult = statisticalRepo.getAllStatistical(date, date.plusDays(1));
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(dailyResult.getRevenue());
                r.setCompletedOrders(dailyResult.getCompletedOrders());
                r.setTime(date.toString().split("T")[0]);
                resultList.add(r);
            }
        } else if (days >= 14 && days <= 56) {
            // Lặp qua từng tháng nếu giãn cách ngày từ 14 đến 56
            LocalDateTime endDateOfWeek = startDate.plusDays(7);
            while (endDateOfWeek.isBefore(endDate) || endDateOfWeek.isEqual(endDate)) {
                StatisticalReponse weeklyResult = statisticalRepo.getAllStatistical(startDate, endDateOfWeek);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(weeklyResult.getRevenue());
                r.setCompletedOrders(weeklyResult.getCompletedOrders());
                r.setTime("Tuần " + startDate.get(WeekFields.ISO.weekOfWeekBasedYear()));
                resultList.add(r);

                startDate = endDateOfWeek.plusDays(1);
                endDateOfWeek = startDate.plusDays(7);
            }
            // Xử lý tuần cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                StatisticalReponse lastWeeklyResult = statisticalRepo.getAllStatistical(startDate, endDate);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(lastWeeklyResult.getRevenue());
                r.setCompletedOrders(lastWeeklyResult.getCompletedOrders());
                r.setTime("Tuần " + startDate.get(WeekFields.ISO.weekOfWeekBasedYear()));
                resultList.add(r);
            }
        } else if (days > 56 && days < 730) {
            // Lặp qua từng tháng nếu giãn cách ngày lớn hơn 56
            LocalDateTime endOfMonth = startDate.plusMonths(1).withDayOfMonth(1).minusDays(1);
            while (endOfMonth.isBefore(endDate) || endOfMonth.isEqual(endDate)) {
                StatisticalReponse monthlyResult = statisticalRepo.getAllStatistical(startDate, endOfMonth);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(monthlyResult.getRevenue());
                r.setCompletedOrders(monthlyResult.getCompletedOrders());
                r.setTime(endOfMonth.getMonth().toString() + " " + endOfMonth.getYear());
                resultList.add(r);

                startDate = endOfMonth.plusDays(1);
                endOfMonth = startDate.plusMonths(1).withDayOfMonth(1).minusDays(1);
            }
            // Xử lý tháng cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                StatisticalReponse lastMonthlyResult = statisticalRepo.getAllStatistical(startDate, endDate);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(lastMonthlyResult.getRevenue());
                r.setCompletedOrders(lastMonthlyResult.getCompletedOrders());
                r.setTime(endOfMonth.getMonth().toString() + " " + endOfMonth.getYear());
                resultList.add(r);
            }
        }else {
            // Lặp qua từng năm nếu giãn cách ngày lớn hơn 730
            LocalDateTime endOfYear = startDate.plusYears(1).withDayOfYear(1).minusDays(1);
            while (endOfYear.isBefore(endDate) || endOfYear.isEqual(endDate)) {
                StatisticalReponse yearlyResult = statisticalRepo.getAllStatistical(startDate, endOfYear);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(yearlyResult.getRevenue());
                r.setCompletedOrders(yearlyResult.getCompletedOrders());
                r.setTime(String.valueOf(endOfYear.getYear()));
                resultList.add(r);

                startDate = endOfYear.plusDays(1);
                endOfYear = startDate.plusYears(1).withDayOfYear(1).minusDays(1);
            }
            // Xử lý năm cuối cùng nếu cần
            if (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
                StatisticalReponse lastYearlyResult = statisticalRepo.getAllStatistical(startDate, endDate);
                RevenueResponse r = new RevenueResponse();
                r.setRevenue(lastYearlyResult.getRevenue());
                r.setCompletedOrders(lastYearlyResult.getCompletedOrders());
                r.setTime(String.valueOf(endOfYear.getYear()));
                resultList.add(r);
            }
        }
        return new ResponseEntity<>(resultList, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getLastMonthStatistical() {
        List<StatisticalReponse> lst = statisticalRepo.getLastMonthStatistical();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getBeforeLastMonthStatistical() {
        List<StatisticalReponse> lst = statisticalRepo.getBeforeLastMonthStatistical();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getLastWeekStatistical() {
        List<StatisticalReponse> lst = statisticalRepo.getLastWeekStatistical();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getBeforeLastWeekStatistical() {
        List<StatisticalReponse> lst = statisticalRepo.getBeforeLastWeekStatistical();
        return new ResponseEntity<>(lst, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getTop5ProductSelling(LocalDateTime startDate, LocalDateTime endDate) {
        return new ResponseEntity<>(statisticalRepo.getTop5ProductSelling(startDate, endDate), HttpStatus.OK);
    }
}
