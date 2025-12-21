package com.example.Library.Management.ITITIU22124.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role; // USER or ADMIN
    // Note: password is NOT included for security
}
