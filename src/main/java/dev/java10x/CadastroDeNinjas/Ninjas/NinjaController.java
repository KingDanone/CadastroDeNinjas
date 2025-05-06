package dev.java10x.CadastroDeNinjas.Ninjas;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cadastrarninja")
public class NinjaController {

    private final NinjaService ninjaService;

    public NinjaController(NinjaService ninjaService) {
        this.ninjaService = ninjaService;
    }

    @GetMapping("/listninjas")
    public List<NinjaModel> getAllNinjas() {
        return ninjaService.getAllNinjas();
    }

    @PostMapping("/criarninja")
    public NinjaModel createNinja(@RequestBody NinjaModel ninja) {return ninjaService.save(ninja);}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ninjaService.delete(id);}
}