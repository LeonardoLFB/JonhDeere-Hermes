package com.fatec.hermes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.hermes.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Usado no login: aceita tanto o username quanto o email
    Optional<Usuario> findByUsernameOrEmail(String username, String email);

}
