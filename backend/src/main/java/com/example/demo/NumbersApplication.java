package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * What happens when it gets loaded?
 * 
 * Spring Boot will run ALL CommandLineRunner beans once the application context
 * is loaded.
 * 
 * This runner will request a copy of the EmployeeRepository you just created.
 * 
 * Using it, it will create two entities and store them.
 */
@SpringBootApplication
public class NumbersApplication {

	public static void main(String[] args) {
		SpringApplication.run(NumbersApplication.class, args);
	}

}
