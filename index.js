
// 获取title节点
function post() {

    var title = document.getElementById("title");
    var datetime = document.getElementById("datetime");
    if (title.value.trim() == "") {
        alert("内容不能为空");
    } else {
        var data = loadData();
        if (datetime.value.trim() == "") {
            var todo = { "title": title.value, "done": false, "repeat": false, "date": "----------", "time": "----", "lastchecktime": "" };
        } else {
            var todo = { "title": title.value, "done": false, "repeat": false, "date": datetime.value.substring(0, 10), "time": datetime.value.substring(11, 16), "lastchecktime": "" };
        }
        data.push(todo);
        saveData(data);
        var form = document.getElementById("form");
        form.reset();
        load();
    }
}

//加载localstorage中数据
function loadData() {
    var collection = localStorage.getItem("todo");
    data = JSON.parse(collection);
    console.log(data);
    var today = getCurrTime().year.toString() + '-' + getCurrTime().month.toString() + '-' + getCurrTime().day.toString();
    if (data != null) {
        for (i = 0; i < data.length; i++) {
            if (data[i].repeat == true && data[i].lastchecktime != "" && data[i].lastchecktime != today)
                data[i].done = false;
        }
    }
    if (data != null) {
        return data;
    } else return [];
}
//存储数据
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
//存储数据
function saveData(data) {
    localStorage.setItem("todo", JSON.stringify(data));

}
//移除list中某一项
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
    setLastCheckTime(i);
}
function setLastCheckTime(i) {
    var data = loadData();
    data[i].lastchecktime = getCurrTime().year.toString() + '-' + getCurrTime().month.toString() + '-' + getCurrTime().day.toString();
    saveData(data);
}
//对list进行排序
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
//比较list时间先后顺序
function compare(i, j, data) {
    if (data == [])
        return i;
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
//编辑某一项todolist
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
//获取当前时间
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
//计算任务紧急程度
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
//通过数据加载界面
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
                    repeatString += "<li name='list' draggable='true' style='" + calculateTime(i) + "' ><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",true)' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",false)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    repeatCount++;
                } else {
                    repeatDoneString += "<li name='list' draggable='true'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",false)' checked='checked' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",false)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    repeatCount++;
                }
            } else {
                if (data[i].done) {
                    doneString += "<li name='list' draggable='true'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",false)' checked='checked' />" +
                        "<p id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].title + "</p>" +
                        "<div class='Date' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].date + "</div>" +
                        "<div class='Time' id='p-" + i + "' onclick='edit(" + i + ")'>" + data[i].time + "</div>" +
                        "<input class='repeat' type='image' src='./time.svg' onclick=update(" + i + ",\"repeat\",true)>" +
                        "<input class='delete' type='image' src='./delete.svg' onclick=remove(" + i + ")>";
                    doneCount++;
                } else {
                    todoString += "<li name='list' draggable='true' style='" + calculateTime(i) + "'><input type='checkbox' class='checkbox' onchange='update(" + i + ",\"done\",true)' />" +
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
        repeatcount.innerHTML = repeatCount;
        repeatlist.innerHTML = repeatString;
        repeatdonelist.innerHTML = repeatDoneString;
    } else {
        todocount.innerHTML = 0;
        todolist.innerHTML = "";
        donecount.innerHTML = 0;
        donelist.innerHTML = "";
        repeatcount.innerHTML = 0;
        repeatlist.innerHTML = "";
        repeatdonelist.innerHTML = "";
    }

}
//全部完成
function allFinish() {
    var data = loadData();
    for (i = 0; i < data.length; i++) {
        data[i].done = true;
    }
    saveData(data);
    load();
}
//清除全部localstorage
function clearall() {
    localStorage.clear();
    load();
}
//全部未完成
function allUnfinish() {
    var data = loadData();
    for (i = 0; i < data.length; i++) {
        data[i].done = false;
    }
    saveData(data);
    load();
}
function clearFinished() {
    var data = loadData();
    for (i = data.length - 1; i >= 0; i--) {
        if (data[i].done == true && data[i].repeat == false) {
            remove(i);
        }
    }
    load();
}
//控制左滑删除
function addListener() {
    var obj = document.querySelectorAll("li");
    var deviceWidth = window.innerWidth;
    var isDelete = false;
    var flag = 0;

    for (i = 0; i < obj.length; i++) {


        var p = i;
        var startX, startY;
        obj[i].addEventListener('touchstart', function (ev) {

            startX = ev.touches[0].pageX;
            startY = ev.touches[0].pageY;
        }, false);
        obj[i].addEventListener('touchmove', function (ev) {
            ev.preventDefault();
            var endX, endY;
            endX = ev.changedTouches[0].pageX;
            endY = ev.changedTouches[0].pageY;
            if (endX - startX < -deviceWidth / 3) {
                var data = loadData();
                var datum = { "title": this.querySelector("p").firstChild.data, "date": this.querySelectorAll("div")[0].firstChild.data, "time": this.querySelectorAll("div")[1].firstChild.data };
                for (j = 0; j < data.length; j++) {
                    if (data[j].title == datum.title && data[j].date == datum.date && data[j].time == datum.time) {
                        isDelete = true;
                        flag = j;
                    }


                }
            }
        }, false);
        obj[i].addEventListener('touchend', function (event) {
            if (isDelete && this != null) {
                remove(flag);
            }
            if (isDelete) {
                if (navigator.vibrate) {
                    navigator.vibrate(1000);
                } else if (navigator.webkitVibrate) {
                    navigator.webkitVibrate(1000);
                }
            }
            isDelete = false;
            flag = 0;
        }, false);
    }
}


window.onload = function () {
    load();
    addListener();
}



