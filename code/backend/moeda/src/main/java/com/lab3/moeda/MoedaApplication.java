package com.lab3.moeda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.lab3.moeda"})
@EnableAsync
@EnableScheduling
public class MoedaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoedaApplication.class, args);
        System.out.println("hello, world!");
	}
}
