function clear() {
    localStorage.clear();
    load();
}

function postaction() {
    // 获取title节点
    var title = document.getElementById("title");
    var datetime = document.getElementById("datetime");
    if (title.value.trim() == "") {
        alert("内容不能为空");
    } else {
        var data = loadData();
        if (datetime.value.trim() == "") {
            var todo = { "title": title.value, "done": false, "repeat": false, "date": "----------", "time": "----" };
        } else {
            var todo = { "title": title.value, "done": false, "repeat": false, "date": datetime.value.substring(0, 10), "time": datetime.value.substring(11, 16) };
        }
        data.push(todo);
        saveData(data);
        var form = document.getElementById("form");
        form.reset();
        load();
    }
}

function loadData() {
    var collection = localStorage.getItem("todo");
    if (collection != null) {
        return JSON.parse(collection);
    } else return [];
}

function saveSort() {
    var todolist = document.getElementById("todolist");
    var donelist = document.getElementById("donelist");
    var repeatlist = document.getElementById("repeatlist");
    var ts = todolist.getElementsByTagName("p");
    var ds = donelist.getElementsByTagName("p");
    var rs = donelist.getElementsByTagName("p");
    var data = [];
    for (i = 0; i < ts.length; i++) {
        var todo = { "title": ts[i].innerHTML, "done": false };
        data.unshift(todo);
    }
    for (i = 0; i < ds.length; i++) {
        var todo = { "title": ds[i].innerHTML, "done": true };
        data.unshift(todo);
    }
    for (i = 0; i < rs.length; i++) {
        var todo = { "title": rs[i].innerHTML, "done": false };
        data.unshift(todo);
    }

    saveData(data);
}

function saveData(data) {
    localStorage.setItem("todo", JSON.stringify(data));
}

function remove(i) {
    var data = loadData();
    var todo = data.splice(i, 1)[0];
    saveData(data);
    load();
}

