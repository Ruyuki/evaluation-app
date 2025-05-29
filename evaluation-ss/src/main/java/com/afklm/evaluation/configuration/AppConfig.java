package com.afklm.evaluation.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@Configuration
// Enable serialization of Pageable spring data objects
@EnableSpringDataWebSupport(
    pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO
)
public class AppConfig {

}
