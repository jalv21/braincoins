package com.lab3.moeda.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusResgate {
    ATIVO, EXPIRADO, RETIRADO;

    @JsonValue
    public String getValor() {
        return name().toLowerCase();
    }
}
