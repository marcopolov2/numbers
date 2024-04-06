package com.example.demo;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for managing employees, using HAL and HATEOAS (Hypermedia as the
 * Engine of Application State)
 * This API provides CRUD operations for managing employee data.
 * Tech: Spring MVC + Spring HATEOAS app with HAL representations of each
 * resource.
 */

@CrossOrigin(origins = "*") // Allow requests from any origin
@RestController
class EmployeeController {

    private final EmployeeRepository repository;

    private final EmployeeModelAssembler assembler;

    EmployeeController(EmployeeRepository repository, EmployeeModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    // Aggregate root
    @GetMapping("/employees")
    CollectionModel<EntityModel<Employee>> all() {

        List<EntityModel<Employee>> employees = repository.findAll().stream() //
                .map(assembler::toModel) //
                .collect(Collectors.toList());

        return CollectionModel.of(employees, linkTo(methodOn(EmployeeController.class).all()).withSelfRel());
    }

    // get
    @GetMapping("/employees/{id}")
    EntityModel<Employee> one(@PathVariable Long id) {

        Employee employee = repository.findById(id) //
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        return assembler.toModel(employee);
    }

    // create
    @PostMapping("/employees")
    ResponseEntity<?> newEmployee(@RequestBody Employee newEmployee) {

        EntityModel<Employee> entityModel = assembler.toModel(repository.save(newEmployee));

        return ResponseEntity //
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    // put
    @PutMapping("/employees/{id}")
    ResponseEntity<?> replaceEmployee(@RequestBody Employee newEmployee, @PathVariable Long id) {
        try {
            Employee updatedEmployee = repository.findById(id) //
                    .map(employee -> {
                        employee.setName(newEmployee.getName());
                        employee.setSurname(newEmployee.getSurname());
                        employee.setPhoneCode(newEmployee.getPhoneCode());
                        employee.setPhoneNumber(newEmployee.getPhoneNumber());
                        return repository.save(employee);
                    }) //
                    .orElseGet(() -> {
                        newEmployee.setId(id);
                        return repository.save(newEmployee);
                    });

            EntityModel<Employee> entityModel = assembler.toModel(updatedEmployee);

            return ResponseEntity //
                    .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                    .body(entityModel);
        } catch (Exception ex) {
            // Handle any exceptions that might occur during the update process
            return ResponseEntity //
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) //
                    .body("An error occurred while updating the employee: " + ex.getMessage());
        }
    }

    // delete
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        Optional<Employee> optionalEmployee = repository.findById(id);
        if (optionalEmployee.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body("Employee with ID " + id + " deleted successfully");
        } else {
            // Employee with the given ID was not found
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/employees/v2")
    CollectionModel<EntityModel<Employee>> getAdvancedAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String field,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "1") int page) {

        // Variables to hold search, sort, and pagination results
        List<Employee> employees;
        Page<Employee> employeePage;

        // Search logic
        if (search != null && !search.isEmpty()) {
            employees = repository.findAll().stream()
                    .filter(employee -> employee.getName().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getSurname().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getPhoneCode().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getPhoneNumber().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        } else {
            employees = repository.findAll();
        }

        // Sorting logic
        if (field != null && !field.isEmpty()) {
            employees.sort((emp1, emp2) -> {
                int result;
                switch (field) {
                    case "name":
                        result = emp1.getName().compareTo(emp2.getName());
                        break;
                    case "surname":
                        result = emp1.getSurname().compareTo(emp2.getSurname());
                        break;
                    case "phoneCode":
                        // Convert phone codes to integers for numerical comparison
                        int phoneCode1 = Integer.parseInt(emp1.getPhoneCode());
                        int phoneCode2 = Integer.parseInt(emp2.getPhoneCode());
                        result = Integer.compare(phoneCode1, phoneCode2);
                        break;
                    case "phoneNumber":
                        result = emp1.getPhoneNumber().compareTo(emp2.getPhoneNumber());
                        break;
                    default:
                        result = 0;
                        break;
                }
                return direction.equalsIgnoreCase("ASC") ? result : -result;
            });
        }

        // Pagination logic
        int adjustedPage = Math.max(page, 1) - 1; // Ensure page is at least 1 before subtracting 1
        int startIndex = adjustedPage * size;
        int endIndex = Math.min(startIndex + size, employees.size());
        employeePage = new PageImpl<>(employees.subList(startIndex, endIndex),
                PageRequest.of(adjustedPage, size), employees.size());

        // Recalculate total users based on the new size
        int totalUsers = employees.size();

        List<EntityModel<Employee>> employeeModels = employeePage.getContent().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        // Add pagination links
        Link selfLink = linkTo(
                methodOn(EmployeeController.class).getAdvancedAllEmployees(search, field, direction, size, page))
                .withSelfRel();
        Link nextLink = linkTo(
                methodOn(EmployeeController.class).getAdvancedAllEmployees(search, field, direction, size, page + 1))
                .withRel("next");
        Link prevLink = linkTo(
                methodOn(EmployeeController.class).getAdvancedAllEmployees(search, field, direction, size,
                        Math.max(page - 1, 1))) // Adjusted to ensure it's at least 1
                .withRel("prev");
        Link lastLink = linkTo(
                methodOn(EmployeeController.class).getAdvancedAllEmployees(search, field, direction, size,
                        employeePage.getTotalPages()))
                .withRel("last");

        Link t = Link.of(String.valueOf(totalUsers)).withRel("totalUsers");

        // Create a CollectionModel and add root information and employee models
        return CollectionModel.of(employeeModels, selfLink, nextLink, prevLink, lastLink, t);

    }

}
