package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadDatabase {

        private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

        @Bean
        CommandLineRunner initDatabase(EmployeeRepository repository) {

                return args -> {
                        log.info("Preloading " + repository
                                        .save(new Employee("Bilbo", "Baggins", "burglar", "93", "848595895")));
                        log.info("Preloading " + repository
                                        .save(new Employee("Frodo", "Baggins", "thief", "998", "72827282")));
                        log.info(
                                        "Preloading " + repository.save(new Employee("Samwise", "Gamgee", "gardener",
                                                        "94", "123456789")));
                        log.info(
                                        "Preloading " + repository.save(new Employee("Gandalf", "the Grey", "wizard",
                                                        "61", "987654321")));
                        log.info(
                                        "Preloading " + repository.save(new Employee("Legolas", "Greenleaf", "archer",
                                                        "673", "456789123")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Aragorn", "", "ranger", "1", "555555555")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Gimli", "", "warrior", "673", "111111111")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Boromir", "", "captain", "51", "777777777")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Meriadoc", "Brandybuck", "squire", "51",
                                                        "888888888")));
                        log.info("Preloading " + repository
                                        .save(new Employee("Peregrin", "Took", "squire", "52", "666666666")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Faramir", "", "captain", "53", "333333333")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Éomer", "", "marshal", "55", "222222222")));
                        log.info("Preloading " + repository
                                        .save(new Employee("Éowyn", "", "shieldmaiden", "54", "999999999")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Arwen", "Evenstar", "elf", "86", "444444444")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Théoden", "", "king", "86", "555555555")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Saruman", "the White", "wizard", "56",
                                                        "123123123")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Sauron", "", "dark lord", "55", "666666666")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Galadriel", "", "elf", "54", "777777777")));
                        log.info("Preloading "
                                        + repository.save(new Employee("Gollum", "", "creature", "1", "888888888")));
                        log.info(
                                        "Preloading " + repository.save(new Employee("Tom", "Bombadil", "mysterious",
                                                        "255", "555555555")));
                };

        }
}