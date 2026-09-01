# BLOQUEIOS

Quando um agente precisa de algo que não está no âmbito dele, regista aqui e **passa à
tarefa seguinte** em vez de esperar. Ver WORK_PROTOCOL secção 5.

Formato:

```
## [F<id>] precisa de <o quê> (dono: F<id>)
Motivo: ...
O que faz falta: ...
Estado: à espera / resolvido em <commit>
```

---

_(vazio — nada bloqueado por outro agente neste momento)_

Os bloqueios que existem hoje são por **pessoas**, não por agentes, e estão na FILA
como `H1` a `H7`.
