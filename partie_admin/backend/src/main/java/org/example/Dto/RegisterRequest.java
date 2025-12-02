package org.example.Dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String login;
    private String password;
    private String role;
    private Long idGroupe;
    private Long idSpecialite;
    private Long idDepartement;
}
