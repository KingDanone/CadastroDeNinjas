package dev.java10x.CadastroDeNinjas.Missoes;

import dev.java10x.CadastroDeNinjas.Ninjas.NinjaModel;
import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "tb_missoes")
public class MissoesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String nomeMissao;

    //@OneToMany Uma missão pode ter muitos ou uma Lista de ninjas
    @OneToMany(mappedBy = "missoes")
    private List<NinjaModel> ninjas;

}
