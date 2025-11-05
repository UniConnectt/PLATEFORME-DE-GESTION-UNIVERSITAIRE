package org.example.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "salle")
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // code unique (ex: S-101)
    @Column(nullable = false, unique = true)
    private String code;

    // type (TP, TD, Amphi, SalleCours...)
    private String type;

    // capacité (nombre de places)
    private Integer capacite;

    // 🔥 Relation avec Departement (correction)
    @ManyToOne
    @JoinColumn(name = "id_departement") // clé étrangère
    private Departement departement;

    public Salle() {}

    public Salle(String code, String type, Integer capacite) {
        this.code = code;
        this.type = type;
        this.capacite = capacite;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }

    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }
}
