(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,70065,e=>{"use strict";var t=e.i(43476),r=e.i(47163);function a({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"card",className:(0,r.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",e),...a})}function i({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"card-header",className:(0,r.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",e),...a})}function o({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"card-title",className:(0,r.cn)("leading-none font-semibold",e),...a})}function d({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"card-description",className:(0,r.cn)("text-muted-foreground text-sm",e),...a})}function n({className:e,...a}){return(0,t.jsx)("div",{"data-slot":"card-content",className:(0,r.cn)("px-6",e),...a})}e.s(["Card",()=>a,"CardContent",()=>n,"CardDescription",()=>d,"CardHeader",()=>i,"CardTitle",()=>o])},93969,e=>{"use strict";var t=e.i(43476);function r({title:e,description:r,action:a}){return(0,t.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"fs-4 fw-bold text-foreground",children:e}),r&&(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:r})]}),a&&(0,t.jsx)("div",{className:"flex-shrink-0",children:a})]})}e.s(["PageHeader",()=>r])},31278,e=>{"use strict";let t=(0,e.i(75254).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},73884,e=>{"use strict";let t=(0,e.i(75254).default)("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",()=>t],73884)},84765,e=>{"use strict";let t=(0,e.i(75254).default)("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);e.s(["Settings2",()=>t],84765)},97250,e=>{"use strict";let t=(0,e.i(75254).default)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);e.s(["Sun",()=>t],97250)},54858,e=>{"use strict";e.s(["BASE_URL",0,"https://api.idsidentity.com/api"])},73008,40594,e=>{"use strict";function t(e,t,r){if(!e)return"";let a=e;if(a=a.replace(/\{fullName\}/g,t?.fullName||t?.FullName||"").replace(/\{firstName\}/g,t?.firstName||t?.FirstName||"").replace(/\{lastName\}/g,t?.lastName||t?.LastName||"").replace(/\{rollNo\}/g,String(t?.rollNo||t?.RollNo||"")).replace(/\{className\}/g,t?.className||t?.ClassName||"").replace(/\{divisionName\}/g,t?.divisionName||t?.DivisionName||"").replace(/\{bloodGroup\}/g,t?.bloodGroup||t?.BloodGroup||"").replace(/\{dob\}/g,t?.dob||t?.DOB?new Date(t?.dob||t?.DOB).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"").replace(/\{schoolName\}/g,r?.schoolName||r?.SchoolName||"").replace(/\{schoolAddress\}/g,r?.schoolAddress||r?.SchoolAddress||"").replace(/\{parentName\}/g,t?.parentName||t?.ParentName||"").replace(/\{emergencyContact\}/g,t?.emergencyContact||t?.EmergencyContact||"").replace(/\{studentId\}/g,String(t?.studentId||t?.StudentId||"")).replace(/\{academicYear\}/g,t?.academicYear||t?.AcademicYear||""),t)for(let e of a.match(/\{[^}]+\}/g)||[]){let r=e.slice(1,-1),i=t[r]??Object.entries(t).find(([e])=>e.toLowerCase()===r.toLowerCase())?.[1]??"";a=a.replace(e,String(i))}return a}let r=()=>`el_${Date.now()}_${Math.random().toString(36).substr(2,6)}`;function a(e){let t={id:r(),x:10,y:10,width:30,height:10,rotation:0,visible:!0,locked:!1,opacity:1};switch(e){case"text":return{...t,type:e,text:"Text",fontSize:10,fontFamily:"Arial",color:"#000000",fontWeight:"normal",textAlign:"center"};case"image":return{...t,type:e,width:20,height:25,objectFit:"cover",borderRadius:2};case"barcode":return{...t,type:e,width:40,height:12,barcodeType:"code128",barcodeValue:"{rollNo}",showText:!0};case"qrcode":return{...t,type:e,width:15,height:15,qrValue:"{studentId}",qrErrorLevel:"M"};case"shape":return{...t,type:e,width:40,height:8,shapeType:"rectangle",backgroundColor:"#1d4ed8",borderRadius:2};case"line":return{...t,type:e,width:40,height:1,shapeType:"line",borderColor:"#000000",borderWidth:1};default:return{...t,type:e}}}function i(e,r,a,o,d,n,s,l="portrait"){let c="landscape"===l,u=c?`${d}mm`:`${o}mm`,h=c?`${o}mm`:`${d}mm`,p=e.map(e=>(function(e,r,a,i,o){if(!e.visible)return"";let d=(e.x/i*100).toFixed(3),n=(e.y/o*100).toFixed(3),s=(e.width/i*100).toFixed(3),l=(e.height/o*100).toFixed(3),c=`
    position:absolute;
    left:${d}%;
    top:${n}%;
    width:${s}%;
    height:${l}%;
    transform:rotate(${e.rotation||0}deg);
    opacity:${e.opacity??1};
    box-sizing:border-box;
    overflow:hidden;
  `,u=t(e.text||"",r,a),h=t(e.barcodeValue||(e.dataField?`{${e.dataField}}`:"000000"),r,a),p=t(e.qrValue||(e.dataField?`{${e.dataField}}`:"QR"),r,a);switch(e.type){case"text":return`
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
        ">${u||""}</div>`;case"image":{let t="photoPath"===e.dataField?r?.photoPath||"":"schoolLogo"===e.dataField?a?.schoolLogo?`data:image/png;base64,${a.schoolLogo}`:"":e.src||"";return t?`<div style="${c}
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
          <div style="font-size:inherit;line-height:1;">${h}</div>
          ${!1!==e.showText?`<div style="font-family:Arial;font-size:6pt;margin-top:1px;">${h}</div>`:""}
        </div>`;case"qrcode":let m=Math.min(e.width,e.height),f=`https://chart.googleapis.com/chart?chs=${Math.round(10*m)}x${Math.round(10*m)}&cht=qr&chl=${encodeURIComponent(p)}&choe=UTF-8`;return`
        <div style="${c}
          display:flex;align-items:center;justify-content:center;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">
          <img src="${f}"
            style="width:100%;height:100%;object-fit:contain;display:block;" />
        </div>`;default:return""}})(e,r,a,o,d)).join("\n");return`
    <div style="
      position:relative;
      width:${u};
      height:${h};
      overflow:hidden;
      background:${n};
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      box-sizing:border-box;
    ">
      ${s?`<img src="data:image/png;base64,${s}"
            style="position:absolute;inset:0;width:100%;height:100%;
              object-fit:cover;display:block;" />`:""}
      ${p}
    </div>`}function o(e,t,r,a,o,d,n,s,l,c,u,h,p){let m="landscape"===l,f=m?`${d}mm`:`${o}mm`,g=m?`${o}mm`:`${d}mm`,y=`brightness(${1+u/100})`,b=`contrast(${1+h/100})`,x="Front"===c||"Both"===c,v="Back"===c||"Both"===c,k="";for(let c=0;c<p;c++)for(let c of e)x&&(k+=i(r,c,t,o,d,n,s,l)),v&&(k+=i(a,c,t,o,d,"#f8fafc",void 0,l));return`<!DOCTYPE html>
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
</html>`}e.s(["createDefaultElement",()=>a,"genId",0,r,"mmToPx",0,e=>3.7795275591*e,"resolveText",()=>t],40594),e.s(["buildDesignerPrintHtml",()=>o],73008)},25959,27365,61659,39399,6062,95468,27516,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(20783),i=e.i(30030),o=e.i(81140),d=e.i(69340),n=e.i(99682),s=e.i(35804),l=e.i(96626),c=e.i(48425),u="Checkbox",[h,p]=(0,i.createContextScope)(u),[m,f]=h(u),g=r.forwardRef((e,i)=>{let{__scopeCheckbox:n,name:s,checked:l,defaultChecked:u,required:h,disabled:p,value:f="on",onCheckedChange:g,form:y,...b}=e,[$,w]=r.useState(null),j=(0,a.useComposedRefs)(i,e=>w(e)),C=r.useRef(!1),N=!$||y||!!$.closest("form"),[z=!1,M]=(0,d.useControllableState)({prop:l,defaultProp:u,onChange:g}),S=r.useRef(z);return r.useEffect(()=>{let e=$?.form;if(e){let t=()=>M(S.current);return e.addEventListener("reset",t),()=>e.removeEventListener("reset",t)}},[$,M]),(0,t.jsxs)(m,{scope:n,state:z,disabled:p,children:[(0,t.jsx)(c.Primitive.button,{type:"button",role:"checkbox","aria-checked":v(z)?"mixed":z,"aria-required":h,"data-state":k(z),"data-disabled":p?"":void 0,disabled:p,value:f,...b,ref:j,onKeyDown:(0,o.composeEventHandlers)(e.onKeyDown,e=>{"Enter"===e.key&&e.preventDefault()}),onClick:(0,o.composeEventHandlers)(e.onClick,e=>{M(e=>!!v(e)||!e),N&&(C.current=e.isPropagationStopped(),C.current||e.stopPropagation())})}),N&&(0,t.jsx)(x,{control:$,bubbles:!C.current,name:s,value:f,checked:z,required:h,disabled:p,form:y,style:{transform:"translateX(-100%)"},defaultChecked:!v(u)&&u})]})});g.displayName=u;var y="CheckboxIndicator",b=r.forwardRef((e,r)=>{let{__scopeCheckbox:a,forceMount:i,...o}=e,d=f(y,a);return(0,t.jsx)(l.Presence,{present:i||v(d.state)||!0===d.state,children:(0,t.jsx)(c.Primitive.span,{"data-state":k(d.state),"data-disabled":d.disabled?"":void 0,...o,ref:r,style:{pointerEvents:"none",...e.style}})})});b.displayName=y;var x=e=>{let{control:a,checked:i,bubbles:o=!0,defaultChecked:d,...l}=e,c=r.useRef(null),u=(0,n.usePrevious)(i),h=(0,s.useSize)(a);r.useEffect(()=>{let e=c.current,t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(u!==i&&t){let r=new Event("click",{bubbles:o});e.indeterminate=v(i),t.call(e,!v(i)&&i),e.dispatchEvent(r)}},[u,i,o]);let p=r.useRef(!v(i)&&i);return(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:d??p.current,...l,tabIndex:-1,ref:c,style:{...e.style,...h,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function v(e){return"indeterminate"===e}function k(e){return v(e)?"indeterminate":e?"checked":"unchecked"}var $=e.i(78784),w=e.i(47163);function j({className:e,...r}){return(0,t.jsx)(g,{"data-slot":"checkbox",className:(0,w.cn)("peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...r,children:(0,t.jsx)(b,{"data-slot":"checkbox-indicator",className:"flex items-center justify-center text-current transition-none",children:(0,t.jsx)($.CheckIcon,{className:"size-3.5"})})})}e.s(["Checkbox",()=>j],25959);var C=e.i(75254);let N=(0,C.default)("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);e.s(["FileDown",()=>N],27365);let z=(0,C.default)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);e.s(["CreditCard",()=>z],61659);let M=(0,C.default)("Contrast",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 18a6 6 0 0 0 0-12v12z",key:"j4l70d"}]]);e.s(["Contrast",()=>M],39399);let S=(0,C.default)("Move",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m19 9 3 3-3 3",key:"1mg7y2"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]]);e.s(["Move",()=>S],6062);let F=(0,C.default)("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",()=>F],95468);let P=(0,C.default)("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);e.s(["History",()=>P],27516)}]);