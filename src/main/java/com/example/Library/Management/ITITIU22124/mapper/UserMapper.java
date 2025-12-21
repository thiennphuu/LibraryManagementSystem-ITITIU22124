package com.example.Library.Management.ITITIU22124.mapper;

import com.example.Library.Management.ITITIU22124.dto.UserDTO;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.model.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name()); // Convert enum to String
        // Password is NOT included for security

        return dto;
    }

    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(UserRole.valueOf(dto.getRole())); // Convert String to enum
        // Password must be set separately

        return user;
    }
}
