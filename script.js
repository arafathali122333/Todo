//-------data Handling------------
let arr = [];
//add data from localStorage
if (localStorage.getItem('todoData')) {
    arr = JSON.parse(localStorage.getItem('todoData'));
    for (let i = 0; i < arr.length; i++) {
        addTodoData(arr[i].id, arr[i].data, arr[i].status);
        for (let j = 0; j < arr[i].subTodo.length; j++) {
            addSubTodoData(arr[i].subTodo[j].id, arr[i].subTodo[j].data, arr[i].subTodo[j].status, arr[i].id);
        }
    }
}

//-------Event Handling-----------
//add todo in active state
function onAddTodo(e) {
    if (e.type == 'click' || e.key == 'Enter') {
        let val = document.getElementById('inputTag').value.trim();
        //idGenerator is using for when click the edit button it focus on the same text element
        let idGenerator = Date.now();
        if (val != '') {
            addTodoData(idGenerator, val, 'Active');
            arr.push({ id: idGenerator, status: 'Active', data: val, subTodo: [] });
            localStorage.setItem('todoData', JSON.stringify(arr));
            document.getElementById('inputTag').value = "";
        } else {
            window.alert('Please enter the field');
        }
    }
}

//double click on the text element or click edit button, it goes to edit the text field
function onedit(e) {
    let id = e.target.id.split('^')[0];
    document.getElementById(id + '^').contentEditable = true;
    document.getElementById(id + '^').focus();
}

//save the edit text field using onblur
function onchangeTo(e) {
    let id = e.srcElement.id.split('^')[0];
    e.srcElement.contentEditable = false;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            arr[i].data = e.srcElement.innerText;
            localStorage.setItem('todoData', JSON.stringify(arr));
            return;
        }
        //for sub Todos
        for (let j = 0; j < arr[i].subTodo.length; j++) {
            if (arr[i].subTodo[j].id == id) {
                arr[i].subTodo[j].data = e.srcElement.innerText;
                localStorage.setItem('todoData', JSON.stringify(arr));
                return;
            }
        }
    }
}

//icon change depending upon active/completed status
function oncompleted(e) {
    let id = e.srcElement.id.split('CA')[0];
    let className = e.srcElement.parentNode.parentNode.className;
    if (className == 'list_sub' || className == 'list') {
        className == 'list' ? document.getElementById(id + 'list').className = 'complete' : document.getElementById(id + 'list_sub').className = 'complete_sub';
        //store completed,active status in Todos and subTodos 
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                arr[i].status = 'Completed';
                localStorage.setItem('todoData', JSON.stringify(arr));
                checkForParentOrChildStatus(id, e.srcElement.parentNode.parentNode.className);
                return;
            }
            for (let j = 0; j < arr[i].subTodo.length; j++) {
                if (arr[i].subTodo[j].id == id) {
                    arr[i].subTodo[j].status = 'Completed';
                    localStorage.setItem('todoData', JSON.stringify(arr));
                    checkForParentOrChildStatus(id, e.srcElement.parentNode.parentNode.className);
                    return;
                }
            }
        }
    } else {
        className == 'complete' ? document.getElementById(id + 'list').className = 'list' : document.getElementById(id + 'list_sub').className = 'list_sub';
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                arr[i].status = 'Active';
                localStorage.setItem('todoData', JSON.stringify(arr));
                checkForParentOrChildStatus(id, e.srcElement.parentNode.parentNode.className);
                return;
            }
            for (let j = 0; j < arr[i].subTodo.length; j++) {
                if (arr[i].subTodo[j].id == id) {
                    arr[i].subTodo[j].status = 'Active';
                    localStorage.setItem('todoData', JSON.stringify(arr));
                    checkForParentOrChildStatus(id, e.srcElement.parentNode.parentNode.className);
                    return;
                }
            }
        }
    }
}

//remove the whole parent element
function onremove(e) {
    let id = e.srcElement.id;
    let parentNodeName = e.srcElement.parentNode.parentNode
    if (parentNodeName.parentNode.id.split('TodoHeader')[0] == id) {
        e.srcElement.parentNode.parentNode.parentNode.remove();
    } else {
        e.srcElement.parentNode.parentNode.remove();
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            arr.splice(i, 1);
            localStorage.setItem('todoData', JSON.stringify(arr));
            return;
        }
        for (let j = 0; j < arr[i].subTodo.length; j++) {
            if (arr[i].subTodo[j].id == id) {
                arr[i].subTodo.splice(j, 1);
                localStorage.setItem('todoData', JSON.stringify(arr));
                return;
            }
        }
    }
}

//show and hide for add subTodo inputTag
function onshowInputTag(e) {
    let id = e.srcElement.id;
    if (e.target.innerText == '➕') {
        e.target.innerText = '✖️';
        document.getElementById(id + '_input').className = 'input_sub_show';
        document.getElementById(id + '_input').focus();
        document.getElementById(id + '_addBtn').className = 'input_subBtn_show';
        return;
    } else {
        e.target.innerText = '➕';
        document.getElementById(id + '_input').className = 'input_sub';
        document.getElementById(id + '_addBtn').className = 'input_subBtn';
        return;
    }
}

