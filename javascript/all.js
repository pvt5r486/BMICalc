//宣告
var calcBtn = document.querySelector('.resultBtn');
var state = document.querySelector('.state');
var info = document.querySelector('.resultInfo');
var reCalc = document.querySelector('.recalc');
var height = document.querySelector('#height');
var weight = document.querySelector('#weight');
var content = document.querySelector('.content');
var BMIdata = JSON.parse(localStorage.getItem('BMIrecord')) || [];
var recordSize = 6;

//計算
function calcBMI(e) {
    e.preventDefault();
    if (height.value == '' || weight.value == '') { return }
    //轉成公尺
    var heightValue = parseFloat(height.value) / 100;
    var weightValue = parseFloat(weight.value);
    var BMI = weightValue / (heightValue * heightValue);
    //小數第二位四捨五入
    BMI = Math.round(BMI * 100) / 100;
    //處理時間格式 06-19-2017
    var now = new Date();

    //存進物件
    var result = {
        status: BMIinfo(BMI),
        bmi: BMI,
        wei: weightValue,
        hei: heightValue * 100,
        date: paddingLeft((now.getMonth() + 1).toString(), 2) + '-' + paddingLeft(now.getDate().toString(), 2) + '-' + now.getFullYear()
    };

    //在陣列尾端加入剛剛新增的'物件'
    BMIdata.push(result);
    //存入
    localStorage.setItem('BMIrecord', JSON.stringify(BMIdata));
    //重新渲染畫面
    update(BMIdata.reverse());
    //清除欄位
    height.value = '';
    weight.value = '';

    //根據結果 切換按鈕
    var circleClassname = '';
    var infoClassname = ''
    var linkBg = '';
    switch (result.status) {
        case '過輕':
            circleClassname = 'tooThincircle';
            infoClassname = 'tooThintext';
            linkBg = 'tooThinbg';
            break;
        case '理想':
            circleClassname = 'goodcircle';
            infoClassname = 'goodtext';
            linkBg = 'goodbg';
            break;
        case '輕度肥胖':
            circleClassname = 'littleHeavycircle';
            infoClassname = 'littleHeavytext';
            linkBg = 'littlebg';
            break;
        case '中度肥胖':
            circleClassname = 'heavycircle';
            infoClassname = 'heavytext';
            linkBg = 'heavybg';
            break;
        case '重度肥胖':
            circleClassname = 'veryfatcircle';
            infoClassname = 'veryfattext';
            linkBg = 'veryfatbg';
            break;
    }
    calcBtn.setAttribute('class', 'resultBtn active');
    state.setAttribute('class', 'state show BMI ' + circleClassname);
    info.setAttribute('class', 'resultInfo BMI ' + infoClassname);
    info.textContent = result.status;
    reCalc.setAttribute('class', 'recalc BMI ' + linkBg);
}
//update
function update(data) {
    //取得當前頁數
    var nowPage = parseInt(localStorage.getItem('pagerNumber')) || 1;
    var count = 0;
    var str = '';
    var selectStr = '';
    var len = data.length;
    //共分幾頁
    var totalPage = Math.ceil(len / recordSize);

    //j必須陣列索引內
    for (var i = recordSize * (nowPage - 1); i < len; i++) {
        if (count < recordSize) {

            switch (data[i].status) {
                case '過輕':
                    classname = 'tooThin';
                    break;
                case '理想':
                    classname = 'good';
                    break;
                case '輕度肥胖':
                    classname = 'littleHeavy';
                    break;
                case '中度肥胖':
                    classname = 'heavy';
                    break;
                case '重度肥胖':
                    classname = 'veryfat';
                    break;
            }
            //組字串
            str = str +
                '<div class="recordblock">' +
                '<span class="colorBlock ' + classname + '"></span>' +
                '<ul class="record">' +
                '<li>' + data[i].status + '</li>' +
                '<li><span>BMI</span>' + data[i].bmi + '</li>' +
                '<li><span>weight</span>' + data[i].wei + 'kg</li>' +
                '<li><span>height</span>' + data[i].hei + 'cm</li>' +
                '<li><span>' + data[i].date + '</span></li>' +
                '</ul>' + '</div>';

            //str = str + data[i];
            count = count + 1;
        }
    }

    for (var j = 0; j < totalPage; j++) {
        selectStr = selectStr + '<option value="' + (j + 1) + '">第' + (j + 1) + '頁</option>';
    }


    if(data.length == 0){return}
    content.innerHTML = '<h2 class="title">BMI 紀錄</h2>' + str +
        ' <select name="pagerSelect" id="pagerSelect">' + selectStr + '</select>';

    //因為是動態產生SELECT 所以要在這綁定
    var pagerSelect = document.querySelector('#pagerSelect');
    pagerSelect.addEventListener('change', changePage, false);
    //選單跳到對應分頁
    pagerSelect.value = nowPage;
}
//檢查INPUT
function checkInput(e) {
    if (e.target.name == 'height') {
        var heightLabel = document.querySelector('#heightlabel');
        if (height.value == '') {
            heightLabel.style.color = 'red';
            heightLabel.style.fontSize = '12px';
            heightLabel.textContent = '本區塊欄位不可為空';
            height.focus();
        } else {
            heightLabel.textContent = '身高 cm';
            heightLabel.style.fontSize = '18px';
            heightLabel.style.color = '#FFD366';
        }
    } else {
        var weightLabel = document.querySelector('#weightlabel');
        if (weight.value == '') {
            weightLabel.style.color = 'red';
            weightLabel.style.fontSize = '12px';
            weightLabel.textContent = '本區塊欄位不可為空'
            weight.focus();
        } else {
            weightLabel.textContent = '體重 kg';
            weightLabel.style.fontSize = '18px';
            weightLabel.style.color = '#FFD366';
        }
    }
}
//左邊補0
function paddingLeft(str, lenght) {
    if (str.length >= lenght) {
        return str;
    } else {
        return paddingLeft("0" + str, lenght);
    }

}
//BMI判斷
function BMIinfo(BMI) {
    //訂定BMI對應狀態
    var status = '';
    if (BMI < 18.5) {
        status = '過輕';
    } else if (18.5 <= BMI && BMI < 25) {
        status = '理想';
    } else if (25 <= BMI && BMI < 30) {
        status = '輕度肥胖';
    } else if (30 <= BMI && BMI < 35) {
        status = '中度肥胖';
    } else if (BMI >= 35) {
        status = '重度肥胖';
    }
    return status
}
//再次計算
function reset(e) {
    e.preventDefault();
    //切換CLASS
    calcBtn.setAttribute('class', 'resultBtn');
    state.setAttribute('class', 'state BMI goodcircle');
    info.setAttribute('class', 'resultInfo BMI goodtext');
    reCalc.setAttribute('class', 'recalc BMI goodbg');
}

//換頁處理
function changePage(e) {
    //取得選取項目之VALUE
    var selectValue = e.target.value;
    //console.log(selectValue);
    localStorage.setItem('pagerNumber',selectValue);
    update(BMIdata);
}



//頁面載入時運行
update(BMIdata.reverse());
//監聽
calcBtn.addEventListener('click', calcBMI, false);
height.addEventListener('blur', checkInput, false);
weight.addEventListener('blur', checkInput, false);
reCalc.addEventListener('click', reset, false);
