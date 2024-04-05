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
            log.info("Preloading " + repository.save(new Employee("Bilbo", "Baggins", "burglar", "27", "848595895")));
            log.info("Preloading " + repository.save(new Employee("Frodo", "Baggins", "thief", "421", "72827282")));
            log.info(
                    "Preloading " + repository.save(new Employee("Samwise", "Gamgee", "gardener", "321", "123456789")));
            log.info(
                    "Preloading " + repository.save(new Employee("Gandalf", "the Grey", "wizard", "999", "987654321")));
            log.info(
                    "Preloading " + repository.save(new Employee("Legolas", "Greenleaf", "archer", "23", "456789123")));
            log.info("Preloading " + repository.save(new Employee("Aragorn", "", "ranger", "1", "555555555")));
            log.info("Preloading " + repository.save(new Employee("Gimli", "", "warrior", "10", "111111111")));
            log.info("Preloading " + repository.save(new Employee("Boromir", "", "captain", "30", "777777777")));
            log.info("Preloading "
                    + repository.save(new Employee("Meriadoc", "Brandybuck", "squire", "38", "888888888")));
            log.info("Preloading " + repository.save(new Employee("Peregrin", "Took", "squire", "32", "666666666")));
            log.info("Preloading " + repository.save(new Employee("Faramir", "", "captain", "29", "333333333")));
            log.info("Preloading " + repository.save(new Employee("Éomer", "", "marshal", "50", "222222222")));
            log.info("Preloading " + repository.save(new Employee("Éowyn", "", "shieldmaiden", "49", "999999999")));
            log.info("Preloading " + repository.save(new Employee("Arwen", "Evenstar", "elf", "54", "444444444")));
            log.info("Preloading " + repository.save(new Employee("Théoden", "", "king", "55", "555555555")));
            log.info("Preloading "
                    + repository.save(new Employee("Saruman", "the White", "wizard", "998", "123123123")));
            log.info("Preloading " + repository.save(new Employee("Sauron", "", "dark lord", "666", "666666666")));
            log.info("Preloading " + repository.save(new Employee("Galadriel", "", "elf", "37", "777777777")));
            log.info("Preloading " + repository.save(new Employee("Gollum", "", "creature", "999", "888888888")));
            log.info(
                    "Preloading " + repository.save(new Employee("Tom", "Bombadil", "mysterious", "456", "555555555")));
        };

    }
}