(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,23750,e=>{"use strict";var t=e.i(43476),r=e.i(47163);function i({className:e,type:i,...a}){return(0,t.jsx)("input",{type:i,"data-slot":"input",className:(0,r.cn)("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm","focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",e),...a})}e.s(["Input",()=>i])},86536,e=>{"use strict";let t=(0,e.i(75254).default)("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",()=>t],86536)},27612,e=>{"use strict";let t=(0,e.i(75254).default)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);e.s(["Trash2",()=>t],27612)},94918,e=>{"use strict";let t=(0,e.i(75254).default)("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);e.s(["FileSpreadsheet",()=>t],94918)},3408,e=>{"use strict";let t=(0,e.i(75254).default)("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);e.s(["default",()=>t])},97250,e=>{"use strict";let t=(0,e.i(75254).default)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);e.s(["Sun",()=>t],97250)},84765,e=>{"use strict";let t=(0,e.i(75254).default)("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);e.s(["Settings2",()=>t],84765)},73008,40594,e=>{"use strict";function t(e,t,r){if(!e)return"";let i=e;if(i=i.replace(/\{fullName\}/g,t?.fullName||t?.FullName||"").replace(/\{firstName\}/g,t?.firstName||t?.FirstName||"").replace(/\{lastName\}/g,t?.lastName||t?.LastName||"").replace(/\{rollNo\}/g,String(t?.rollNo||t?.RollNo||"")).replace(/\{className\}/g,t?.className||t?.ClassName||"").replace(/\{divisionName\}/g,t?.divisionName||t?.DivisionName||"").replace(/\{bloodGroup\}/g,t?.bloodGroup||t?.BloodGroup||"").replace(/\{dob\}/g,t?.dob||t?.DOB?new Date(t?.dob||t?.DOB).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"").replace(/\{schoolName\}/g,r?.schoolName||r?.SchoolName||"").replace(/\{schoolAddress\}/g,r?.schoolAddress||r?.SchoolAddress||"").replace(/\{parentName\}/g,t?.parentName||t?.ParentName||"").replace(/\{emergencyContact\}/g,t?.emergencyContact||t?.EmergencyContact||"").replace(/\{studentId\}/g,String(t?.studentId||t?.StudentId||"")).replace(/\{academicYear\}/g,t?.academicYear||t?.AcademicYear||""),t)for(let e of i.match(/\{[^}]+\}/g)||[]){let r=e.slice(1,-1),a=t[r]??Object.entries(t).find(([e])=>e.toLowerCase()===r.toLowerCase())?.[1]??"";i=i.replace(e,String(a))}return i}let r=()=>`el_${Date.now()}_${Math.random().toString(36).substr(2,6)}`;function i(e){let t={id:r(),x:10,y:10,width:30,height:10,rotation:0,visible:!0,locked:!1,opacity:1};switch(e){case"text":return{...t,type:e,text:"Text",fontSize:10,fontFamily:"Arial",color:"#000000",fontWeight:"normal",textAlign:"center"};case"image":return{...t,type:e,width:20,height:25,objectFit:"cover",borderRadius:2};case"barcode":return{...t,type:e,width:40,height:12,barcodeType:"code128",barcodeValue:"{rollNo}",showText:!0};case"qrcode":return{...t,type:e,width:15,height:15,qrValue:"{studentId}",qrErrorLevel:"M"};case"shape":return{...t,type:e,width:40,height:8,shapeType:"rectangle",backgroundColor:"#1d4ed8",borderRadius:2};case"line":return{...t,type:e,width:40,height:1,shapeType:"line",borderColor:"#000000",borderWidth:1};default:return{...t,type:e}}}function a(e,r,i,o,d,l,n,s="portrait"){let c="landscape"===s,h=c?`${d}mm`:`${o}mm`,p=c?`${o}mm`:`${d}mm`,u=e.map(e=>(function(e,r,i,a,o){if(!e.visible)return"";let d=(e.x/a*100).toFixed(3),l=(e.y/o*100).toFixed(3),n=(e.width/a*100).toFixed(3),s=(e.height/o*100).toFixed(3),c=`
    position:absolute;
    left:${d}%;
    top:${l}%;
    width:${n}%;
    height:${s}%;
    transform:rotate(${e.rotation||0}deg);
    opacity:${e.opacity??1};
    box-sizing:border-box;
    overflow:hidden;
  `,h=t(e.text||"",r,i),p=t(e.barcodeValue||(e.dataField?`{${e.dataField}}`:"000000"),r,i),u=t(e.qrValue||(e.dataField?`{${e.dataField}}`:"QR"),r,i);switch(e.type){case"text":return`
        <div style="${c}
          display:flex;
          align-items:center;
          justify-content:${"left"===e.textAlign?"flex-start":"right"===e.textAlign?"flex-end":"center"};
          font-size:${e.fontSize||10}pt;
          font-family:${e.fontFamily||"Arial"},sans-serif;
          font-weight:${e.fontWeight||"normal"};
          font-style:${e.fontStyle||"normal"};
          color:${e.color||"#000000"};
          white-space:nowrap;
          padding:0 1px;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">${h||""}</div>`;case"image":{let t="photoPath"===e.dataField?r?.photoPath||"":"schoolLogo"===e.dataField?i?.schoolLogo?`data:image/png;base64,${i.schoolLogo}`:"":e.src||"";return t?`<div style="${c}
            border-radius:${e.borderRadius||0}mm;
            -webkit-print-color-adjust:exact;
            print-color-adjust:exact;
          ">
            <img src="${t}"
              style="width:100%;height:100%;
                object-fit:${e.objectFit||"cover"};
                border-radius:${e.borderRadius||0}mm;
                display:block;" />
          </div>`:`<div style="${c}
            background:#e2e8f0;
            border-radius:${e.borderRadius||0}mm;
            display:flex;align-items:center;justify-content:center;
            font-size:6pt;color:#94a3b8;
          ">${"photoPath"===e.dataField?"Photo":"Image"}</div>`}case"shape":case"line":return`
        <div style="${c}
          background:${"line"===e.shapeType?"transparent":e.backgroundColor||"#1d4ed8"};
          border:${e.borderWidth||0}px solid ${e.borderColor||"transparent"};
          ${"line"===e.shapeType?`border-bottom:${e.borderWidth||1}px solid ${e.borderColor||"#000"};`:""}
          border-radius:${e.borderRadius||0}mm;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        "></div>`;case"barcode":return`
        <div style="${c}
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          background:#fff;
          font-family:'Libre Barcode 128',monospace;
          font-size:${2.5*(e.height||10)}pt;
          color:#000;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">
          <div style="font-size:inherit;line-height:1;">${p}</div>
          ${!1!==e.showText?`<div style="font-family:Arial;font-size:6pt;margin-top:1px;">${p}</div>`:""}
        </div>`;case"qrcode":let m=Math.min(e.width,e.height),f=`https://chart.googleapis.com/chart?chs=${Math.round(10*m)}x${Math.round(10*m)}&cht=qr&chl=${encodeURIComponent(u)}&choe=UTF-8`;return`
        <div style="${c}
          display:flex;align-items:center;justify-content:center;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">
          <img src="${f}"
            style="width:100%;height:100%;object-fit:contain;display:block;" />
        </div>`;default:return""}})(e,r,i,o,d)).join("\n");return`
    <div style="
      position:relative;
      width:${h};
      height:${p};
      overflow:hidden;
      background:${l};
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      box-sizing:border-box;
    ">
      ${n?`<img src="data:image/png;base64,${n}"
            style="position:absolute;inset:0;width:100%;height:100%;
              object-fit:cover;display:block;" />`:""}
      ${u}
    </div>`}function o(e,t,r,i,o,d,l,n,s,c,h,p,u){let m="landscape"===s,f=m?`${d}mm`:`${o}mm`,g=m?`${o}mm`:`${d}mm`,y=`brightness(${1+h/100})`,b=`contrast(${1+p/100})`,x="Front"===c||"Both"===c,$="Back"===c||"Both"===c,k="";for(let c=0;c<u;c++)for(let c of e)x&&(k+=a(r,c,t,o,d,l,n,s)),$&&(k+=a(i,c,t,o,d,"#f8fafc",void 0,s));return`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>ID Cards</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
    html,body {
      margin:0; padding:0; background:#fff;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
    }
    @page { size:${f} ${g}; margin:0; }
    body { filter:${y} ${b}; }
    @media print {
      *{
        -webkit-print-color-adjust:exact!important;
        print-color-adjust:exact!important;
      }
    }
  </style>
</head>
<body>
  ${k}
  <script>
    window.onload = function() {
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      if (!imgs.length) { window.print(); return; }
      imgs.forEach(function(img) {
        if (img.complete) { loaded++; if (loaded === imgs.length) window.print(); }
        else {
          img.onload = img.onerror = function() {
            loaded++;
            if (loaded === imgs.length) window.print();
          };
        }
      });
    };
  </script>
</body>
</html>`}e.s(["createDefaultElement",()=>i,"genId",0,r,"mmToPx",0,e=>3.7795275591*e,"resolveText",()=>t],40594),e.s(["buildDesignerPrintHtml",()=>o],73008)},54858,e=>{"use strict";e.s(["BASE_URL",0,"http://5.231.93.226:8181/api"])},63059,e=>{"use strict";var t=e.i(46349);e.s(["ChevronRight",()=>t.default])},71689,e=>{"use strict";let t=(0,e.i(75254).default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",()=>t],71689)},77705,e=>{"use strict";let t=(0,e.i(75254).default)("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);e.s(["EyeOff",()=>t],77705)},42078,e=>{e.v(t=>Promise.all(["static/chunks/d82ffea2b057bdc1.js","static/chunks/49458c2d41402225.js"].map(t=>e.l(t))).then(()=>t(70016)))}]);