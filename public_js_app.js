// Bilingual dictionary (extend as needed)
const dict = {
  en: {
    analyze: "Analyze",
    bmi: "BMI Calculator",
    ivdrip: "IV Drip Rate",
    vitalsref: "Vital Signs Reference",
    riskLow: "Low Risk",
    riskModerate: "Moderate Risk",
    riskHigh: "High Risk",
    alerts: {
      lowBP: "Very low blood pressure!",
      lowO2: "Oxygen saturation below safe level!",
      highTemp: "High fever!",
      abnormalHR: "Abnormal heart rate!"
    }
  },
  ar: {
    analyze: "تحليل",
    bmi: "حساب مؤشر كتلة الجسم",
    ivdrip: "حساب معدل المحلول الوريدي",
    vitalsref: "جدول المؤشرات الحيوية",
    riskLow: "خطر منخفض",
    riskModerate: "خطر متوسط",
    riskHigh: "خطر مرتفع",
    alerts: {
      lowBP: "انخفاض شديد في ضغط الدم!",
      lowO2: "تشبع الأكسجين أقل من الطبيعي!",
      highTemp: "ارتفاع شديد في الحرارة!",
      abnormalHR: "انحراف بمعدل النبض!"
    }
  }
};

let lang = "en"; // or "ar"
const langToggle = document.getElementById("lang-toggle");

function switchLang() {
  lang = (lang === "en") ? "ar" : "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
  langToggle.innerHTML = lang === "ar" ? "🇸🇦 العربية" : "🇬🇧 English";
  document.querySelectorAll("[data-en]").forEach(el=>{
    el.textContent = el.getAttribute("data-"+lang);
  });
  document.getElementById("footer-en").style.display = (lang==="en")?"inline":"none";
  document.getElementById("footer-ar").style.display = (lang==="ar")?"inline":"none";
  // Tab names update
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    const tool = btn.getAttribute("data-tool");
    btn.textContent = dict[lang][tool];
  });
  document.getElementById("submitBtn").textContent = dict[lang].analyze;
}

// Language toggle button
langToggle.addEventListener("click", switchLang);

// BMI Calculator
function bmiTool() {
  return `
    <div>
      <label>${lang==="ar"?"الوزن (كجم)":"Weight (kg)"}<input type="number" id="bmiWeight"></label>
      <label>${lang==="ar"?"الطول (سم)":"Height (cm)"}<input type="number" id="bmiHeight"></label>
      <button id="bmiCalcBtn">${lang==="ar"?"احسب":"Calculate BMI"}</button>
      <div id="bmiResult"></div>
    </div>
  `;
}

// IV Drip Rate Calculator
function ivDripTool() {
  return `
    <div>
      <label>${lang==="ar"?"حجم المحلول (مل)":"Fluid volume (ml)"}<input type="number" id="ivVolume"></label>
      <label>${lang==="ar"?"الزمن (دقيقة)":"Time (min)"}<input type="number" id="ivTime"></label>
      <label>${lang==="ar"?"قطرة/مل":"Drop factor (drops/ml)"}<input type="number" id="ivDF"></label>
      <button id="ivCalcBtn">${lang==="ar"?"احسب":"Calculate Rate"}</button>
      <div id="ivResult"></div>
    </div>
  `;
}

// Vital Signs Reference Table
function vitalsRefTool() {
  return `
    <div><b>${lang==="ar"?"المعدلات الطبيعية للعلامات الحيوية":"Normal Vital Sign Ranges"}</b>
      <table>
        <thead>
          <tr>
            <th>${lang==="ar"?"العمر":"Age"}</th>
            <th>${lang==="ar"?"ضغط الدم":"BP"}</th>
            <th>${lang==="ar"?"النبض":"HR"}</th>
            <th>${lang==="ar"?"حرارة":"Temp"}</th>
            <th>${lang==="ar"?"O₂":"O₂"}</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>${lang==="ar"?"بالغ":"Adult"}</td> <td>90-140/60-90</td> <td>60-100</td> <td>36-37.5</td> <td>>94%</td>
        </tr>
        <tr>
          <td>${lang==="ar"?"طفل":"Child"}</td> <td>80-120/50-80</td> <td>70-130</td> <td>36-37.5</td> <td>>95%</td>
        </tr>
        <tr>
          <td>${lang==="ar"?"رضيع":"Infant"}</td> <td>70-100/35-65</td> <td>100-160</td> <td>36-37.5</td> <td>>94%</td>
        </tr>
        </tbody>
      </table>
    </div>
  `;
}

function loadTool(tool) {
  let content = "";
  if(tool==="bmi") content = bmiTool();
  else if(tool==="ivdrip") content = ivDripTool();
  else if(tool==="vitalsref") content = vitalsRefTool();
  document.getElementById("nursing-tools").innerHTML = content;
  if(tool==="bmi") {
    document.getElementById("bmiCalcBtn").onclick = function() {
      const w = parseFloat(document.getElementById("bmiWeight").value);
      const h = parseFloat(document.getElementById("bmiHeight").value)/100;
      const bmi = w>0&&h>0 ? w/(h*h) : NaN;
      document.getElementById("bmiResult").innerText = isNaN(bmi) ? "" :
        (lang==="ar"?"مؤشر الكتلة: ":"BMI: ") + bmi.toFixed(2);
    };
  }
  if(tool==="ivdrip") {
    document.getElementById("ivCalcBtn").onclick = function() {
      const vol = parseFloat(document.getElementById("ivVolume").value);
      const time = parseFloat(document.getElementById("ivTime").value);
      const df = parseFloat(document.getElementById("ivDF").value);
      const drops = (vol>0 && time>0 && df>0) ? (vol*df/time).toFixed(1) : "";
      document.getElementById("ivResult").innerText = drops ? 
        (lang==="ar"?"معدل التقطير: ":"Drops/min: ")+drops : "";
    };
  }
}
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.onclick = function() {
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    loadTool(btn.getAttribute("data-tool"));
  };
});