function update(i, field, value) {
    var data = loadData();
    var todo = data.splice(i, 1)[0];
    todo[field] = value;
    data.splice(i, 0, todo);
    saveData(data);
    load();
}
function sort() {
    var data = loadData();
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            for (j = 0; j < data.length - 1 - i; j++) {
                if (compare(j, j + 1, data) == j + 1) {

                    var temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        saveData(data);
    }

}
function compare(i, j, data) {
    if (data[j].date.substring(0, 4) == '----')
        return i;
    else if (data[i].date.substring(0, 4) == '----')
        return j;
    else {
        if (parseInt(data[i].date.substring(0, 4)) < parseInt(data[j].date.substring(0, 4)))
            return i;
        else if (parseInt(data[i].date.substring(0, 4)) > parseInt(data[j].date.substring(0, 4)))
            return j;
        else {
            if (parseInt(data[i].date.substring(5, 7)) < parseInt(data[j].date.substring(5, 7)))
                return i;
            else if (parseInt(data[i].date.substring(5, 7)) > parseInt(data[j].date.substring(5, 7)))
                return j;
            else {
                if (parseInt(data[i].date.substring(8, 10)) < parseInt(data[j].date.substring(8, 10)))
                    return i;
                else if (parseInt(data[i].date.substring(8, 10)) > parseInt(data[j].date.substring(8, 10)))
                    return j;
                else {
                    if (parseInt(data[i].time.substring(0, 2)) < parseInt(data[j].time.substring(0, 2)))
                        return i;
                    else if (parseInt(data[i].time.substring(0, 2)) > parseInt(data[j].time.substring(0, 2)))
                        return j;
                    else {
                        if (parseInt(data[i].time.substring(3, 5)) < parseInt(data[j].time.substring(3, 5)))
                            return i;
                        else if (parseInt(data[i].time.substring(3, 5)) > parseInt(data[j].time.substring(3, 5)))
                            return j;
                        else
                            return i;
                    }
                }
            }
        }
    }

}

function edit(i) {
    load();
    var p = document.getElementById("p-" + i);
    title = p.innerHTML;
    p.innerHTML = "<input id='input-" + i + "' value='" + title + "' />";
    var input = document.getElementById("input-" + i);
    input.setSelectionRange(0, input.value.length);
    input.focus();
    input.onblur = function () {
        if (input.value.length == 0) {
            p.innerHTML = title;
            alert("内容不能为空");
        } else {
            update(i, "title", input.value);
        }
    };
}
function getCurrTime() {
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth();
    var day = t.getDate();
    var hour = t.getHours();
    var minute = t.getMinutes();
    var currTime = { "year": year, "month": month + 1, "day": day, "hour": hour, "minute": minute };
    return currTime;
}
function calculateTime(i) {
    var data = loadData();
    var currTime = getCurrTime();
    if (data[i].date.substring(0, 4) == '----')
        return;
    if (parseInt(data[i].date.substring(0, 4)) < currTime.year)
        return 'border-left: 10px solid #707075;'
    if (parseInt(data[i].date.substring(0, 4)) > currTime.year)
        return 'border-left: 10px solid #eab700;'
    if (parseInt(data[i].date.substring(5, 7)) < currTime.month)
        return 'border-left: 10px solid #707075;'
    if (parseInt(data[i].date.substring(5, 7)) > currTime.month)
        return 'border-left: 10px solid #eab700;'
    if (parseInt(data[i].date.substring(8, 10)) < currTime.day)
        return 'border-left: 10px solid #707075;'
    if (parseInt(data[i].date.substring(8, 10)) > currTime.day)
        return 'border-left: 10px solid #ea8000;'
    if (parseInt(data[i].time.substring(0, 2)) < currTime.hour)
        return 'border-left: 10px solid #707075;'
    if (parseInt(data[i].time.substring(0, 2)) > currTime.hour)
        return 'border-left: 10px solid #fb372c;'
    if (parseInt(data[i].time.substring(3, 5)) < currTime.minute)
        return 'border-left: 10px solid #707075;'
    return 'border-left: 10px solid #fb372c;'



}

function load() {
    sort();
    var todolist = document.getElementById("todolist");
    var donelist = document.getElementById("donelist");
    var repeatlist = document.getElementById("repeatlist");
    var repeatdonelist = document.getElementById("repeatdonelist");
    var collection = localStorage.getItem("todo");
    var todoCount = 0;
    var doneCount = 0;
    var repeatCount = 0;
    var todoString = "";
    var doneString = "";
    var repeatString = "";
    var repeatDoneString = "";
    if (collection != null) {
        var data = JSON.parse(collection);

        for (var i = 0; i < data.length; i++) {
            if (data[i].repeat) {
                if (!data[i].done) {
                    repeatString += "<li draggable='true' style='" + calculateTime(i) + "' ><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",true)' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",false)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    repeatCount++;
                } else {
                    repeatDoneString += "<li draggable='true'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",false)' checked='checked' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",false)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    repeatCount++;
                }
            } else {
                if (data[i].done) {
                    doneString += "<li draggable='true'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",false)' checked='checked' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",true)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    doneCount++;
                } else {
                    todoString += "<li draggable='true' style='" + calculateTime(i) + "'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",true)' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",true)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    todoCount++;
                }
            }




        };
        todocount.innerHTML = todoCount;
        todolist.innerHTML = todoString;
        donecount.innerHTML = doneCount;
        donelist.innerHTML = doneString;
        repeatCount.innerHTML = repeatCount;
        repeatlist.innerHTML = repeatString;
        repeatdonelist.innerHTML = repeatDoneString;
    } else {
        todocount.innerHTML = 0;
        todolist.innerHTML = "";
        donecount.innerHTML = 0;
        donelist.innerHTML = "";
        repeatCount.innerHTML = 0;
        repeatlist.innerHTML = "";
        repeatdonelist.innerHTML = "";
    }

}

function allFinish() {
    var data = loadData();
    for (i = 0; i < data.length; i++) {
        data[i].done = true;
    }
    saveData(data);
    load();
}

function allUnfinish() {
    var data = loadData();
    for (i = 0; i < data.length; i++) {
        data[i].done = false;
    }
    saveData(data);
    load();
}



window.onload = load;

  // window.addEventListener("storage", load, false);