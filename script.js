// Cadastro e Login de Usuário

window.addEventListener("DOMContentLoaded", () => {

  const btnLogin = document.getElementById("login");
  const modal = document.getElementById("formCadastro");
  const btnFechar = document.getElementById("btnFechar");
  const btnCadastrar = document.getElementById("btnCadastrar");

  const usuarioLogado = document.getElementById("usuarioLogado");
  const menuPerfil = document.getElementById("menuPerfil");
  const perfilNome = document.getElementById("perfilNome");
  const dataNascimento = document.getElementById("nascimento");
  const btnLogout = document.getElementById("btnLogout");

  document.getElementById("nascimento").addEventListener("input", e => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 8);
      if (v.length >= 5) e.target.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
      else if (v.length >= 3) e.target.value = `${v.slice(0,2)}/${v.slice(2)}`;
      else e.target.value = v;
  });

  function mostrarSaudacaoSeHouver() {
    const nomeSalvo = localStorage.getItem("usuarioNome");
    if (nomeSalvo) {
      usuarioLogado.textContent = "Bem-vindo, " + nomeSalvo + "!";
      usuarioLogado.style.display = "block";
    } else {
      usuarioLogado.style.display = "none";
    }
  }

  mostrarSaudacaoSeHouver();

  btnLogin.addEventListener("click", () => {
    const nomeSalvo = localStorage.getItem("usuarioNome");
    if (!nomeSalvo) {
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      menuPerfil.style.display = "none";
    } else {
      perfilNome.textContent = nomeSalvo;
      menuPerfil.style.display = "block";
      menuPerfil.setAttribute("aria-hidden", "false");
      usuarioLogado.style.display = "none";
      modal.style.display = "none";
    }
  });

  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  btnCadastrar.addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const nascimento = document.getElementById("nascimento").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !nascimento || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    localStorage.setItem("usuarioNome", nome);
    localStorage.setItem("usuarioNascimento", nascimento);
    localStorage.setItem("usuarioEmail", email);
    localStorage.setItem("usuarioSenha", senha);

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    menuPerfil.style.display = "none";
    usuarioLogado.textContent = "Bem-vindo, " + nome + "!";
    usuarioLogado.style.display = "block";
  });

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioNascimento");
    localStorage.removeItem("usuarioEmail");
    localStorage.removeItem("usuarioSenha");
    menuPerfil.style.display = "none";
    usuarioLogado.style.display = "none";
    alert("Você saiu da conta.");
  });

  window.addEventListener("click", (e) => {
    if (!e.target.closest("#menuPerfil") && !e.target.closest("#login")) {
      menuPerfil.style.display = "none";
    }
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Carrinho de Compras

const carrinho = {};
const itensCarrinho = document.getElementById("itensCarrinho");
const totalEl = document.getElementById("total");

// Formatador BRL e Resgistro de botões
const formatar = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
document.querySelectorAll(".product").forEach((produto, index) => {
    const nome = produto.querySelector("h3").textContent;
    const preco = parseFloat(
        produto.querySelector(".price").textContent
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
    );
    produto.querySelector("button").onclick = () => addCarrinho(index, nome, preco);
});

// Adicionar item
function addCarrinho(id, nome, preco) {
    if (!carrinho[id]) carrinho[id] = { nome, preco, quantidade: 0 };
    carrinho[id].quantidade++;
    renderCarrinho();
}

// Renderizar carrinho
function renderCarrinho() {
    itensCarrinho.innerHTML = "";
    let total = 0;
    Object.values(carrinho).forEach((item, idx) => {
        total += item.preco * item.quantidade;
        const div = document.createElement("div");
        div.className = "item-carrinho";
        div.innerHTML = `
            <span>${item.nome} x${item.quantidade}</span>
            <button class="btn-remover" onclick="remover(${idx})">-</button>
        `;
        itensCarrinho.appendChild(div);
    });

    totalEl.textContent = "Total: " + formatar(total);
}

// Remover item
function remover(id) {
    const chave = Object.keys(carrinho)[id];
    if (!chave) return;
    if (carrinho[chave].quantidade > 1) carrinho[chave].quantidade--;
    else delete carrinho[chave];
    renderCarrinho();
}

// Abrir / fechar carrinho
document.getElementById("carrinho1").onclick = () =>
    document.getElementById("carrinho").classList.toggle("aberto");
document.getElementById("fecharCarrinho").onclick = () =>
    document.getElementById("carrinho").classList.remove("aberto");

// Salvar total para pagar e validação
const btnPagar = document.getElementById("btnPagar");
if (btnPagar) {
    btnPagar.addEventListener("click", () => {
        let valor = totalEl.textContent
            .replace("Total:", "")
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();
        const totalCarrinho = Number(valor);
        if (!totalCarrinho || totalCarrinho <= 0) {
            alert("Você deve adicionar um item ao carrinho antes de prosseguir para o pagamento.");
            return;
        }

        const usuario = localStorage.getItem("usuarioNome");
        if (!usuario) {
            alert("Você precisa estar logado para continuar com o pagamento.");
            return;
        }

        localStorage.setItem("totalCarrinho", totalCarrinho);
        window.location.href = "pagamento.html";
    });
}

