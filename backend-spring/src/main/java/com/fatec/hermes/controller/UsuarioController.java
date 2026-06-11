package com.fatec.hermes.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.hermes.dto.LoginRequest;
import com.fatec.hermes.model.Usuario;
import com.fatec.hermes.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // Criptografa as senhas antes de salvar no banco
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        if (estaVazio(usuario.getName()) || estaVazio(usuario.getUsername())
                || estaVazio(usuario.getEmail()) || estaVazio(usuario.getSenha())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Preencha nome, username, email e senha."));
        }

        usuario.setSenha(encoder.encode(usuario.getSenha()));
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dados) {
        Usuario usuario = repository
                .findByUsernameOrEmail(dados.login(), dados.login())
                .orElse(null);

        boolean senhaCorreta = usuario != null
                && usuario.getSenha() != null
                && encoder.matches(dados.senha(), usuario.getSenha());

        if (!senhaCorreta) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "Usuário ou senha incorretos."));
        }

        usuario.setLastLogin(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        repository.save(usuario);

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return repository.findById(id)
                .map(usuario -> {
                    usuario.setName(dados.getName());
                    usuario.setUsername(dados.getUsername());
                    usuario.setEmail(dados.getEmail());
                    usuario.setRole(dados.getRole());

                    // Senha só muda se uma nova for informada
                    if (!estaVazio(dados.getSenha())) {
                        usuario.setSenha(encoder.encode(dados.getSenha()));
                    }

                    return ResponseEntity.ok(repository.save(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean estaVazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
