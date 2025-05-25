const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    loadMissoes();
    document.getElementById('missaoForm').addEventListener('submit', handleMissaoFormSubmit);
});

async function loadMissoes() {
    try {
        const response = await fetch(`${API_BASE_URL}/cadastrosissao/listarmissoes`); //
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const missoes = await response.json();
        const tableBody = document.getElementById('missoesTableBody');
        tableBody.innerHTML = ''; // Limpa a tabela

        if (missoes.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhuma missão cadastrada.</td></tr>';
            return;
        }

        missoes.forEach(missao => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = missao.id;
            row.insertCell().textContent = missao.nomeMissao; //

            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
            editButton.textContent = 'Editar';
            editButton.onclick = () => populateMissaoForm(missao);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteMissao(missao.id);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Erro ao carregar missões:', error);
        const tableBody = document.getElementById('missoesTableBody');
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center">Erro ao carregar missões: ${error.message}</td></tr>`;
    }
}

async function handleMissaoFormSubmit(event) {
    event.preventDefault();
    const missaoId = document.getElementById('missaoIdForm').value;
    const nomeMissao = document.getElementById('nomeMissao').value;

    const missaoData = { nomeMissao };

    if (missaoId) { // Atualizar
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrosissao/putmissao/${missaoId}`, { //
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missaoData)
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            alert('Missão atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar missão:', error);
            alert(`Falha ao atualizar missão: ${error.message}`);
        }
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrosissao/criarmissao`, { //
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(missaoData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro HTTP: ${response.status} - ${errorData.message || 'Detalhes não disponíveis'}`);
            }
            alert('Missão criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar missão:', error);
            alert(`Falha ao criar missão: ${error.message}`);
        }
    }
    clearMissaoForm();
    loadMissoes();
}

function populateMissaoForm(missao) {
    document.getElementById('missaoIdForm').value = missao.id;
    document.getElementById('nomeMissao').value = missao.nomeMissao;
    window.scrollTo(0, 0);
}

function clearMissaoForm() {
    document.getElementById('missaoForm').reset();
    document.getElementById('missaoIdForm').value = '';
}

async function deleteMissao(id) {
    if (confirm(`Tem certeza que deseja excluir a missão com ID ${id}? Verifique se não há ninjas associados a ela.`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrosissao/delete/${id}`, { method: 'DELETE' }); //
            if (!response.ok) {
                let errorMsg = `Erro HTTP: ${response.status}`;
                try {
                    const errorBody = await response.text();
                    if (errorBody && response.status !== 200) { // Se não for OK, é um erro
                        errorMsg += ` - ${errorBody}`;
                    } else if (response.status === 200 && errorBody.includes("deletado com sucesso!")) {}
                } catch (e) { /* não conseguiu ler o corpo do erro */ }
                if (response.status !== 200) throw new Error(errorMsg);
            }
            const responseBody = await response.text();
            alert(responseBody || `Missão com ID ${id} excluída!`);
            loadMissoes();
        } catch (error) {
            console.error('Erro ao excluir missão:', error);
            alert(`Falha ao excluir missão: ${error.message}. Verifique se há ninjas associados a esta missão antes de excluí-la.`);
        }
    }
}