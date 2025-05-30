package dev.java10x.CadastroDeNinjas.Ninjas;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NinjaService {

    private final NinjaRepository ninjaRepository;

    public NinjaService(NinjaRepository ninjaRepository) {
        this.ninjaRepository = ninjaRepository;
    }


    //LISTAR
    public List<NinjaModel> getAllNinjas() {
        return ninjaRepository.findAll();
    }

    //CRIAR
    public NinjaModel save(NinjaModel ninjaModel) {
        return ninjaRepository.save(ninjaModel);
    }

    //DELETAR
    public void delete(Long id) {
        ninjaRepository.deleteById(id);
    }

    //ATUALIZAR
    public NinjaModel atualizar(Long id, NinjaModel ninjaAtualizado) {
        NinjaModel ninjaExistense = ninjaRepository.findById(id).orElseThrow(() -> new RuntimeException("Ninja não encontrado com o Id: " + id));

        if (ninjaAtualizado.getNome() != null) {
            ninjaExistense.setNome(ninjaAtualizado.getNome());
        }
        if (ninjaAtualizado.getEmail() != null) {
            ninjaExistense.setEmail(ninjaAtualizado.getEmail());
        }
        if (ninjaAtualizado.getIdade() > 0) {
            ninjaExistense.setIdade(ninjaAtualizado.getIdade());
        }
        if (ninjaAtualizado.getMissoes() == null || ninjaAtualizado.getMissoes().getId() == null) {
            ninjaExistense.setMissoes(null);
        }else {
            ninjaExistense.setMissoes(ninjaAtualizado.getMissoes());
        }
        return ninjaRepository.save(ninjaExistense);
    }
}