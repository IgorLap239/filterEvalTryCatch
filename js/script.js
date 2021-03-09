const filterByType = (type, ...values) => values.filter(value => typeof value === type), //функция фильтрации введенных данных по типу, которая получает
    //на вход тип из селектора и строку, которую сразу преобразует в массив
    // из которого методом filter() отбираются значения по типу

    hideAllResponseBlocks = () => { // функция, скрывающая все варианты блоков ответа
        const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block')); //получаем массив html элементов - блоков результата
        responseBlocksArray.forEach(block => block.style.display = 'none'); //убираем отображение каждого из полченных блоков
    },

    showResponseBlock = (blockSelector, msgText, spanSelector) => { //функция, которая, в замисимости от полученных параметров, выводит определнный блок результата на страницу
        hideAllResponseBlocks(); //вызываем функцию, которая изначально скрывает все блоки
        document.querySelector(blockSelector).style.display = 'block'; //присваиваем выбранному блоку стиль, который делает его видимым
        if (spanSelector) {
            //если передан также параметр span то содержимое span вывовдится в блок
            document.querySelector(spanSelector).textContent = msgText;
        }
    },

    showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'), //функция, которая получает введенные значения и передает параметры в showResponseBlock(), которая выводит блок с результатом "Ошибка" в который выводится span с введенными данными

    showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'), //функция, которая получает введенные значения и передает параметры в showResponseBlock(), которая выводит блок с положительным результатом в который выводится span с отфилтрованными по типу данными

    showNoResults = () => showResponseBlock('.dialog__response-block_no-results'), //передает для вывода параметры стартового блока без результатов

    tryFilterByType = (type, values) => { //функция
        try { //метод try позволяет при опечатке или подобной ошибке продолжить выполнение скрипта
            const valuesArray = eval(`filterByType('${type}', ${values})`).join(", "); //используя метод eval выолняется функция filterByType фильтрующая введенные значени и результаты этой функции записываются в строку valuesArray. Если результат включает несколько отфильтрованных значений, то они разделяются запятой
            const alertMsg = (valuesArray.length) ? //переменная, которая в зависимости от присутствия или отсутсвия переменных с выбранным типом среди введенных значени формирует строку-ответ
                `Данные с типом ${type}: ${valuesArray}` :
                `Отсутствуют данные типа ${type}`;
            showResults(alertMsg); //вывод результата
        } catch (e) { // ловит ошибки, и выводит их в поле результата
            showError(`Ошибка: ${e}`); //вывод ошибки в строке
        }
    };

const filterButton = document.querySelector('#filter-btn'); //получаем со страницы элемент кнопки фильтрации

filterButton.addEventListener('click', e => { //обработчик событий при нажатии на кнопку фильтрации
    const typeInput = document.querySelector('#type'); //получаем селект типов из html
    const dataInput = document.querySelector('#data'); //получаем поле ввода для данных html

    if (dataInput.value === '') { //проверяем, пустое поле или нет
        dataInput.setCustomValidity('Поле не должно быть пустым!'); //если поле пустое, выводим предупреждение
        showNoResults(); //показываем блок без результата
    } else { //иначе
        dataInput.setCustomValidity(''); //убираем созданное предупреждение
        e.preventDefault(); //убираем стандартную реакцию браузера на кнопку
        tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
        //передаем для фильтрации данные из селекта и инпута, предварительно убрав все лишние пробелы
    }
});