//add subTodo from parent of Todo
function onaddSubTodo(e) {
    let id = e.srcElement.id.split('_')[0];
    if (e.type == 'click' || e.key == 'Enter') {
        let val = document.getElementById(id + '_input').value.trim();
        let idGenerator = Date.now();
        if (val != '') {
            addSubTodoData(idGenerator, val, 'Active', id, true);
            document.getElementById(id + '_input').value = '';
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    arr[i].subTodo.push({ id: idGenerator, status: 'Active', data: val });
                    break;
                }
            }
            localStorage.setItem('todoData', JSON.stringify(arr));
        } else {
            alert('Please enter the field');
        }
    }
}

//-------View Handling------
function addSpanTag(className, id, eventName, data) {
    let span = document.createElement('span');
    span.className = className;
    span.id = id;
    span.onclick = eventName;
    span.innerText = data;
    return span;
}

//add and show the data UI
function addTodoData(idGenerator, val, state) {
    let span = document.createElement('button');
    span.className = "completed";
    span.id = idGenerator + 'CA';
    span.onclick = oncompleted;
    let span2 = addSpanTag('edit', idGenerator, onedit, '✎');
    let span3 = addSpanTag('remove', idGenerator, onremove, '🗑️');
    let span4 = addSpanTag('add', idGenerator, onshowInputTag, '➕');
    let spanParentDiv = document.createElement('div');
    spanParentDiv.append(span4, span, span2, span3);
    let textDiv = document.createElement('div');
    textDiv.className = 'textArea';
    textDiv.id = idGenerator + '^';
    textDiv.ondblclick = onedit;
    textDiv.onblur = onchangeTo;
    textDiv.innerText = val;
    let parentDiv = document.createElement('div');
    //show ui depending upon active / complete status
    (state == 'Completed') ? parentDiv.className = 'complete': parentDiv.className = 'list';
    parentDiv.id = idGenerator + 'list';
    parentDiv.append(textDiv, spanParentDiv);
    let parentOfWholeDiv = document.createElement('div');
    parentOfWholeDiv.id = idGenerator + 'TodoHeader';
    let input = document.createElement('input');
    input.placeholder = 'Add new sub Todo';
    input.className = 'input_sub';
    input.id = idGenerator + '_input';
    input.onkeydown = onaddSubTodo;
    let inputBtn = document.createElement('span');
    inputBtn.innerText = '➕';
    inputBtn.className = 'input_subBtn';
    inputBtn.id = idGenerator + '_addBtn';
    inputBtn.onclick = onaddSubTodo;
    parentOfWholeDiv.append(parentDiv, input, inputBtn);
    document.getElementById('todos').append(parentOfWholeDiv);
}

//add Data subTodo
function addSubTodoData(idGenerator, val, state, id, checker) {
    let span = document.createElement('button');
    span.className = "completed";
    span.id = idGenerator + 'CA';
    span.onclick = oncompleted;
    let span2 = addSpanTag('edit', idGenerator, onedit, '✎');
    let span3 = addSpanTag('remove', idGenerator, onremove, '🗑️');
    let spanParentDiv = document.createElement('div');
    spanParentDiv.append(span, span2, span3);
    let textDiv = document.createElement('div');
    textDiv.innerText = val;
    textDiv.className = 'textArea';
    textDiv.id = idGenerator + '^';
    textDiv.ondblclick = onedit;
    textDiv.onblur = onchangeTo;
    let parentOfWholeDiv = document.createElement('div');
    parentOfWholeDiv.append(textDiv, spanParentDiv);
    //show ui depending upon active / complete status
    (state == 'Completed') ? parentOfWholeDiv.className = 'complete_sub': parentOfWholeDiv.className = 'list_sub';
    parentOfWholeDiv.id = idGenerator + 'list_sub';
    document.getElementById(id + 'TodoHeader').append(parentOfWholeDiv);
    //if all sub todos are completed then add sub todo show parent todo is active
    if (checker) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                if (arr[i].status == 'Completed') {
                    document.getElementById(id + 'list').className = 'list';
                    arr[i].status = 'Active';
                }
            }
        }
        localStorage.setItem('todoData', JSON.stringify(arr));
    }
}

//if subTodos all are completed then show parent Todo completed, vice-versa
function checkForParentOrChildStatus(id, parent) {
    let c = 0;
    if (parent == 'list' || parent == 'complete') {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                if (arr[i].status == 'Completed') {
                    for (let j = 0; j < arr[i].subTodo.length; j++) {
                        arr[i].subTodo[j].status = 'Completed';
                        document.getElementById(arr[i].subTodo[j].id + 'list_sub').className = 'complete_sub';
                    }
                    localStorage.setItem('todoData', JSON.stringify(arr));
                } else {
                    for (let j = 0; j < arr[i].subTodo.length; j++) {
                        arr[i].subTodo[j].status = 'Active';
                        document.getElementById(arr[i].subTodo[j].id + 'list_sub').className = 'list_sub';
                    }
                    localStorage.setItem('todoData', JSON.stringify(arr));
                }
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].subTodo.length; j++) {
                if (arr[i].subTodo[j].status == 'Completed') {
                    c++;
                }
            }
            if (c == arr[i].subTodo.length && c > 0) {
                arr[i].status = 'Completed';
                document.getElementById(arr[i].id + 'list').className = 'complete';
            } else if (c != arr[i].subTodo.length) {
                arr[i].status = 'Active';
                document.getElementById(arr[i].id + 'list').className = 'list';
            }
            localStorage.setItem('todoData', JSON.stringify(arr));
            c = 0;
        }
    }
}