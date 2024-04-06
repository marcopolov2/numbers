package com.example.demo;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Employee {

    private @Id @GeneratedValue Long id;
    private String name;
    private String surname;
    private String role;
    private String phoneCode;
    private String phoneNumber;

    Employee() {
    }

    Employee(String name, String surname, String role, String phoneCode, String phoneNumber) {

        this.name = name;
        this.surname = surname;
        this.role = role;
        this.phoneCode = phoneCode;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getSurname() {
        return this.surname;
    }

    public String getRole() {
        return this.role;
    }

    public String getPhoneCode() {
        return this.phoneCode;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPhoneCode(String phoneCode) {
        this.phoneCode = phoneCode;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Employee))
            return false;
        Employee employee = (Employee) o;
        return Objects.equals(this.id, employee.id) && Objects.equals(this.name, employee.name)
                && Objects.equals(this.surname, employee.surname)
                && Objects.equals(this.role, employee.role) && Objects.equals(this.phoneCode, employee.phoneCode)
                && Objects.equals(this.phoneNumber, employee.phoneNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.name, this.surname, this.role, this.phoneCode, this.phoneNumber);
    }

    @Override
    public String toString() {
        return "Employee{" + "id=" + this.id + ", name='" + this.name + '\'' + ", surname='" + this.surname + '\''
                + ", role='" + this.role + '\''
                + ", phoneCode='" + this.phoneCode + '\'' + ", phoneNumber='" + this.phoneNumber + '\'' + '}';
    }
}