    // Правильные ответы
    const answers = {
        q1: 'B', q2: 'C', q3: 'C', q4: 'C', q5: 'B',
        q6: 'C', q7: 'B', q8: 'B', q9: 'B', q10: 'B',
        e1: 7, e2: 5, e3: 3, e4: 6, e5: 5
    };

    const codeSolutions = {
        c1: "def update(self):\n    self.rect.x -= 3",
        c2: "text = font.render(f'Счет: {score}', True, (255, 255, 255))",
        c3: "if player_rect.colliderect(coin):\n    coins.remove(coin)\n    score += 1"
    };

    function checkCode(input, keywords) {
        const val = input.value.toLowerCase();
        return keywords.every(word => val.includes(word));
    }

    function showFeedback(elementId, isCorrect, correctMsg, wrongMsg, solutionText = null) {
        const el = document.querySelector(`#${elementId} .feedback`);
        let htmlContent = "";
        
        if (isCorrect) {
            htmlContent = `<div style="color:#0f5132">✅ ${correctMsg}</div>`;
            el.className = "feedback correct";
        } else {
            htmlContent = `<div style="color:#842029">❌ ${wrongMsg}</div>`;
            if (solutionText) {
                htmlContent += `
                <div class="correct-answer-box">
                    <strong>Правильный вариант:</strong>
                    <code>${solutionText.replace(/\n/g, '<br>')}</code>
                </div>`;
            }
            el.className = "feedback incorrect";
        }
        
        el.innerHTML = htmlContent;
        el.style.display = 'block';
        return isCorrect ? 1 : 0;
    }

    function checkAnswers() {
        let score = 0; // 1. СНАЧАЛА создаем переменную score
        const submitBtn = document.getElementById('submitBtn');
        
        // Блокируем интерфейс
        submitBtn.disabled = true;
        submitBtn.textContent = "Проверка завершена";
        const allInputs = document.querySelectorAll('input, textarea, button');
        allInputs.forEach(inp => {
            if(inp !== submitBtn) inp.disabled = true;
        });

        // --- Проверка тестов ---
        for (let i = 1; i <= 10; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            const isCorrect = selected && selected.value === answers[`q${i}`];
            let userAns = selected ? selected.value : "Нет ответа";
            let correctAns = answers[`q${i}`];
            let msg = isCorrect ? "Верно!" : `Вы выбрали: ${userAns}. Правильный ответ: ${correctAns}`;
            score += showFeedback(`q${i}`, isCorrect, "Верно!", msg);
        }

        // --- Проверка поиска ошибок ---
        for (let i = 1; i <= 5; i++) {
            const inputVal = parseInt(document.getElementsByName(`e${i}`)[0].value);
            let isCorrect = false;
            if (i === 5) {
                isCorrect = (inputVal === 5 || inputVal === 6);
            } else {
                isCorrect = (inputVal === answers[`e${i}`]);
            }

            let userAns = inputVal ? inputVal : "Нет ответа";
            let correctAnsText = (i === 5) ? "5 или 6" : answers[`e${i}`];
            let explanation = "";
            
            if (i===1) explanation = "Ошибка: опечатка (idl_e_frames).";
            if (i===2) explanation = "Ошибка: лишний пробел (отступы).";
            if (i===3) explanation = "Ошибка: знак '+' вместо '-'.";
            if (i===4) explanation = "Ошибка: опечатка (velocit_y).";
            if (i===5) explanation = "Ошибка: цикл объектов внутри цикла тайлов.";

            let msg = isCorrect ? `Верно!` : `Вы указали: ${userAns}. Правильно: строка ${correctAnsText}. ${explanation}`;
            score += showFeedback(`e${i}`, isCorrect, `Верно!`, msg);
        }

        // --- Проверка кода ---
        const c1Input = document.getElementsByName('c1')[0];
        const c1Valid = checkCode(c1Input, ['def update', 'self.rect.x', '-=', '3']); 
        score += showFeedback('c1', c1Valid, "Код верный!", "Не хватает ключевых слов.", codeSolutions.c1);

        const c2Input = document.getElementsByName('c2')[0];
        const c2Valid = checkCode(c2Input, ['text', 'font.render', 'score', '255']);
        score += showFeedback('c2', c2Valid, "Отлично!", "Нужны: text, font.render, score, 255.", codeSolutions.c2);

        const c3Input = document.getElementsByName('c3')[0];
        const c3Valid = checkCode(c3Input, ['player_rect', 'coin', 'colliderect', 'remove', 'score', '+=']);
        score += showFeedback('c3', c3Valid, "Логика верна!", "Нужны: player_rect, coin, colliderect, remove.", codeSolutions.c3);

        // --- СОХРАНЕНИЕ РЕЗУЛЬТАТА (теперь score уже существует) ---
        const resultData = {
            score: score,
            isFinished: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('pygameTestResult', JSON.stringify(resultData));
        
        submitBtn.textContent = "Тест завершен. Результаты сохранены.";

        // --- ВЫВОД РЕЗУЛЬТАТА ---
        const resArea = document.getElementById('result-area');
        resArea.style.display = 'block';
        document.getElementById('score-val').textContent = score;

        const gradeText = document.getElementById('grade-text');
        if (score >= 16) gradeText.textContent = "🏆 Оценка: 5 (Отлично!)";
        else if (score >= 13) gradeText.textContent = "🥈 Оценка: 4 (Хорошо)";
        else if (score >= 9) gradeText.textContent = "🥉 Оценка: 3 (Удовл.)";
        else gradeText.textContent = "⚠️ Оценка: 2 (Плохо)";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  // --- ФУНКЦИЯ ПЕРЕЗАПУСКА (ГЛОБАЛЬНАЯ) ---
    // Она должна быть здесь, чтобы onclick видел её
    window.requestRestart = function() {      
        const password = prompt("⚠️ Для перезапуска теста введите пароль учителя:");
        
        if (password === "adminit") {
            localStorage.removeItem('pygameTestResult');
            location.reload();
        } else if (password !== null) {
            alert("❌ Неверный пароль! Тест заблокирован.");
        }
    };


    // --- ПРОВЕРКА ПРИ ЗАГРУЗКЕ (ВНЕ функций, срабатывает сразу) ---
    window.addEventListener('DOMContentLoaded', () => {
        const savedData = localStorage.getItem('pygameTestResult');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.isFinished) {
                // Блокируем поля
                document.querySelectorAll('input, textarea').forEach(inp => inp.disabled = true);
                const submitBtn = document.getElementById('submitBtn');
                if(submitBtn) submitBtn.style.display = 'none';

                // Показываем результат
                const resArea = document.getElementById('result-area');
                if (resArea) {
                    resArea.style.display = 'block';
                    document.getElementById('score-val').textContent = data.score;
                    
                    const s = data.score;
                    const gradeText = document.getElementById('grade-text');
                    if (gradeText) {
                        if (s >= 16) gradeText.textContent = "🏆 Оценка: 5 (Отлично!)";
                        else if (s >= 13) gradeText.textContent = "🥈 Оценка: 4 (Хорошо)";
                        else if (s >= 9) gradeText.textContent = "🥉 Оценка: 3 (Удовл.)";
                        else gradeText.textContent = "⚠️ Оценка: 2 (Плохо)";
                    }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
