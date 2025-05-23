package dev.java10x.CadastroDeNinjas.Missoes;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cadastrosissao")
public class MissoesController {

    private final MissoesService missoesService;

    public MissoesController(MissoesService missoesService) {
        this.missoesService = missoesService;
    }

    @GetMapping("/listarmissoes")
    public List<MissoesModel> getAllMissoes() {
        return missoesService.getAllMissoes();
    }

    @PostMapping("/criarmissao")
    public MissoesModel createMissoes(@RequestBody MissoesModel missoesModel) {
        return missoesService.save(missoesModel);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        missoesService.delete(id);
        return ResponseEntity.ok().body("id: " + id + " deletado com sucesso!");
    }

    @PutMapping("/putmissao/{id}")
    public MissoesModel alterarMissao(@PathVariable Long id, @RequestBody MissoesModel missaoAtualizada) {
        return missoesService.atualizar(id, missaoAtualizada);
    }
}
