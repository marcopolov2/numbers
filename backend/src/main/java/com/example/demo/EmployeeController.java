package com.example.demo;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
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

    // update
    @PutMapping("/employees/{id}")
    ResponseEntity<?> replaceEmployee(@RequestBody Employee newEmployee, @PathVariable Long id) {

        Employee updatedEmployee = repository.findById(id) //
                .map(employee -> {
                    employee.setName(newEmployee.getName());
                    employee.setSurname(newEmployee.getSurname());
                    employee.setRole(newEmployee.getRole());
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
    }

    // delete
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        Optional<Employee> optionalEmployee = repository.findById(id);
        if (optionalEmployee.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.ok("Employee with ID " + id + " deleted successfully");
        } else {
            // Employee with the given ID was not found
            return ResponseEntity.notFound().build();
        }
    }

    // search
    @GetMapping("/employees/search")
    CollectionModel<EntityModel<Employee>> search(@RequestParam(required = false) String search) {
        List<Employee> employees;

        if (search != null && !search.isEmpty()) {
            // Implement your search logic here based on the provided search parameter
            // For example, searching by name, surname, phoneCode, phoneNumber, etc.
            // Here's a simple example using Java streams to filter employees
            employees = repository.findAll().stream()
                    .filter(employee -> employee.getName().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getSurname().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getPhoneCode().toLowerCase().contains(search.toLowerCase()) ||
                            employee.getPhoneNumber().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        } else {
            // If search parameter is not provided, return all employees
            employees = repository.findAll();
        }

        List<EntityModel<Employee>> employeeModels = employees.stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(employeeModels, linkTo(methodOn(EmployeeController.class).all()).withSelfRel());
    }

    // sort
    @GetMapping("/employees/sort")
    CollectionModel<EntityModel<Employee>> sortEmployees(@RequestParam String field,
            @RequestParam(defaultValue = "ASC") String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), field);

        List<Employee> sortedEmployees = repository.findAll(sort);

        List<EntityModel<Employee>> employeeModels = sortedEmployees.stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(employeeModels, linkTo(methodOn(EmployeeController.class).all()).withSelfRel());
    }

    // pagination
    @GetMapping("/employees/paginate")
    CollectionModel<EntityModel<Employee>> paginateEmployees(@RequestParam int size, @RequestParam int page) {
        Page<Employee> employeePage = repository.findAll(PageRequest.of(page, size));

        List<EntityModel<Employee>> employeeModels = employeePage.getContent().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        // Calculate total pages count
        int totalPages = employeePage.getTotalPages();

        // Add self-relational link with pagination parameters
        Link selfLink = Link.of(String.format("/employees/paginate?size=%d&page=%d", size, page)).withSelfRel();

        // Add pagination links
        Link nextLink = null;
        if (page < totalPages - 1) {
            nextLink = Link.of(
                    String.format("/employees/paginate?size=%d&page=%d", size, page + 1), "next");
        }

        Link prevLink = null;
        if (page > 0) {
            prevLink = Link.of(String.format("/employees/paginate?size=%d&page=%d", size, page - 1), "prev");
        }

        Link lastLink = Link.of(String.format("/employees/paginate?size=%d&page=%d", size, totalPages - 1), "last");

        // Create CollectionModel with employeeModels and selfLink
        CollectionModel<EntityModel<Employee>> collectionModel = CollectionModel.of(employeeModels, selfLink);

        // Add pagination links
        if (nextLink != null) {
            collectionModel.add(nextLink);
        }
        if (prevLink != null) {
            collectionModel.add(prevLink);
        }
        collectionModel.add(lastLink);

        return collectionModel;
    }

    // search + sort + paginate
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
                switch (field) {
                    case "name":
                        return emp1.getName().compareTo(emp2.getName());
                    case "surname":
                        return emp1.getSurname().compareTo(emp2.getSurname());
                    case "phoneCode":
                        return emp1.getPhoneCode().compareTo(emp2.getPhoneCode());
                    case "phoneNumber":
                        return emp1.getPhoneNumber().compareTo(emp2.getPhoneNumber());
                    default:
                        return 0;
                }
            });
        }

        // Pagination logic
        int adjustedPage = Math.max(page, 1) - 1; // Ensure page is at least 1 before subtracting 1
        int startIndex = adjustedPage * size;
        int endIndex = Math.min(startIndex + size, employees.size());
        employeePage = new PageImpl<>(employees.subList(startIndex, endIndex),
                PageRequest.of(adjustedPage, size), employees.size());

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

        return CollectionModel.of(employeeModels, selfLink, nextLink, prevLink, lastLink);
    }

}
