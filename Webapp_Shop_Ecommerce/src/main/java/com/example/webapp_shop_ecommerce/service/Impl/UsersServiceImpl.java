package com.example.webapp_shop_ecommerce.service.Impl;

import com.example.webapp_shop_ecommerce.dto.request.User.UserRequest;
import com.example.webapp_shop_ecommerce.dto.request.mail.MailInputDTO;
import com.example.webapp_shop_ecommerce.dto.response.ResponseObject;
import com.example.webapp_shop_ecommerce.entity.Users;
import com.example.webapp_shop_ecommerce.infrastructure.enums.Roles;
import com.example.webapp_shop_ecommerce.repositories.IUsersRepository;
import com.example.webapp_shop_ecommerce.service.IClientService;
import com.example.webapp_shop_ecommerce.service.IUsersService;
import com.example.webapp_shop_ecommerce.ultiltes.RandomStringGenerator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class UsersServiceImpl extends BaseServiceImpl<Users, Long, IUsersRepository> implements IUsersService {
    @Autowired
    private IClientService mailClientService;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private RandomStringGenerator randomStringGenerator;
    @Override
    public List<Users> findAllByDeletedAll() {
        return repository.findAllByDeletedAll(Roles.STAFF);
    }

    @Override
    public ResponseEntity<?> save(UserRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            return new ResponseEntity<>(new ResponseObject("error", "Email đã có trong hệ thống. Hãy sử dụng email khác", 1, request), HttpStatus.BAD_REQUEST);
        }
        if (repository.existsByPhone(request.getPhone())) {
            return new ResponseEntity<>(new ResponseObject("error", "Số điện thoại đã có trong hệ thống. Hãy sử dụng số điện thoại khác", 1, request), HttpStatus.BAD_REQUEST);
        }

        String password = randomStringGenerator.generateRandomString(6);
        CompletableFuture<ResponseEntity<?>> saveTask = CompletableFuture.supplyAsync(() -> {
            Users entity = new Users();
            entity = mapper.map(request, Users.class);
            entity.setUsersRole(Roles.STAFF);
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            entity.setPassword(passwordEncoder.encode(password));
            createNew(entity);
            return new ResponseEntity<>(new ResponseObject("success","Thêm Mới Thành công",0, request), HttpStatus.OK);
        });

        // Khi tiến trình lưu dữ liệu hoàn thành, thực hiện gửi email
        saveTask.thenAccept(resultEntity -> {
            if (resultEntity.getStatusCode() == HttpStatus.OK) {
                CompletableFuture.runAsync(() -> {
                    if (request.getEmail() != null) {
                        MailInputDTO mailInput = new MailInputDTO();
                        mailInput.setEmail(request.getEmail());
                        mailInput.setPassword(password);
                        mailInput.setName(request.getFullName());
                        mailClientService.create(mailInput);
                    }
                });
            }
        });
        return saveTask.join();
    }
}
