package dev.java10x.CadastroDeNinjas.Missoes;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MissoesService {
    private final MissoesRepository missoesRepository;

    public MissoesService(MissoesRepository missoesRepository) {
        this.missoesRepository = missoesRepository;
    }

    //CRIAR MISSÕES
    public MissoesModel save(MissoesModel missoesModel) {
        return missoesRepository.save(missoesModel);
    }

    //LISTAR
    public List<MissoesModel> getAllMissoes() {
        return missoesRepository.findAll();
    }

    //DELETAR
    public void delete(Long id) {
        missoesRepository.deleteById(id);
        System.out.println("id: " + id + " deletado com sucesso.");
    }

    //ATUALIZAR
    public MissoesModel atualizar(Long id, MissoesModel missoesUpdate) {
        MissoesModel missaoExistense = missoesRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Missão não encontrada com o Id: " + id)
        );

        if (missoesUpdate.getNomeMissao() != null) {
            missaoExistense.setNomeMissao(missoesUpdate.getNomeMissao());
        }
        return missoesRepository.save(missaoExistense);
    }
}
