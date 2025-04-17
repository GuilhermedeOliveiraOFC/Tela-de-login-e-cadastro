

// Função que recupera os usuários armazenados no localStorage
function getUsers() {
  // Verifica se há dados de "users" armazenados no localStorage
  const users = localStorage.getItem("users");
  
  // Se houver, retorna os dados como um array (convertido de string para objeto JavaScript)
  // Se não houver, retorna um array vazio
  return users ? JSON.parse(users) : [];
}

// Função para salvar os usuários no localStorage
function saveUsers(users) {
  // Converte o array de usuários em uma string JSON e salva no localStorage
  localStorage.setItem("users", JSON.stringify(users));
}


// Cadastro de um novo usuário
function register() {
  // Pega os valores inseridos nos campos do formulário de cadastro
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  // Valida se todos os campos foram preenchidos
  if (!name || !email || !password) {
    alert("Preencha todos os campos!");
    return; // Se algum campo não for preenchido, a função termina aqui
  }

  // Valida o formato do e-mail
  if (!email.includes("@") || !email.includes(".")) {
    alert("Digite um e-mail válido!");
    return; 
  }

  // Valida o tamanho da senha
  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!");
    return; 
  }

  // Pega os usuários já cadastrados
  let users = getUsers();

  // Verifica se o e-mail já foi cadastrado
  if (users.some(user => user.email === email)) {
    alert("E-mail já cadastrado!");
    return; // Se o e-mail já existir, a função termina aqui
  }

  // Adiciona o novo usuário ao array de usuários
  users.push({ name, email, password });
  
  // Salva os usuários atualizados no localStorage
  saveUsers(users);

  // Exibe uma mensagem de sucesso e redireciona para a tela de login
  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}


// Função de login
function login() {
  
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  
  if (!email || !password) {
    alert("Preencha todos os campos!");
    return; 
  }

  // Pega todos os usuários cadastrados
  const users = getUsers();
  
  // Verifica se o e-mail e a senha correspondem a algum usuário
  const user = users.find(u => u.email === email && u.password === password);

  // Se encontrar o usuário, armazena os dados do usuário logado no localStorage
  if (user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    window.location.href = "bemvindo.html"; // Redireciona para a tela de boas-vindas
  } else {
    alert("Email ou senha inválidos!"); // Caso não encontre o usuário, exibe um erro
  }
}

// Função para exibir o nome do usuário logado na tela
function mostrarUsuarioLogado() {
  // Pega os dados do usuário logado armazenado no localStorage
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const container = document.getElementById("usuarioLogadoContainer");

  // Verifica se o usuário está logado e se o container existe
  if (user && container) {
    // Exibe uma mensagem de boas-vindas com o nome do usuário
    container.innerHTML = `
      <h2>Bem-vindo, ${user.name}!</h2>
      <button onclick="logout()">Sair</button> <!-- Botão para sair -->
    `;
  }
}

// Função de logout (deslogar)
function logout() {
  // Remove o item de "usuarioLogado" do localStorage
  localStorage.removeItem("usuarioLogado");
  
  // Redireciona o usuário de volta para a tela de login
  window.location.href = "login.html";
}

// Função para listar todos os usuários cadastrados com um botão para remover
function mostrarUsuariosCadastrados() {
  // Pega todos os usuários cadastrados
  const users = getUsers();
  const listContainer = document.getElementById("userList");
  
  // Limpa o conteúdo atual da lista
  listContainer.innerHTML = "";

  // Verifica se não há usuários cadastrados
  if (users.length === 0) {
    listContainer.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
    return; // Se não houver usuários, exibe uma mensagem e termina a função
  }

  // Para cada usuário cadastrado, cria um elemento na lista
  users.forEach((user, index) => {
    const userDiv = document.createElement("div");
    userDiv.style.display = "flex";
    userDiv.style.justifyContent = "space-between";
    userDiv.style.alignItems = "center";
    userDiv.style.marginBottom = "10px";

    // Preenche o conteúdo do usuário na lista com nome, e-mail e botão de remover
    userDiv.innerHTML = `
      <span>${user.name} (${user.email})</span>
      <button onclick="removerUsuario(${index})">Remover</button> <!-- Botão para remover o usuário -->
    `;

    listContainer.appendChild(userDiv);
  });
}

// Função para remover um usuário da lista
function removerUsuario(index) {
  // Pega todos os usuários cadastrados
  let users = getUsers();
  
  // Remove o usuário com base no índice fornecido
  users.splice(index, 1);
  
  // Atualiza os dados de usuários no localStorage
  saveUsers(users);

  // Atualiza a lista de usuários na tela
  mostrarUsuariosCadastrados();
}

// Função para exportar os dados de usuários para um arquivo JSON
function exportarDados() {
  // Pega todos os usuários cadastrados
  const users = getUsers();

  // Verifica se há dados para exportar
  if (users.length === 0) {
    alert("Não há dados para exportar.");
    return; // Se não houver usuários, exibe um erro e termina a função
  }

  // Converte os dados dos usuários para o formato JSON
  const jsonData = JSON.stringify(users, null, 2);

  // Cria um arquivo de dados JSON e um link para download
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");

  // Cria o link para o download do arquivo JSON
  link.href = URL.createObjectURL(blob);
  link.download = "usuarios.json"; // Nome do arquivo de exportação
  link.click(); // Simula o clique no link, fazendo o download
}

// window.onload: Executa funções assim que a página carrega
window.onload = function () {
  // Verifica se a página possui o elemento de exibição do usuário logado
  if (document.getElementById("usuarioLogadoContainer")) {
    mostrarUsuarioLogado(); // Exibe as informações do usuário logado
  }

  // Verifica se a página possui a lista de usuários
  if (document.getElementById("userList")) {
    mostrarUsuariosCadastrados(); // Exibe a lista de usuários cadastrados
  }
};
