package com.substring.auth.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class StartupInfoRunner implements CommandLineRunner {

    private final Environment env;
    private final Logger logger = LoggerFactory.getLogger(StartupInfoRunner.class);

    public StartupInfoRunner(Environment env) {
        this.env = env;
    }

    @Override
    public void run(String... args) {
        String[] active = env.getActiveProfiles();
        if (active == null || active.length == 0) {
            active = env.getDefaultProfiles();
        }

        logger.info("Active Spring profiles: {}", Arrays.toString(active));

        String datasourceUrl = env.getProperty("spring.datasource.url");
        String datasourceUser = env.getProperty("spring.datasource.username");
        String jwtSecret = env.getProperty("security.jwt.secret");

        logger.info("Resolved spring.datasource.url={}", datasourceUrl);
        logger.info("Resolved spring.datasource.username={}", datasourceUser);
        logger.info("Resolved security.jwt.secret present={}", jwtSecret != null && !jwtSecret.isBlank());
    }
}

