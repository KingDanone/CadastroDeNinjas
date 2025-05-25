const API_BASE_URL = 'http://localhost:8080'; // Ajuste se sua API rodar em outra porta

document.addEventListener('DOMContentLoaded', () => {
    loadNinjas();
    loadMissoesDropdown();
    document.getElementById('ninjaForm').addEventListener('submit', handleNinjaFormSubmit);
});

async function loadMissoesDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/cadastrosissao/listarmissoes`); //
        if (!response.ok) {
            throw new Error(`Erro ao buscar missões: ${response.statusText}`);
        }
        const missoes = await response.json();
        const missaoSelect = document.getElementById('missaoId');
        missaoSelect.innerHTML = '<option value="">Sem Missão</option>'; // Opção padrão
        missoes.forEach(missao => {
            const option = document.createElement('option');
            option.value = missao.id;
            option.textContent = missao.nomeMissao; //
            missaoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Falha ao carregar missões:', error);
        alert('Não foi possível carregar as missões para seleção.');
    }
}

async function loadNinjas() {
    try {
        const response = await fetch(`${API_BASE_URL}/cadastrarninja/listninjas`); //
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const ninjas = await response.json();
        const tableBody = document.getElementById('ninjasTableBody');
        tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas

        if (ninjas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum ninja cadastrado.</td></tr>';
            return;
        }

        ninjas.forEach(ninja => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = ninja.id;
            row.insertCell().textContent = ninja.nome; //
            row.insertCell().textContent = ninja.email; //
            row.insertCell().textContent = ninja.idade; //
            row.insertCell().textContent = ninja.missoes ? ninja.missoes.nomeMissao : 'N/A'; //

            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editButton.textContent = 'Editar';
            editButton.onclick = () => populateNinjaForm(ninja);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteNinja(ninja.id);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Erro ao carregar ninjas:', error);
        const tableBody = document.getElementById('ninjasTableBody');
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Erro ao carregar ninjas: ${error.message}</td></tr>`;
    }
}

async function handleNinjaFormSubmit(event) {
    event.preventDefault();
    const ninjaId = document.getElementById('ninjaId').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const idade = parseInt(document.getElementById('idade').value);
    const missaoId = document.getElementById('missaoId').value;

    const ninjaData = {
        nome,
        email,
        idade,
        missoes: missaoId ? { id: parseInt(missaoId) } : null //
    };

    if (ninjaId) { // Atualizar
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrarninja/${ninjaId}`, { //
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ninjaData)
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            alert('Ninja atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar ninja:', error);
            alert(`Falha ao atualizar ninja: ${error.message}`);
        }
    } else { // Criar
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrarninja/criarninja`, { //
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ninjaData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro HTTP: ${response.status} - ${errorData.message || 'Detalhes não disponíveis'}`);
            }
            alert('Ninja criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar ninja:', error);
            alert(`Falha ao criar ninja: ${error.message}`);
        }
    }
    clearNinjaForm();
    loadNinjas();
    loadMissoesDropdown();
}

function populateNinjaForm(ninja) {
    document.getElementById('ninjaId').value = ninja.id;
    document.getElementById('nome').value = ninja.nome;
    document.getElementById('email').value = ninja.email;
    document.getElementById('idade').value = ninja.idade;
    document.getElementById('missaoId').value = ninja.missoes ? ninja.missoes.id : '';
    window.scrollTo(0, 0);
}

function clearNinjaForm() {
    document.getElementById('ninjaForm').reset();
    document.getElementById('ninjaId').value = '';
    document.getElementById('missaoId').value = '';
}

async function deleteNinja(id) {
    if (confirm(`Tem certeza que deseja excluir o ninja com ID ${id}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrarninja/delete/${id}`, { method: 'DELETE' }); //
            if (!response.ok) {
                let errorMsg = `Erro HTTP: ${response.status}`;
                try {
                    const errorBody = await response.text();
                    if (errorBody) errorMsg += ` - ${errorBody}`;
                } catch (e) { /* não conseguiu ler o corpo do erro, ignora */ }
                throw new Error(errorMsg);
            }
            alert(`Ninja com ID ${id} excluído com sucesso!`);
            loadNinjas();
        } catch (error) {
            console.error('Erro ao excluir ninja:', error);
            alert(`Falha ao excluir ninja: ${error.message}`);
        }
    }
}