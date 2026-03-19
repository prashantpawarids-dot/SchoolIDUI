(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93969,e=>{"use strict";var t=e.i(43476);function i({title:e,description:i,action:s}){return(0,t.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"fs-4 fw-bold text-foreground",children:e}),i&&(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:i})]}),s&&(0,t.jsx)("div",{className:"flex-shrink-0",children:s})]})}e.s(["PageHeader",()=>i])},25959,27365,61659,54858,e=>{"use strict";var t=e.i(43476),i=e.i(71645),s=e.i(20783),l=e.i(30030),d=e.i(81140),r=e.i(69340),a=e.i(99682),n=e.i(35804),o=e.i(96626),c=e.i(48425),h="Checkbox",[m,x]=(0,l.createContextScope)(h),[f,g]=m(h),u=i.forwardRef((e,l)=>{let{__scopeCheckbox:a,name:n,checked:o,defaultChecked:h,required:m,disabled:x,value:g="on",onCheckedChange:u,form:p,...v}=e,[w,k]=i.useState(null),S=(0,s.useComposedRefs)(l,e=>k(e)),C=i.useRef(!1),N=!w||p||!!w.closest("form"),[I=!1,$]=(0,r.useControllableState)({prop:o,defaultProp:h,onChange:u}),B=i.useRef(I);return i.useEffect(()=>{let e=w?.form;if(e){let t=()=>$(B.current);return e.addEventListener("reset",t),()=>e.removeEventListener("reset",t)}},[w,$]),(0,t.jsxs)(f,{scope:a,state:I,disabled:x,children:[(0,t.jsx)(c.Primitive.button,{type:"button",role:"checkbox","aria-checked":j(I)?"mixed":I,"aria-required":m,"data-state":y(I),"data-disabled":x?"":void 0,disabled:x,value:g,...v,ref:S,onKeyDown:(0,d.composeEventHandlers)(e.onKeyDown,e=>{"Enter"===e.key&&e.preventDefault()}),onClick:(0,d.composeEventHandlers)(e.onClick,e=>{$(e=>!!j(e)||!e),N&&(C.current=e.isPropagationStopped(),C.current||e.stopPropagation())})}),N&&(0,t.jsx)(b,{control:w,bubbles:!C.current,name:n,value:g,checked:I,required:m,disabled:x,form:p,style:{transform:"translateX(-100%)"},defaultChecked:!j(h)&&h})]})});u.displayName=h;var p="CheckboxIndicator",v=i.forwardRef((e,i)=>{let{__scopeCheckbox:s,forceMount:l,...d}=e,r=g(p,s);return(0,t.jsx)(o.Presence,{present:l||j(r.state)||!0===r.state,children:(0,t.jsx)(c.Primitive.span,{"data-state":y(r.state),"data-disabled":r.disabled?"":void 0,...d,ref:i,style:{pointerEvents:"none",...e.style}})})});v.displayName=p;var b=e=>{let{control:s,checked:l,bubbles:d=!0,defaultChecked:r,...o}=e,c=i.useRef(null),h=(0,a.usePrevious)(l),m=(0,n.useSize)(s);i.useEffect(()=>{let e=c.current,t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(h!==l&&t){let i=new Event("click",{bubbles:d});e.indeterminate=j(l),t.call(e,!j(l)&&l),e.dispatchEvent(i)}},[h,l,d]);let x=i.useRef(!j(l)&&l);return(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:r??x.current,...o,tabIndex:-1,ref:c,style:{...e.style,...m,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function j(e){return"indeterminate"===e}function y(e){return j(e)?"indeterminate":e?"checked":"unchecked"}var w=e.i(78784),k=e.i(47163);function S({className:e,...i}){return(0,t.jsx)(u,{"data-slot":"checkbox",className:(0,k.cn)("peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...i,children:(0,t.jsx)(v,{"data-slot":"checkbox-indicator",className:"flex items-center justify-center text-current transition-none",children:(0,t.jsx)(w.CheckIcon,{className:"size-3.5"})})})}e.s(["Checkbox",()=>S],25959);var C=e.i(75254);let N=(0,C.default)("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);e.s(["FileDown",()=>N],27365);let I=(0,C.default)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);e.s(["CreditCard",()=>I],61659),e.i(47167),e.s(["BASE_URL",0,"http://5.231.93.226:7135/api"],54858)},95922,e=>{"use strict";var t=e.i(43476),i=e.i(71645),s=e.i(93969),l=e.i(70065),d=e.i(67881),r=e.i(25959),a=e.i(62870),n=e.i(10708),o=e.i(94179),c=e.i(3281),h=e.i(27365),m=e.i(84614),x=e.i(61659),f=e.i(54858);let g=e=>e?new Date(e).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}):"";function u(e,t,i="#ffffff"){return`
    <div style="
      background:rgba(255,255,255,0.20);
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      border-radius:1.2mm;padding:1.2mm 2mm;text-align:center;
    ">
      <div style="font-size:5pt;color:rgba(255,255,255,0.78);margin-bottom:0.5mm;">${e}</div>
      <div style="font-size:7.5pt;font-weight:700;color:${i};">${t}</div>
    </div>`}function p({student:e,school:i}){let s="#1e3a8a";return(0,t.jsxs)("div",{style:{fontFamily:"Arial,Helvetica,sans-serif",width:"100%"},children:[(0,t.jsxs)("div",{style:{borderRadius:8,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,0.22)",marginBottom:8},children:[(0,t.jsxs)("div",{style:{background:s,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"8px 10px 7px",borderBottom:"1px solid rgba(255,255,255,0.22)"},children:[(0,t.jsx)("div",{style:{width:28,height:28,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:(0,t.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:s,strokeWidth:"2.2",children:[(0,t.jsx)("path",{d:"M22 10v6M2 10l10-5 10 5-10 5z"}),(0,t.jsx)("path",{d:"M6 12v5c3 3 9 3 12 0v-5"})]})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontSize:10.5,fontWeight:700,color:"#fff",lineHeight:1.3},children:i.schoolName}),(0,t.jsx)("div",{style:{fontSize:7,color:"rgba(255,255,255,0.80)",letterSpacing:.7},children:"STUDENT IDENTITY CARD"})]})]}),(0,t.jsxs)("div",{style:{background:"#1d4ed8",display:"flex",alignItems:"center",gap:10,padding:"8px 10px"},children:[(0,t.jsx)("div",{style:{width:44,height:55,flexShrink:0,borderRadius:4,overflow:"hidden",background:"#fff",border:"2px solid rgba(255,255,255,0.55)"},children:e.photoPath?(0,t.jsx)("img",{src:e.photoPath,alt:e.fullName,style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}):(0,t.jsx)("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsxs)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:s,children:[(0,t.jsx)("circle",{cx:"12",cy:"8",r:"4"}),(0,t.jsx)("path",{d:"M4 20c0-4 3.6-7 8-7s8 3 8 7"})]})})}),(0,t.jsxs)("div",{style:{flex:1},children:[(0,t.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.2},children:e.fullName}),(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4},children:[["Class",`${e.className}-${e.divisionName}`,"#fff"],["Roll No",String(e.rollNo||""),"#fff"],["Blood",e.bloodGroup||"","#fde047"],["DOB",g(e.dob),"#fff"]].map(([e,i,s])=>(0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.20)",borderRadius:3,padding:"3px 6px",textAlign:"center"},children:[(0,t.jsx)("div",{style:{fontSize:7,color:"rgba(255,255,255,0.78)",marginBottom:1},children:e}),(0,t.jsx)("div",{style:{fontSize:9,fontWeight:700,color:s},children:i})]},e))})]})]})]}),(0,t.jsxs)("div",{style:{borderRadius:8,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,0.15)",background:"#f1f5f9",padding:"8px 10px"},children:[(0,t.jsx)("div",{style:{fontSize:9.5,fontWeight:700,color:s,marginBottom:2},children:i.schoolName}),(0,t.jsx)("div",{style:{fontSize:7,color:"#64748b",marginBottom:7,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:i.schoolAddress}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderTop:"1px solid #cbd5e1",borderBottom:"1px solid #cbd5e1",marginBottom:8},children:[(0,t.jsx)("div",{style:{width:28,height:28,flexShrink:0,borderRadius:4,background:s,display:"flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"#fff",strokeWidth:"1.8",children:[(0,t.jsx)("rect",{x:"3",y:"3",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"14",y:"3",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"3",y:"14",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"14",y:"14",width:"3",height:"3"})]})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontSize:7.5,fontWeight:700,color:s},children:"Emergency Contact"}),(0,t.jsx)("div",{style:{fontSize:7,color:"#1e293b"},children:e.parentName}),(0,t.jsx)("div",{style:{fontSize:7,color:"#64748b"},children:e.emergencyContact})]})]}),(0,t.jsx)("div",{style:{display:"flex",justifyContent:"space-between",padding:"0 8px"},children:["Parent Signature","Principal Signature"].map(e=>(0,t.jsxs)("div",{style:{textAlign:"center"},children:[(0,t.jsx)("div",{style:{width:62,borderBottom:`1px solid ${s}`,marginBottom:2}}),(0,t.jsx)("div",{style:{fontSize:7,color:"#64748b"},children:e})]},e))})]})]})}function v(){let[e,v]=(0,i.useState)([]),[b,j]=(0,i.useState)([]),[y,w]=(0,i.useState)([]),[k,S]=(0,i.useState)([]),[C,N]=(0,i.useState)([]),[I,$]=(0,i.useState)([]),[B,z]=(0,i.useState)("all"),[E,D]=(0,i.useState)("all"),[P,R]=(0,i.useState)("all"),[A,T]=(0,i.useState)("all"),[L,H]=(0,i.useState)([]),[U,M]=(0,i.useState)(!1);(0,i.useEffect)(()=>{O(),W()},[]);let O=async()=>{v(await fetch(`${f.BASE_URL}/School/list`).then(e=>e.json())||[])},W=async()=>{let e=await fetch(`${f.BASE_URL}/Student/getall`).then(e=>e.json()),t=[];for(let i of e){if(!i.studentId)continue;let e=await fetch(`${f.BASE_URL}/Student/applications/student/${i.studentId}`).then(e=>e.json());e?.length&&e[0]?.status==="accept"&&t.push(i)}N(t),$(t),w(Array.from(new Map(t.map(e=>[e.classId,{classId:e.classId,className:e.className}])).values()))};(0,i.useEffect)(()=>{"all"!==B?(fetch(`${f.BASE_URL}/School/academicyear/${B}`).then(e=>e.json()).then(j),fetch(`${f.BASE_URL}/ClassDivision/getclasses?schoolId=${B}`).then(e=>e.json()).then(w)):(j([]),w([]),S([]))},[B]),(0,i.useEffect)(()=>{"all"!==P?fetch(`${f.BASE_URL}/ClassDivision/getdivisions?classId=${P}`).then(e=>e.json()).then(S):S([])},[P]),(0,i.useEffect)(()=>{$(C.filter(e=>("all"===B||e.schoolId?.toString()===B)&&("all"===E||e.academicYearId?.toString()===E)&&("all"===P||e.classId?.toString()===P)&&("all"===A||e.divisionId?.toString()===A))),H([])},[B,E,P,A,C]);let _=async()=>{let t=I.filter(e=>L.includes(e.studentId));if(t.length){M(!0);try{let i={};await Promise.all(t.map(async e=>{var t;e.photoPath&&(i[e.studentId]=await (!(t=e.photoPath)?Promise.resolve(""):new Promise(e=>{let i=new Image;i.crossOrigin="anonymous",i.onload=()=>{try{let t=document.createElement("canvas");t.width=i.naturalWidth||i.width,t.height=i.naturalHeight||i.height;let s=t.getContext("2d");if(!s)return void e("");s.drawImage(i,0,0),e(t.toDataURL("image/jpeg",.92))}catch{e(t)}},i.onerror=()=>{let i=new Image;i.onload=()=>e(t),i.onerror=()=>e(""),i.src=t+(t.includes("?")?"&":"?")+"_nc="+Date.now()},i.src=t+(t.includes("?")?"&":"?")+"_cb="+Date.now()})))}));let s=t.map(t=>{var s;let l,d,r,a,n,o=e.find(e=>e.schoolId===t.schoolId);if(!o)return"";let{front:c,back:h}=(s=i[t.studentId]||"",l="#1e3a8a",d="#1d4ed8",r="85.6mm",a="54mm",{front:(n=(e,t)=>`
    <div style="
      width:${r};min-width:${r};max-width:${r};
      height:${a};min-height:${a};max-height:${a};
      border-radius:3.5mm;overflow:hidden;
      background:${t};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;color-adjust:exact;
      font-family:Arial,Helvetica,sans-serif;
      box-sizing:border-box;
      display:flex;flex-direction:column;
      page-break-inside:avoid;break-inside:avoid;
    ">${e}</div>`)(`
    <!-- HEADER -->
    <div style="
      background:${l};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      padding:2.5mm 3mm 2mm;
      display:flex;align-items:center;justify-content:center;gap:2.5mm;
      border-bottom:0.5mm solid rgba(255,255,255,0.22);
    ">
      <div style="
        width:9mm;height:9mm;border-radius:50%;
        background:#ffffff;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
        display:flex;align-items:center;justify-content:center;flex-shrink:0;
      ">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="${l}" stroke-width="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <div>
        <div style="font-size:7.5pt;font-weight:700;color:#fff;line-height:1.3;">
          ${o.schoolName}
        </div>
        <div style="font-size:5pt;color:rgba(255,255,255,0.80);letter-spacing:0.7px;">
          STUDENT IDENTITY CARD
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div style="
      background:${d};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      flex:1;display:flex;align-items:center;gap:3mm;padding:2.5mm 3mm;
    ">
      <!-- photo -->
      <div style="
        width:15mm;height:19mm;flex-shrink:0;
        border-radius:1.5mm;overflow:hidden;
        background:#ffffff;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
        border:0.6mm solid rgba(255,255,255,0.55);
      ">
        ${s?`<img src="${s}" style="width:100%;height:100%;object-fit:cover;display:block;"/>`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="${l}">
                 <circle cx="12" cy="8" r="4"/>
                 <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
               </svg>
             </div>`}
      </div>

      <!-- info -->
      <div style="flex:1;">
        <div style="font-size:9.5pt;font-weight:700;color:#fff;margin-bottom:2.5mm;line-height:1.2;">
          ${t.fullName||""}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5mm;">
          ${u("Class",`${t.className||""}&#8209;${t.divisionName||""}`)}
          ${u("Roll No",String(t.rollNo||""))}
          ${u("Blood",t.bloodGroup||"","#fde047")}
          ${u("DOB",g(t.dob))}
        </div>
      </div>
    </div>
  `,d),back:n(`
    <div style="
      padding:3mm;height:100%;
      background:#f1f5f9;
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      display:flex;flex-direction:column;
    ">
      <div style="font-size:8.5pt;font-weight:700;color:${l};margin-bottom:1mm;">
        ${o.schoolName}
      </div>
      <div style="
        font-size:6pt;color:#64748b;margin-bottom:2mm;
        overflow:hidden;display:-webkit-box;
        -webkit-line-clamp:2;-webkit-box-orient:vertical;
      ">${o.schoolAddress||""}</div>

      <!-- emergency -->
      <div style="
        display:flex;align-items:center;gap:2.5mm;
        padding:2mm 0;
        border-top:0.4mm solid #cbd5e1;
        border-bottom:0.4mm solid #cbd5e1;
        margin-bottom:3mm;
      ">
        <div style="
          width:10mm;height:10mm;flex-shrink:0;border-radius:1.5mm;
          background:${l};
          -webkit-print-color-adjust:exact;print-color-adjust:exact;
          display:flex;align-items:center;justify-content:center;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24"
               fill="none" stroke="#fff" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="3" height="3"/>
          </svg>
        </div>
        <div>
          <div style="font-size:6.5pt;font-weight:700;color:${l};">Emergency Contact</div>
          <div style="font-size:6pt;color:#1e293b;">${t.parentName||""}</div>
          <div style="font-size:6pt;color:#64748b;">${t.emergencyContact||""}</div>
        </div>
      </div>

      <!-- signatures -->
      <div style="display:flex;justify-content:space-between;padding:0 4mm;margin-top:auto;">
        <div style="text-align:center;">
          <div style="width:22mm;border-bottom:0.5mm solid ${l};margin-bottom:1.2mm;"></div>
          <div style="font-size:5.5pt;color:#64748b;">Parent Signature</div>
        </div>
        <div style="text-align:center;">
          <div style="width:22mm;border-bottom:0.5mm solid ${l};margin-bottom:1.2mm;"></div>
          <div style="font-size:5.5pt;color:#64748b;">Principal Signature</div>
        </div>
      </div>
    </div>
  `,"#f1f5f9")});return`<div class="pair">${c}${h}</div>`}).join("\n"),l=window.open("","_blank");if(!l)return void alert("Allow popups for this site to print.");l.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Student ID Cards</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body{
      background:#fff;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      color-adjust:exact;
    }
    body{padding:6mm;}
    .grid{display:flex;flex-wrap:wrap;gap:4mm;}
    .pair{display:flex;gap:3mm;page-break-inside:avoid;break-inside:avoid;}
    @page{size:A4 landscape;margin:6mm;}
    @media print{
      body{padding:0;}
      *{
        -webkit-print-color-adjust:exact!important;
        print-color-adjust:exact!important;
        color-adjust:exact!important;
      }
    }
  </style>
</head>
<body onload="setTimeout(()=>window.print(),800)">
  <div class="grid">${s}</div>
</body>
</html>`),l.document.close()}finally{M(!1)}}};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)(s.PageHeader,{title:"Print ID Cards",description:"Select students and print ID cards"}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardContent,{className:"grid grid-cols-1 md:grid-cols-4 gap-4 pt-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"School"}),(0,t.jsxs)(a.Select,{value:B,onValueChange:z,children:[(0,t.jsx)(a.SelectTrigger,{children:(0,t.jsx)(a.SelectValue,{})}),(0,t.jsxs)(a.SelectContent,{children:[(0,t.jsx)(a.SelectItem,{value:"all",children:"All"}),e.map(e=>(0,t.jsx)(a.SelectItem,{value:e.schoolId.toString(),children:e.schoolName},e.schoolId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Academic Year"}),(0,t.jsxs)(a.Select,{value:E,onValueChange:D,children:[(0,t.jsx)(a.SelectTrigger,{children:(0,t.jsx)(a.SelectValue,{})}),(0,t.jsxs)(a.SelectContent,{children:[(0,t.jsx)(a.SelectItem,{value:"all",children:"All"}),b.map(e=>(0,t.jsx)(a.SelectItem,{value:e.academicYearId.toString(),children:e.academicYear},e.academicYearId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Class"}),(0,t.jsxs)(a.Select,{value:P,onValueChange:R,children:[(0,t.jsx)(a.SelectTrigger,{children:(0,t.jsx)(a.SelectValue,{})}),(0,t.jsxs)(a.SelectContent,{children:[(0,t.jsx)(a.SelectItem,{value:"all",children:"All"}),y.map(e=>(0,t.jsx)(a.SelectItem,{value:e.classId.toString(),children:e.className},e.classId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Division"}),(0,t.jsxs)(a.Select,{value:A,onValueChange:T,children:[(0,t.jsx)(a.SelectTrigger,{children:(0,t.jsx)(a.SelectValue,{})}),(0,t.jsxs)(a.SelectContent,{children:[(0,t.jsx)(a.SelectItem,{value:"all",children:"All"}),k.map(e=>(0,t.jsx)(a.SelectItem,{value:e.divisionId.toString(),children:e.divisionName},e.divisionId))]})]})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-1 xl:grid-cols-3 gap-6",children:[(0,t.jsxs)(l.Card,{className:"xl:col-span-1",children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"flex gap-2 items-center",children:[(0,t.jsx)(m.User,{className:"w-5 h-5"})," Select Students"]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("label",{className:"flex gap-2 items-center cursor-pointer",children:[(0,t.jsx)(r.Checkbox,{checked:L.length===I.length&&I.length>0,onCheckedChange:()=>H(L.length===I.length?[]:I.map(e=>e.studentId))}),"Select All"]}),(0,t.jsxs)(o.Badge,{children:[L.length," selected"]})]}),(0,t.jsxs)("div",{className:"max-h-72 overflow-y-auto space-y-1",children:[I.map(e=>(0,t.jsxs)("label",{className:"flex gap-2 p-2 rounded hover:bg-muted cursor-pointer",children:[(0,t.jsx)(r.Checkbox,{checked:L.includes(e.studentId),onCheckedChange:()=>{let t;return t=e.studentId,H(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t])}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.fullName}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e.className," – ",e.divisionName]})]})]},e.studentId)),0===I.length&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground text-center py-4",children:"No students found"})]}),(0,t.jsxs)(d.Button,{className:"w-full",disabled:!L.length||U,onClick:_,children:[(0,t.jsx)(c.Printer,{className:"w-4 h-4 mr-2"}),U?"Preparing…":"Print"]}),(0,t.jsxs)(d.Button,{className:"w-full",variant:"outline",disabled:!L.length||U,onClick:_,children:[(0,t.jsx)(h.FileDown,{className:"w-4 h-4 mr-2"}),U?"Preparing…":"Save as PDF"]})]})]}),(0,t.jsx)("div",{className:"xl:col-span-2",children:(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"flex gap-2 items-center",children:[(0,t.jsx)(x.CreditCard,{className:"w-5 h-5"})," Preview"]})}),(0,t.jsx)(l.CardContent,{children:0===L.length?(0,t.jsx)("p",{className:"text-sm text-muted-foreground text-center py-10",children:"Select students to preview their ID cards."}):(0,t.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:L.map(i=>{let s=I.find(e=>e.studentId===i),l=e.find(e=>e.schoolId===s?.schoolId);return s&&l?(0,t.jsx)(p,{student:s,school:l},i):null})})})]})})]})]})}e.s(["default",()=>v])}]);