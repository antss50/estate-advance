    package com.javaweb.api.admin;

    import com.javaweb.constant.SystemConstant;
    import com.javaweb.exception.MyException;
    import com.javaweb.model.dto.PasswordDTO;
    import com.javaweb.model.dto.StaffDTO;
    import com.javaweb.model.dto.UserDTO;
    import com.javaweb.service.IUserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.Collections;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/user")
    public class UserAPI {

        @Autowired
        private IUserService userService;

        @PostMapping
        public ResponseEntity<UserDTO> createUsers(@RequestBody UserDTO newUser) {
            return ResponseEntity.ok(userService.insert(newUser));
        }

        @GetMapping("/staffs")
        public ResponseEntity<List<StaffDTO>> getStaffs() {
            try {
                List<StaffDTO> staffList = userService.getStaff();
                return ResponseEntity.ok(staffList);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateUsers(@PathVariable("id") long id, @RequestBody UserDTO userDTO) {
            try {
                return ResponseEntity.ok(userService.update(id, userDTO));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
            }
        }

        @PutMapping("/staffs/{id}")
        public ResponseEntity<?> updateStaff(@PathVariable("id") long id, @RequestBody StaffDTO staffDTO) {
            try {
                return ResponseEntity.ok(userService.updateStaff(id, staffDTO));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
            }
        }

        @PutMapping("/change-password/{id}")
        public ResponseEntity<String> changePasswordUser(@PathVariable("id") long id, @RequestBody PasswordDTO passwordDTO) {
            try {
                userService.updatePassword(id, passwordDTO);
                return ResponseEntity.ok(SystemConstant.UPDATE_SUCCESS);
            } catch (MyException e) {
                //LOGGER.error(e.getMessage());
                return ResponseEntity.ok(e.getMessage());
            }
        }

        @PutMapping("/password/{id}/reset")
        public ResponseEntity<UserDTO> resetPassword(@PathVariable("id") long id) {
            return ResponseEntity.ok(userService.resetPassword(id));
        }

        @PutMapping("/profile/{username}")
        public ResponseEntity<UserDTO> updateProfileOfUser(@PathVariable("username") String username, @RequestBody UserDTO userDTO) {
            return ResponseEntity.ok(userService.updateProfileOfUser(username, userDTO));
        }

        @DeleteMapping
        public ResponseEntity<Void> deleteUsers(@RequestBody long[] idList) {
            if (idList.length > 0) {
                userService.delete(idList);
            }
            return ResponseEntity.noContent().build();
        }
    }
