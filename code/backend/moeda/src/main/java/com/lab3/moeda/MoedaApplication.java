package com.lab3.moeda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.lab3.moeda"})
public class MoedaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoedaApplication.class, args);
        System.out.println("hello, world!");
	}
}
