(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93969,e=>{"use strict";var t=e.i(43476);function s({title:e,description:s,action:a}){return(0,t.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"fs-4 fw-bold text-foreground",children:e}),s&&(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:s})]}),a&&(0,t.jsx)("div",{className:"flex-shrink-0",children:a})]})}e.s(["PageHeader",()=>s])},25959,27365,61659,54858,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(20783),i=e.i(30030),l=e.i(81140),r=e.i(69340),d=e.i(99682),n=e.i(35804),o=e.i(96626),c=e.i(48425),p="Checkbox",[x,h]=(0,i.createContextScope)(p),[m,g]=x(p),u=s.forwardRef((e,i)=>{let{__scopeCheckbox:d,name:n,checked:o,defaultChecked:p,required:x,disabled:h,value:g="on",onCheckedChange:u,form:f,...b}=e,[w,N]=s.useState(null),S=(0,a.useComposedRefs)(i,e=>N(e)),k=s.useRef(!1),C=!w||f||!!w.closest("form"),[I=!1,$]=(0,r.useControllableState)({prop:o,defaultProp:p,onChange:u}),E=s.useRef(I);return s.useEffect(()=>{let e=w?.form;if(e){let t=()=>$(E.current);return e.addEventListener("reset",t),()=>e.removeEventListener("reset",t)}},[w,$]),(0,t.jsxs)(m,{scope:d,state:I,disabled:h,children:[(0,t.jsx)(c.Primitive.button,{type:"button",role:"checkbox","aria-checked":j(I)?"mixed":I,"aria-required":x,"data-state":y(I),"data-disabled":h?"":void 0,disabled:h,value:g,...b,ref:S,onKeyDown:(0,l.composeEventHandlers)(e.onKeyDown,e=>{"Enter"===e.key&&e.preventDefault()}),onClick:(0,l.composeEventHandlers)(e.onClick,e=>{$(e=>!!j(e)||!e),C&&(k.current=e.isPropagationStopped(),k.current||e.stopPropagation())})}),C&&(0,t.jsx)(v,{control:w,bubbles:!k.current,name:n,value:g,checked:I,required:x,disabled:h,form:f,style:{transform:"translateX(-100%)"},defaultChecked:!j(p)&&p})]})});u.displayName=p;var f="CheckboxIndicator",b=s.forwardRef((e,s)=>{let{__scopeCheckbox:a,forceMount:i,...l}=e,r=g(f,a);return(0,t.jsx)(o.Presence,{present:i||j(r.state)||!0===r.state,children:(0,t.jsx)(c.Primitive.span,{"data-state":y(r.state),"data-disabled":r.disabled?"":void 0,...l,ref:s,style:{pointerEvents:"none",...e.style}})})});b.displayName=f;var v=e=>{let{control:a,checked:i,bubbles:l=!0,defaultChecked:r,...o}=e,c=s.useRef(null),p=(0,d.usePrevious)(i),x=(0,n.useSize)(a);s.useEffect(()=>{let e=c.current,t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(p!==i&&t){let s=new Event("click",{bubbles:l});e.indeterminate=j(i),t.call(e,!j(i)&&i),e.dispatchEvent(s)}},[p,i,l]);let h=s.useRef(!j(i)&&i);return(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:r??h.current,...o,tabIndex:-1,ref:c,style:{...e.style,...x,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function j(e){return"indeterminate"===e}function y(e){return j(e)?"indeterminate":e?"checked":"unchecked"}var w=e.i(78784),N=e.i(47163);function S({className:e,...s}){return(0,t.jsx)(u,{"data-slot":"checkbox",className:(0,N.cn)("peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...s,children:(0,t.jsx)(b,{"data-slot":"checkbox-indicator",className:"flex items-center justify-center text-current transition-none",children:(0,t.jsx)(w.CheckIcon,{className:"size-3.5"})})})}e.s(["Checkbox",()=>S],25959);var k=e.i(75254);let C=(0,k.default)("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);e.s(["FileDown",()=>C],27365);let I=(0,k.default)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);e.s(["CreditCard",()=>I],61659),e.i(47167),e.s(["BASE_URL",0,"http://5.231.93.226:7135/api"],54858)},52391,e=>{"use strict";var t=e.i(43476),s=e.i(71645),a=e.i(93969),i=e.i(70065),l=e.i(67881),r=e.i(25959),d=e.i(62870),n=e.i(10708),o=e.i(94179),c=e.i(3281),p=e.i(27365),x=e.i(84614),h=e.i(61659),m=e.i(54858);function g(){(0,s.useRef)(null);let[e,g]=(0,s.useState)([]),[f,b]=(0,s.useState)([]),[v,j]=(0,s.useState)([]),[y,w]=(0,s.useState)([]),[N,S]=(0,s.useState)([]),[k,C]=(0,s.useState)([]),[I,$]=(0,s.useState)("all"),[E,z]=(0,s.useState)("all"),[_,D]=(0,s.useState)("all"),[P,T]=(0,s.useState)("all"),[B,R]=(0,s.useState)([]);(0,s.useEffect)(()=>{A(),U()},[]);let L=Number(localStorage.getItem("schoolId")),A=async()=>{let e=await fetch(`${m.BASE_URL}/School/list`).then(e=>e.json());g(e?.filter(e=>e.schoolId===L)||[])},U=async()=>{let e=await fetch(`${m.BASE_URL}/Student/getall`).then(e=>e.json()),t=[];for(let s of e){if(!s.studentId||s.schoolId!==L)continue;let e=await fetch(`${m.BASE_URL}/Student/applications/student/${s.studentId}`).then(e=>e.json());e?.length&&e[0]?.status==="accept"&&t.push(s)}S(t),C(t),j(Array.from(new Map(t.map(e=>[e.classId,{classId:e.classId,className:e.className}])).values()))};(0,s.useEffect)(()=>{"all"!==I?(fetch(`${m.BASE_URL}/School/academicyear/${I}`).then(e=>e.json()).then(b),fetch(`${m.BASE_URL}/ClassDivision/getclasses?schoolId=${I}`).then(e=>e.json()).then(j)):(b([]),j([]),w([]))},[I]),(0,s.useEffect)(()=>{"all"!==_?fetch(`${m.BASE_URL}/ClassDivision/getdivisions?classId=${_}`).then(e=>e.json()).then(w):w([])},[_]),(0,s.useEffect)(()=>{C(N.filter(e=>("all"===I||e.schoolId?.toString()===I)&&("all"===E||e.academicYearId?.toString()===E)&&("all"===_||e.classId?.toString()===_)&&("all"===P||e.divisionId?.toString()===P))),R([])},[I,E,_,P,N]);let H=()=>{let t=k.filter(e=>B.includes(e.studentId));if(!t.length)return;let s=window.open("","_blank");if(!s)return;let a=t.map(t=>{let s=e.find(e=>e.schoolId===t.schoolId);if(!s)return"";let a=!!s.cardTemplateFront,i=!!s.cardTemplateBack,l=new Date(t.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),r=a?`<div style="position:relative;overflow:hidden;min-height:200px;">
          <img src="data:image/png;base64,${s.cardTemplateFront}"
            style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px;">
            <div style="width:48px;height:56px;border-radius:4px;overflow:hidden;border:2px solid rgba(255,255,255,0.8);margin-top:30px;">
              <img src="${t.photoPath||""}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <p style="font-weight:bold;font-size:10px;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:2px 0;">
              ${t.fullName}
            </p>
            <p style="font-size:8px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:1px 0;">
              ${t.className}-${t.divisionName} &nbsp;|&nbsp; Roll: ${t.rollNo}
            </p>
            <p style="font-size:8px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:1px 0;">
              DOB: ${l} &nbsp;|&nbsp; <span style="color:#fde047;">${t.bloodGroup}</span>
            </p>
          </div>
        </div>`:`<div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:10px;">
          <div style="text-align:center;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:6px;margin-bottom:6px;">
            ${s.schoolLogo?`<img src="data:image/png;base64,${s.schoolLogo}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;margin:0 auto 3px;" />`:'<div style="width:28px;height:28px;background:#fff;border-radius:50%;margin:0 auto 3px;"></div>'}
            <p style="font-weight:bold;font-size:9px;margin:1px 0;">${s.schoolName}</p>
            <p style="font-size:6px;opacity:0.8;letter-spacing:1px;">STUDENT IDENTITY CARD</p>
          </div>
          <div style="text-align:center;margin-bottom:6px;">
            <div style="width:38px;height:46px;background:#fff;border-radius:3px;overflow:hidden;margin:0 auto 3px;border:1px solid rgba(255,255,255,0.4);">
              <img src="${t.photoPath||""}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <p style="font-weight:bold;font-size:10px;margin:2px 0;">${t.fullName}</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;">
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Class</span>
              <span style="font-size:8px;font-weight:600;">${t.className}-${t.divisionName}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Roll No</span>
              <span style="font-size:8px;font-weight:600;">${t.rollNo}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Blood</span>
              <span style="font-size:8px;font-weight:600;color:#fde047;">${t.bloodGroup}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">DOB</span>
              <span style="font-size:8px;font-weight:600;">${l}</span>
            </div>
          </div>
        </div>`,d=i?`<div style="position:relative;overflow:hidden;min-height:120px;">
          <img src="data:image/png;base64,${s.cardTemplateBack}"
            style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:6px;">
            <p style="font-size:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:0 0 2px;">
              Emergency: ${t.parentName} &nbsp; ${t.emergencyContact}
            </p>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;">
              <div style="text-align:center;">
                <div style="width:38px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:2px;"></div>
                <span style="font-size:6px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.8);">Parent</span>
              </div>
              <div style="text-align:center;">
                ${s.principalSignature?`<img src="data:image/png;base64,${s.principalSignature}" style="height:16px;object-fit:contain;display:block;margin:0 auto 2px;" />`:""}
                <div style="width:38px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:2px;"></div>
                <span style="font-size:6px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.8);">Principal</span>
              </div>
            </div>
          </div>
        </div>`:`<div style="background:#f8fafc;padding:10px;font-size:8px;">
          <p style="font-weight:bold;font-size:8px;color:#1d4ed8;margin:0 0 2px;">${s.schoolName}</p>
          <p style="font-size:7px;color:#64748b;margin:0 0 6px;">${s.schoolAddress}</p>
          <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:4px 0;margin-bottom:6px;">
            <p style="font-size:7px;font-weight:600;color:#1d4ed8;margin:0 0 1px;">Emergency</p>
            <p style="font-size:7px;margin:0 0 1px;">${t.parentName}</p>
            <p style="font-size:7px;color:#64748b;margin:0;">${t.emergencyContact}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <div style="text-align:center;">
              <div style="width:38px;border-bottom:1px solid #1d4ed8;margin-bottom:2px;"></div>
              <span style="font-size:6px;color:#94a3b8;">Parent</span>
            </div>
            <div style="text-align:center;">
              ${s.principalSignature?`<img src="data:image/png;base64,${s.principalSignature}" style="height:16px;object-fit:contain;display:block;margin:0 auto 2px;" />`:""}
              <div style="width:38px;border-bottom:1px solid #1d4ed8;margin-bottom:2px;"></div>
              <span style="font-size:6px;color:#94a3b8;">Principal</span>
            </div>
          </div>
        </div>`;return`
      <div style="width:160px;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);background:#fff;break-inside:avoid;">
        ${r}
        ${d}
      </div>`}).join(""),i=`<!DOCTYPE html>
<html>
  <head>
    <title>ID Cards</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { padding: 16px; background: #fff; }
      .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      @media print {
        body { padding: 8px; }
        .cards-container { gap: 8px; }
      }
    </style>
  </head>
  <body>
    <div class="cards-container">
      ${a}
    </div>
    <script>
      window.onload = function() {
        // Wait for all images to load before printing
        const images = document.querySelectorAll('img');
        let loaded = 0;
        if (images.length === 0) { window.print(); return; }
        images.forEach(img => {
          if (img.complete) {
            loaded++;
            if (loaded === images.length) window.print();
          } else {
            img.onload = img.onerror = () => {
              loaded++;
              if (loaded === images.length) window.print();
            };
          }
        });
      };
    </script>
  </body>
</html>`;s.document.write(i),s.document.close()};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)(a.PageHeader,{title:"Print ID Cards",description:"Select students and print ID cards"}),(0,t.jsx)(i.Card,{children:(0,t.jsxs)(i.CardContent,{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"School"}),(0,t.jsxs)(d.Select,{value:I,onValueChange:$,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"All"}),e.map(e=>(0,t.jsx)(d.SelectItem,{value:e.schoolId.toString(),children:e.schoolName},e.schoolId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Academic Year"}),(0,t.jsxs)(d.Select,{value:E,onValueChange:z,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"All"}),f.map(e=>(0,t.jsx)(d.SelectItem,{value:e.academicYearId.toString(),children:e.academicYear},e.academicYearId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Class"}),(0,t.jsxs)(d.Select,{value:_,onValueChange:D,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"All"}),v.map(e=>(0,t.jsx)(d.SelectItem,{value:e.classId.toString(),children:e.className},e.classId))]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(n.Label,{children:"Division"}),(0,t.jsxs)(d.Select,{value:P,onValueChange:T,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"All"}),y.map(e=>(0,t.jsx)(d.SelectItem,{value:e.divisionId.toString(),children:e.divisionName},e.divisionId))]})]})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-1 xl:grid-cols-3 gap-6",children:[(0,t.jsxs)(i.Card,{className:"xl:col-span-1",children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsxs)(i.CardTitle,{className:"flex gap-2 items-center",children:[(0,t.jsx)(x.User,{className:"w-5 h-5"})," Select Students"]})}),(0,t.jsxs)(i.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsxs)("label",{className:"flex gap-2",children:[(0,t.jsx)(r.Checkbox,{onCheckedChange:()=>{B.length===k.length?R([]):R(k.map(e=>e.studentId))}}),"Select All"]}),(0,t.jsx)(o.Badge,{children:B.length})]}),(0,t.jsx)("div",{className:"max-h-72 overflow-y-auto space-y-1",children:k.map(e=>(0,t.jsxs)("label",{className:"flex gap-2 p-2",children:[(0,t.jsx)(r.Checkbox,{checked:B.includes(e.studentId),onCheckedChange:()=>{var t;return t=e.studentId,void R(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t])}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.fullName}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e.className," - ",e.divisionName]})]})]},e.studentId))}),(0,t.jsxs)(l.Button,{className:"w-full",disabled:!B.length,onClick:H,children:[(0,t.jsx)(c.Printer,{className:"w-4 h-4 mr-2"})," Print"]}),(0,t.jsxs)(l.Button,{className:"w-full",variant:"outline",disabled:!B.length,onClick:H,children:[(0,t.jsx)(p.FileDown,{className:"w-4 h-4 mr-2"})," Save as PDF"]})]})]}),(0,t.jsx)("div",{className:"xl:col-span-2",children:(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsxs)(i.CardTitle,{className:"flex gap-2 items-center",children:[(0,t.jsx)(h.CreditCard,{className:"w-5 h-5"})," Preview"]})}),(0,t.jsx)(i.CardContent,{className:"grid grid-cols-2 lg:grid-cols-3 gap-4",children:B.map(s=>{let a=k.find(e=>e.studentId===s);if(!a)return null;let i=e.find(e=>e.schoolId===a.schoolId);return i?(0,t.jsx)("div",{id:`card-${a.studentId}`,children:(0,t.jsx)(u,{student:a,school:i})},s):null})})]})})]})]})}function u({student:e,school:s}){let a=!!s.cardTemplateFront,i=!!s.cardTemplateBack;return(0,t.jsxs)("div",{className:"overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto",children:[a?(0,t.jsxs)("div",{className:"relative overflow-hidden",style:{minHeight:"200px"},children:[(0,t.jsx)("img",{src:`data:image/png;base64,${s.cardTemplateFront}`,className:"w-full h-full object-cover",alt:"Card Front",style:{display:"block"}}),(0,t.jsxs)("div",{className:"absolute inset-0 flex flex-col items-center justify-center gap-1 p-2",children:[(0,t.jsx)("div",{className:"w-12 h-14 rounded overflow-hidden border-2 border-white mt-8",children:(0,t.jsx)("img",{src:e.photoPath||"/placeholder.svg?height=56&width=48",alt:e.fullName,className:"w-full h-full object-cover"})}),(0,t.jsx)("p",{className:"font-bold text-[10px] text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:e.fullName}),(0,t.jsxs)("div",{className:"flex gap-2 text-white text-[8px]",children:[(0,t.jsxs)("span",{className:"drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:[e.className,"-",e.divisionName]}),(0,t.jsxs)("span",{className:"drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:["Roll: ",e.rollNo]})]}),(0,t.jsxs)("div",{className:"flex gap-2 text-white text-[8px]",children:[(0,t.jsxs)("span",{className:"drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:["DOB: ",new Date(e.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})]}),(0,t.jsx)("span",{className:"text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:e.bloodGroup})]})]})]}):(0,t.jsxs)("div",{className:"bg-gradient-to-br from-blue-700 to-blue-500 text-white p-2.5",children:[(0,t.jsxs)("div",{className:"text-center border-b border-white/20 pb-2 mb-2",children:[(0,t.jsx)("div",{className:"w-8 h-8 bg-white rounded-full mx-auto mb-1 flex items-center justify-center",children:s.schoolLogo?(0,t.jsx)("img",{src:`data:image/png;base64,${s.schoolLogo}`,className:"w-full h-full object-cover rounded-full",alt:"Logo"}):(0,t.jsxs)("svg",{className:"w-5 h-5 text-primary",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,t.jsx)("path",{d:"M22 10v6M2 10l10-5 10 5-10 5z"}),(0,t.jsx)("path",{d:"M6 12v5c3 3 9 3 12 0v-5"})]})}),(0,t.jsx)("p",{className:"font-bold text-[9px]",children:s.schoolName}),(0,t.jsx)("p",{className:"text-[6px] opacity-80 tracking-wider",children:"STUDENT IDENTITY CARD"})]}),(0,t.jsxs)("div",{className:"text-center mb-2",children:[(0,t.jsx)("div",{className:"w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30",children:(0,t.jsx)("img",{src:e.photoPath||"/placeholder.svg?height=48&width=40",alt:e.fullName,className:"w-full h-full object-cover"})}),(0,t.jsx)("p",{className:"font-bold text-[11px]",children:e.fullName})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-1",children:[(0,t.jsxs)("div",{className:"bg-white/15 rounded px-1.5 py-1 text-center",children:[(0,t.jsx)("span",{className:"block text-[6px] opacity-75",children:"Class"}),(0,t.jsxs)("span",{className:"font-semibold text-[8px]",children:[e.className,"-",e.divisionName]})]}),(0,t.jsxs)("div",{className:"bg-white/15 rounded px-1.5 py-1 text-center",children:[(0,t.jsx)("span",{className:"block text-[6px] opacity-75",children:"Roll No"}),(0,t.jsx)("span",{className:"font-semibold text-[8px]",children:e.rollNo})]}),(0,t.jsxs)("div",{className:"bg-white/15 rounded px-1.5 py-1 text-center",children:[(0,t.jsx)("span",{className:"block text-[6px] opacity-75",children:"Blood"}),(0,t.jsx)("span",{className:"font-semibold text-[8px] text-yellow-300",children:e.bloodGroup})]}),(0,t.jsxs)("div",{className:"bg-white/15 rounded px-1.5 py-1 text-center",children:[(0,t.jsx)("span",{className:"block text-[6px] opacity-75",children:"DOB"}),(0,t.jsx)("span",{className:"font-semibold text-[8px]",children:new Date(e.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})})]})]})]}),i?(0,t.jsxs)("div",{className:"relative overflow-hidden",style:{minHeight:"120px"},children:[(0,t.jsx)("img",{src:`data:image/png;base64,${s.cardTemplateBack}`,className:"w-full h-full object-cover",alt:"Card Back",style:{display:"block"}}),(0,t.jsxs)("div",{className:"absolute inset-0 flex flex-col justify-end p-2 gap-1",children:[(0,t.jsxs)("div",{className:"text-[7px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]",children:[(0,t.jsxs)("p",{className:"font-semibold",children:["Emergency: ",e.parentName]}),(0,t.jsx)("p",{children:e.emergencyContact})]}),(0,t.jsxs)("div",{className:"flex justify-between items-end",children:[(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"w-10 border-b border-white/70 mb-0.5"}),(0,t.jsx)("span",{className:"text-[6px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:"Parent"})]}),(0,t.jsxs)("div",{className:"text-center",children:[s.principalSignature&&(0,t.jsx)("img",{src:`data:image/png;base64,${s.principalSignature}`,className:"h-4 object-contain mx-auto mb-0.5",alt:"Signature"}),(0,t.jsx)("div",{className:"w-10 border-b border-white/70 mb-0.5"}),(0,t.jsx)("span",{className:"text-[6px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",children:"Principal"})]})]})]})]}):(0,t.jsxs)("div",{className:"bg-slate-50 p-2.5 text-[8px]",children:[(0,t.jsx)("p",{className:"font-bold text-primary text-[8px] mb-1",children:s.schoolName}),(0,t.jsx)("p",{className:"text-muted-foreground text-[7px] mb-2 line-clamp-2",children:s.schoolAddress}),(0,t.jsxs)("div",{className:"flex items-center gap-2 py-1.5 border-t border-b border-border mb-1.5",children:[(0,t.jsx)("div",{className:"w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0",children:(0,t.jsxs)("svg",{className:"w-5 h-5 text-white",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[(0,t.jsx)("rect",{x:"3",y:"3",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"14",y:"3",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"3",y:"14",width:"7",height:"7"}),(0,t.jsx)("rect",{x:"14",y:"14",width:"3",height:"3"})]})}),(0,t.jsxs)("div",{className:"text-[7px]",children:[(0,t.jsx)("p",{className:"font-semibold text-primary",children:"Emergency"}),(0,t.jsx)("p",{className:"text-foreground",children:e.parentName}),(0,t.jsx)("p",{className:"text-muted-foreground",children:e.emergencyContact})]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("div",{className:"w-10 border-b border-primary mb-0.5"}),(0,t.jsx)("span",{className:"text-[6px] text-muted-foreground",children:"Parent"})]}),(0,t.jsxs)("div",{className:"text-center",children:[s.principalSignature&&(0,t.jsx)("img",{src:`data:image/png;base64,${s.principalSignature}`,className:"h-4 object-contain mx-auto mb-0.5",alt:"Signature"}),(0,t.jsx)("div",{className:"w-10 border-b border-primary mb-0.5"}),(0,t.jsx)("span",{className:"text-[6px] text-muted-foreground",children:"Principal"})]})]})]})]})}e.s(["default",()=>g])}]);