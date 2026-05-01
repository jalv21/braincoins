package com.lab3.moeda;

import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.UsuarioEntity;
import org.junit.jupiter.api.Test;

public class HibernateTest {

    @Test
    public void testHibernateExample() {
        UsuarioEntity aluno = new AlunoEntity("Fulano", "123.456.789-10", "123456789", "rua 1", "biologia");
        aluno.creditarMoedas(10);
    }
}
