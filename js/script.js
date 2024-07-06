let savedGames = [];
let step = 1; // Controla o passo do preenchimento dos números fixos

function validateDuplicateNumbers() {
    const fixedNumbers = [];
    for (let i = 1; i <= 3; i++) {
        const fixedNumberInput = document.getElementById(`fixed-number-${i}`);
        if (fixedNumberInput && fixedNumberInput.value !== '') {
            if (fixedNumbers.includes(parseInt(fixedNumberInput.value))) {
                alert(`Número duplicado detectado: ${fixedNumberInput.value}. Por favor, insira um número diferente.`);
                fixedNumberInput.value = '';
                return false;
            }
            fixedNumbers.push(parseInt(fixedNumberInput.value));
        }
    }
    return true;
}

function generateNumbers() {
    if (!validateDuplicateNumbers()) {
        return;
    }

    const fixed1 = parseInt(document.getElementById('fixed-number-1').value);
    const fixed2 = parseInt(document.getElementById('fixed-number-2').value);
    const fixed3 = parseInt(document.getElementById('fixed-number-3').value);

    if (isNaN(fixed1) || (step >= 2 && isNaN(fixed2)) || (step >= 3 && isNaN(fixed3))) {
        alert("Por favor, insira números fixos válidos.");
        return;
    }

    if (step === 1) {
        document.getElementById('fixed-number-2').style.display = 'inline-block';
        document.querySelector('label[for=fixed-number-2]').style.display = 'inline-block';
        document.getElementById('fixed-number-2').focus();
        step++;
    } else if (step === 2) {
        document.getElementById('fixed-number-3').style.display = 'inline-block';
        document.querySelector('label[for=fixed-number-3]').style.display = 'inline-block';
        document.getElementById('fixed-number-3').focus();
        step++;
    }

    const fixedNumbers = [fixed1, fixed2, fixed3].filter(num => !isNaN(num));
    const allNumbers = Array.from({ length: 60 }, (_, i) => i + 1);
    const availableNumbers = allNumbers.filter(num => !fixedNumbers.includes(num));
    const randomNumbers = [];

    while (randomNumbers.length < 3) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const number = availableNumbers.splice(randomIndex, 1)[0];
        randomNumbers.push(number);
    }

    const generatedNumbers = [...fixedNumbers, ...randomNumbers].sort((a, b) => a - b);
    document.getElementById('generated-numbers').innerText = `Números Gerados: ${generatedNumbers.join(', ')}`;
}

function saveGame() {
    const generatedText = document.getElementById('generated-numbers').innerText;
    if (!generatedText) {
        alert("Nenhum jogo gerado para salvar.");
        return;
    }

    const generatedNumbers = generatedText.replace('Números Gerados: ', '');
    savedGames.push(generatedNumbers);

    const savedGamesDiv = document.getElementById('saved-games');
    savedGamesDiv.innerHTML = savedGames.map(game => `<div>${game}</div>`).join('');
}

function exportToExcel() {
    if (savedGames.length === 0) {
        alert("Nenhum jogo salvo para exportar.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(savedGames.map(game => game.split(', ')));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jogos Salvos");
    XLSX.writeFile(workbook, "jogos_megasena.xlsx");
}

function showSignupForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Conta criada com sucesso!');
            document.getElementById('signup-form').reset();
            showLoginForm();
        } else {
            alert('Erro ao criar conta: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login bem-sucedido!');
            document.getElementById('login-form').reset();
            // Implementar lógica para continuar após o login, como redirecionamento ou exibição de conteúdo adicional
        } else {
            alert('Erro ao fazer login: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
