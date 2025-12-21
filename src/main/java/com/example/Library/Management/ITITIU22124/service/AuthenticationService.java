package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.dto.AuthenticationRequest;
import com.example.Library.Management.ITITIU22124.dto.AuthenticationResponse;
import com.example.Library.Management.ITITIU22124.dto.RefreshTokenRequest;
import com.example.Library.Management.ITITIU22124.dto.RegisterRequest;
import com.example.Library.Management.ITITIU22124.exception.BadRequestException;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.model.UserRole;
import com.example.Library.Management.ITITIU22124.repository.UserRepository;
import com.example.Library.Management.ITITIU22124.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                // Check if user already exists
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new BadRequestException("Email already registered");
                }

                // Create new user with encrypted password
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(UserRole.USER)
                                .build();

                userRepository.save(user);

                // Generate tokens
                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                return AuthenticationResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .userId(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                } catch (BadCredentialsException e) {
                        throw new BadRequestException("Invalid email or password");
                }

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                return AuthenticationResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .userId(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .build();
        }

        public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
                String refreshToken = request.getRefreshToken();
                String userEmail = jwtService.extractUsername(refreshToken);

                if (userEmail == null) {
                        throw new BadRequestException("Invalid refresh token");
                }

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                if (!jwtService.isTokenValid(refreshToken, user)) {
                        throw new BadRequestException("Refresh token is expired or invalid");
                }

                String newAccessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);

                return AuthenticationResponse.builder()
                                .accessToken(newAccessToken)
                                .refreshToken(newRefreshToken)
                                .userId(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .build();
        }
}
