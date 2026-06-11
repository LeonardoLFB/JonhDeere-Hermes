package com.fatec.hermes.dto;

// O que a tela de login manda para o backend:
// "login" pode ser o username ou o email
public record LoginRequest(String login, String senha) {
}
