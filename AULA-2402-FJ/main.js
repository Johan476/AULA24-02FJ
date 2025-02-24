document.addEventListener("DOMContentLoaded", function () {
  carregarContatos();

  // Verifica se já existe o contato inicial no localStorage
  if (!localStorage.getItem("contatos")) {
    const contatoInicial = {
      nome: "Johan",
      telefone: "51985580137",
      email: "extremamente476@gmail.com",
    };
    salvarContato(contatoInicial);
  }
});

const formulario = document.getElementById("form-group");
const btnAdicionar = document.getElementById("addContato");
const btnAtualizar = document.getElementById("updateContato");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  if (formulario.dataset.editarIndex !== undefined) {
    editarContato(); // Se o formulário tem um índice de edição, chama a função de editar
  } else {
    adicionarContato(); // Caso contrário, chama a função para adicionar um novo contato
  }
});

document.getElementById("pesquisar").addEventListener("input", function () {
  const pesquisaTermo = this.value.toLowerCase();
  carregarContatos(pesquisaTermo);
});

document.getElementById("limparTodos").addEventListener("click", function () {
  if (confirm("Você tem certeza que deseja remover todos os contatos?")) {
    localStorage.removeItem("contatos");
    carregarContatos(); // Recarrega a lista de contatos vazia
  }
});

document.getElementById("ordenarNome").addEventListener("click", function () {
  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  contatos.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena pelo nome
  localStorage.setItem("contatos", JSON.stringify(contatos));
  carregarContatos(); // Recarrega a lista de contatos ordenada
});

function adicionarContato() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  if (nome === "" || telefone === "" || email === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

  const contato = { nome, telefone, email };
  salvarContato(contato); // Salva o novo contato
  limparCampos(); // Limpa os campos após adicionar
  carregarContatos(); // Recarrega a lista de contatos
}

function salvarContato(contato) {
  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  contatos.push(contato);
  localStorage.setItem("contatos", JSON.stringify(contatos));
}

function carregarContatos(pesquisaTermo = "") {
  const lista = document.getElementById("listaContatos");
  lista.innerHTML = ""; // Limpa a lista antes de recarregar

  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];

  // Filtra os contatos com base no termo de pesquisa
  contatos = contatos.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(pesquisaTermo) ||
      contato.telefone.includes(pesquisaTermo) ||
      contato.email.toLowerCase().includes(pesquisaTermo)
  );

  // Preenche a lista com os contatos filtrados
  contatos.forEach((contato, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
          <p><strong>Nome:</strong> ${contato.nome}</p>
          <p><strong>Telefone:</strong> ${contato.telefone}</p>
          <p><strong>E-mail:</strong> ${contato.email}</p>
          <button type="button" class="edit" onclick="editarContatoCampos(${index})">Editar</button>
          <button type="button" class="delete" onclick="removerContato(${index})">X</button>
      `;
    lista.appendChild(li);
  });
}

function removerContato(index) {
  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  contatos.splice(index, 1);
  localStorage.setItem("contatos", JSON.stringify(contatos));
  carregarContatos(); // Recarrega a lista de contatos após a remoção
}

function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("email").value = "";
}

function editarContatoCampos(index) {
  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  const contato = contatos[index];

  document.getElementById("nome").value = contato.nome;
  document.getElementById("telefone").value = contato.telefone;
  document.getElementById("email").value = contato.email;

  const formulario = document.getElementById("form-group");
  formulario.dataset.editarIndex = index; // Armazena o índice do contato a ser editado

  // Alterar o texto e visibilidade dos botões
  btnAdicionar.style.display = "none"; // Esconde o botão de adicionar
  btnAtualizar.style.display = "block"; // Mostra o botão de atualizar
}

function editarContato() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  const index = formulario.dataset.editarIndex;
  if (index === undefined) return;

  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];

  // Sobrescreve o contato com os dados atualizados
  contatos[index] = { nome, telefone, email };

  localStorage.setItem("contatos", JSON.stringify(contatos));

  formulario.removeAttribute("data-editarIndex"); // Limpa o índice de edição
  limparCampos(); // Limpa os campos do formulário

  // Volta ao estado inicial dos botões
  btnAdicionar.style.display = "block";
  btnAtualizar.style.display = "none";

  carregarContatos(); // Recarrega a lista de contatos após a edição
}