// Form Handlers

function displayAnalysis(res) {
  // Object -> formatted HTML output, bilingual
  document.getElementById("ai-analysis").style.display = "block";
  let riskClass = res.risk==="High Risk"||res.risk==="خطر مرتفع"?'risk-high':
                  res.risk==="Moderate Risk"||res.risk==="خطر متوسط"?'risk-moderate':'risk-low';
  let riskBadge = `<span class="badge ${riskClass}">${res.risk}</span>`;
  
  let html = `
    <b data-en="Preliminary Condition Assessment" data-ar="التقييم الأولي">${lang==="ar"?"التقييم الأولي":"Preliminary Condition Assessment"}</b>:
    <ul>${res.conditions.map(c=>"<li>"+c+"</li>").join("")}</ul>
    <b data-en="Risk Level" data-ar="مستوى الخطورة">${lang==="ar"?"مستوى الخطورة":"Risk Level"}</b>: ${riskBadge}
    <br>
    <b data-en="Suggested Nursing Actions" data-ar="الإجراءات التمريضية">${lang==="ar"?"الإجراءات التمريضية":"Suggested Nursing Actions"}</b>:
    <ul>${res.actions.map(a=>"<li>"+a+"</li>").join("")}</ul>
    <b data-en="Warning Alerts" data-ar="تنبيهات">${lang==="ar"?"تنبيهات":"Warning Alerts"}</b>:
    <ul>${res.warnings.map(w=>"<li class='alert'>"+w+"</li>").join("")}</ul>
    <b data-en="Early Warning Prediction" data-ar="توقع تحذيري">${lang==="ar"?"توقع تحذيري":"Early Warning Prediction"}</b>:
    <div>${res.earlyWarning}</div>
  `;
  document.getElementById("ai-analysis").innerHTML = html;
}

// AI analysis stub (replace with actual API call for production)
async function analyzeVitals(data, lang="en") {
  // You'd replace this with OpenAI API/Claude or your backend service call
  // Demo logic ONLY:
  let risk = "Low Risk", riskAr="خطر منخفض";
  let conditions = [], actions = [], warnings = [], ew="";
  const systolic = +data.systolic, diastolic=+data.diastolic,
        hr=+data.heartRate, temp=+data.temperature, spo2=+data.spo2;
  let isShock = systolic<90 || hr>120;
  let isSepsis = temp>38.5 && hr>100;
  let isResp = spo2<92;
  let isInfect = temp>38;
  if(isShock) { conditions.push(lang==="ar"?"احتمال صدمة":"Possible Shock"); risk="High Risk"; riskAr="خطر مرتفع"; }
  if(isSepsis) { conditions.push(lang==="ar"?"احتمال تعفن الدم":"Possible Sepsis"); risk="High Risk"; riskAr="خطر مرتفع"; }
  if(isResp) { conditions.push(lang==="ar"?"ضائقة تنفسية":"Possible Respiratory Distress"); if(risk!=="High Risk") {risk="Moderate Risk"; riskAr="خطر متوسط";}}
  if(isInfect) { conditions.push(lang==="ar"?"احتمال عدوى":"Possible Infection"); if(risk==="Low Risk") {risk="Moderate Risk"; riskAr="خطر متوسط";}}
  actions=[
    lang==="ar"?"اعطاء أوكسجين إذا لزم الأمر":"Administer oxygen if needed",
    lang==="ar"?"مراقبة العلامات الحيوية كل ٥ دقائق":"Monitor vital signs every 5 minutes",
    lang==="ar"?"إبلاغ الطبيب فورًا عند التدهور":"Notify physician immediately if deterioration occurs",
    lang==="ar"?"جهز جهاز الطوارئ حسب الحاجة":"Prepare emergency equipment if necessary"
  ];
  if(systolic<80) warnings.push(dict[lang].alerts.lowBP);
  if(spo2<90) warnings.push(dict[lang].alerts.lowO2);
  if(temp>39) warnings.push(dict[lang].alerts.highTemp);
  if(hr<50||hr>140) warnings.push(dict[lang].alerts.abnormalHR);
  ew = (lang==="ar"?
    "مؤشرات تنبئ باحتمال تدهور سريري، الرجاء التنبيه الدائم والملاحظة الدقيقة.":"Indicators suggest potential for clinical deterioration. Close monitoring advised."
  );
  return {
    risk: (lang==="ar"?riskAr:risk),
    conditions,
    actions,
    warnings,
    earlyWarning: ew
  };
}

// Handle vitals analysis form submission
document.getElementById("vitals-form").onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    age: form.age.value,
    systolic: form.systolic.value,
    diastolic: form.diastolic.value,
    heartRate: form.heartRate.value,
    temperature: form.temperature.value,
    spo2: form.spo2.value,
    symptoms: form.symptoms.value
  };
  document.getElementById("submitBtn").setAttribute("aria-busy","true");
  const result = await analyzeVitals(data, lang);
  displayAnalysis(result);
  document.getElementById("submitBtn").setAttribute("aria-busy","false");
};

window.onload = function() {
  document.querySelector('.tab-btn[data-tool="bmi"]').click();
};