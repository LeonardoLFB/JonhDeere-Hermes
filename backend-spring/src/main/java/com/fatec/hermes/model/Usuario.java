package com.fatec.hermes.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username;
    private String email;
    private String role;
    private String lastLogin;

    // WRITE_ONLY: a senha pode entrar pelo JSON (cadastro/login),
    // mas nunca aparece nas respostas da API
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

}
