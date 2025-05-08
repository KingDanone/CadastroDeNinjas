package dev.java10x.CadastroDeNinjas.Ninjas;


import dev.java10x.CadastroDeNinjas.Missoes.MissoesModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

//Entity transforma uma classe em uma entidade do DB
//JPA - Java Persistence API
@Entity
@Table(name = "tb_cadastro")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NinjaModel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;

    private String nome;

    private String email;

    private int idade;

    //@ManyToOne - Um Ninja tem uma unica Missão
    //Many->Muitos classNinjas | to->para | One->uma classMisoes
    @ManyToOne
    @JoinColumn(name = "missoes_id") //Foreing Key ou chave estrangeira
    private MissoesModel missoes;

}
