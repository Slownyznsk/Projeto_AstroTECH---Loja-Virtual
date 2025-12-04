// BUSCAR O VALOR DO CARRINHO
const totalCarrinho = localStorage.getItem("totalCarrinho");

// Preencher automaticamente o nome do usuário
const nomeUsuario = localStorage.getItem("usuarioNome");

if (nomeUsuario) {
    const inputNome = document.getElementById("nome");
    inputNome.value = nomeUsuario;
}

// MÁSCARAS
document.getElementById("nome").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
});

document.getElementById("numeroCartao").addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = v;
});

document.getElementById("validadeCartao").addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) e.target.value = `${v.slice(0,2)}/${v.slice(2)}`;
    else e.target.value = v;
});

document.getElementById("cvvCartao").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0,3);
});

function formatarValor(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

// GERAR QR AUTOMÁTICO QUANDO "QR CODE" FOR SELECIONADO
document.getElementById("metodoPagamento").addEventListener("change", e => {
    document.getElementById("areaCartao").style.display = "none";
    document.getElementById("areaQR").style.display = "none";

    if (e.target.value === "cartao") {
        document.getElementById("areaCartao").style.display = "flex";
        return;
    }

    if (e.target.value === "qr") {
        document.getElementById("areaQR").style.display = "block";

        if (totalCarrinho) {
            const valorFormatado = formatarValor(totalCarrinho);
            const textoQR = `Pagamento AstroTECH - Valor: ${valorFormatado}`;
            const api = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";

            document.getElementById("qrImagem").src =
                api + encodeURIComponent(textoQR) + "&t=" + Date.now();
        }
    }
});

// FINALIZAR COMPRA — mensagem + redirecionamento
document.getElementById("formPagamento").addEventListener("submit", e => {
    e.preventDefault();
    const emailUsuario = localStorage.getItem("usuarioEmail");
    let mensagem = "Compra finalizada com sucesso!";
    if (emailUsuario) {
        mensagem += `\n\nUma confirmação será enviada para o e-mail: ${emailUsuario}`;
    } else {
        mensagem += `\n\n(Conta sem e-mail — não foi possível enviar a notificação.)`;
    }
    alert(mensagem);
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
});

// Evento do botão de copiar
document.getElementById("btnCopiarQR").addEventListener("click", () => {
    if (totalCarrinho) {
        const valorFormatado = formatarValor(totalCarrinho);
        const mensagem = `Pagamento em código QR para AstroTech de ${valorFormatado}`;

        navigator.clipboard.writeText(mensagem)
            .then(() => {
                alert("Mensagem copiada para a área de transferência!");
            })
            .catch(err => {
                console.error("Erro ao copiar: ", err);
            });
    } else {
        alert("Nenhum valor encontrado no carrinho.");
    }
});

// FRETE
function calcularFrete(cep) {
    cep = cep.replace(/\D/g, "");
    if (cep.length < 8) return null;
    const inicio = Number(cep.slice(0, 3));
    let frete = 0;

    if (inicio >= 100 && inicio <= 399) frete = 150.000;          // Sudeste
    else if (inicio >= 400 && inicio <= 659) frete = 250.000;     // Nordeste
    else if (inicio >= 660 && inicio <= 699) frete = 300.000;     // Norte
    else if (inicio >= 700 && inicio <= 799) frete = 200.000;     // Centro-Oeste
    else frete = 350.000;                                         // Demais regiões

    return frete;
}

function converterParaNumero(valor) {
    return Number(valor.toString().replace(/\./g, "").replace(",", "."));
}

document.getElementById("cep").addEventListener("input", () => {
    const cep = document.getElementById("cep").value;
    const frete = calcularFrete(cep);

    if (frete !== null) {
    document.getElementById("valorFrete").textContent = formatarValor(frete);
    const total = converterParaNumero(totalCarrinho);
    const totalFinal = total + frete;
    document.getElementById("totalFinal").textContent = formatarValor(totalFinal);
    } else {
    document.getElementById("valorFrete").textContent = "R$ 0,00";
    document.getElementById("totalFinal").textContent = formatarValor(converterParaNumero(totalCarrinho));
    }
});