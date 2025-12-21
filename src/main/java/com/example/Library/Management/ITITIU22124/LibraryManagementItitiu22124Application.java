package com.example.Library.Management.ITITIU22124;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class LibraryManagementItitiu22124Application {

	public static void main(String[] args) {
		SpringApplication.run(LibraryManagementItitiu22124Application.class, args);
	}

}
